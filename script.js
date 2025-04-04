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
    // Search TMDb
    const tmdbSearchUrl = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${tmdbApiKey}&query=${encodeURIComponent_
