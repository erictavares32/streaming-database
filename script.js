const rapidApiKey = "9a3cca925dmsha133c7c1b3afc32p16c631jsn210637e396df";  // Your RapidAPI Key

// Function to fetch streaming availability based on TMDb ID
async function fetchStreamingData() {
    const tmdbId = document.getElementById("tmdbId").value;  // Get the TMDb ID entered by the user
    const type = "tv";  // Change this to 'movie' if searching for a movie

    if (!tmdbId) {
        alert("Please enter a TMDb ID.");
        return;
    }

    const url = `https://streaming-availability.p.rapidapi.com/shows/${type}/${tmdbId}`;  // Replace with RapidAPI URL

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
