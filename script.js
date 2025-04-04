const tmdbApiKey = "8015f104741271883e610d9c704183e4";  // Replace with your TMDb API Key
const rapidApiKey = "9a3cca925dmsha133c7c1b3afc32p16c631jsn210637e396df";  // Your RapidAPI Key

// Function to fetch TMDb ID based on the movie/show name
async function fetchTmdbId() {
    const searchQuery = document.getElementById("search").value;
    if (!searchQuery) {
        alert("Please enter a movie or TV show name.");
        return;
    }

    const tmdbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(searchQuery)}&language=en-US&page=1`;

    try {
        const tmdbResponse = await fetch(tmdbUrl);
        const tmdbData = await tmdbResponse.json();

        if (tmdbData.results.length > 0) {
            const tmdbId = tmdbData.results[0].id;  // Get the TMDb ID of the first result (you can adjust for accuracy)
            console.log("TMDb ID:", tmdbId);
            fetchStreamingData(tmdbId);  // Pass the TMDb ID to fetch streaming data
        } else {
            alert("No results found for this search.");
        }
    } catch (error) {
        console.error("Error fetching TMDb data:", error);
        alert("There was an error fetching data from TMDb.");
    }
}

// Function to fetch streaming data using RapidAPI with the TMDb ID
async function fetchStreamingData(tmdbId) {
    const type = "tv";  // Use 'movie' for movies or 'tv' for TV shows
    const url = `https://streaming-availability.p.rapidapi.com/shows/${type}/${tmdbId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
                'x-rapidapi-key': rapidApiKey
            }
        });

        const data = await response.json();
        console.log("API Response:", data);  // Log the full response for debugging

        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "";  // Clear previous results

        if (data && data.streamingInfo && data.streamingInfo.length > 0) {
            const sourceList = document.createElement("ul");

            // Loop through streaming services and display them
            data.streamingInfo.forEach(info => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${info.provider}</strong> - <a href="${info.url}" target="_blank">Watch here</a>`;
                sourceList.appendChild(li);
            });

            resultDiv.appendChild(sourceList);  // Append the list to the result div
        } else {
            resultDiv.innerHTML = "<p>No streaming sources found for this show.</p>";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "<p>Error fetching data. Please try again later.</p>";
    }
}
