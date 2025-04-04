const tmdbApiKey = "8015f104741271883e610d9c704183e4";
const watchmodeApiKey = "NgObMKWGQPhz4UH6Zs8xwidmsw6s8JZdRstAbtio";

const app = document.getElementById("app");

const searchInput = document.createElement("input");
searchInput.placeholder = "Search for a movie or TV show...";
app.appendChild(searchInput);

const typeSelect = document.createElement("select");
["movie", "tv"].forEach(type => {
  const option = document.createElement("option");
  option.value = type;
  option.textContent = type.toUpperCase();
  typeSelect.appendChild(option);
});
app.appendChild(typeSelect);

const resultsContainer = document.createElement("div");
resultsContainer.className = "movies";
app.appendChild(resultsContainer);

let mediaType = "movie";

async function fetchResults() {
  const query = searchInput.value.trim();
  if (!query) {
    resultsContainer.innerHTML = "";
    return;
  }

  resultsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const tmdbSearchUrl = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}`;
    const tmdbResponse = await fetch(tmdbSearchUrl);
    const tmdbData = await tmdbResponse.json();

    if (!tmdbData.results || tmdbData.results.length === 0) {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    const results = tmdbData.results.slice(0, 2);
    resultsContainer.innerHTML = "";

    for (const result of results) {
      const tmdb_id = result.id;

      const watchmodeSearchUrl = `https://api.watchmode.com/v1/search/?apiKey=${watchmodeApiKey}&search_field=tmdb_id&search_value=${tmdb_id}&types=${mediaType}`;
      const watchmodeSearchRes = await fetch(watchmodeSearchUrl);
      const watchmodeSearchData = await watchmodeSearchRes.json();

      if (!watchmodeSearchData.title_results || watchmodeSearchData.title_results.length === 0) {
        continue;
      }

      const watchmode_id = watchmodeSearchData.title_results[0].id;

      const sourcesUrl = `https://api.watchmode.com/v1/title/${watchmode_id}/sources/?apiKey=${watchmodeApiKey}`;
      const sourcesRes = await fetch(sourcesUrl);
      const sources = await sourcesRes.json();

      const card = document.createElement("div");
      card.className = "movie";

      const img = document.createElement("img");
      img.src = result.poster_path
        ? `https://image.tmdb.org/t/p/w300${result.poster_path}`
        : "https://via.placeholder.com/300x450?text=No+Image";
      card.appendChild(img);

      const title = document.createElement("h3");
      title.textContent = result.title || result.name;
      card.appendChild(title);

      const sourceList = document.createElement("ul");
      const filteredSources = sources.filter(src => src.region && src.name && src.web_url);
      if (filteredSources.length > 0) {
        filteredSources.forEach(source => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>[${source.region}]</strong> <a href="${source.web_url}" target="_blank">${source.name}</a>`;
          sourceList.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.textContent = "No streaming data found.";
        sourceList.appendChild(li);
      }

      card.appendChild(sourceList);
      resultsContainer.appendChild(card);
    }
  } catch (error) {
    console.error(error);
    resultsContainer.innerHTML = "<p>Error fetching data.</p>";
  }
}

searchInput.addEventListener("input", fetchResults);
typeSelect.addEventListener("change", () => {
  mediaType = typeSelect.value;
  fetchResults();
});
