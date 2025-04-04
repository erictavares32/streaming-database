// script.js

const tmdbApiKey = "8015f104741271883e610d9c704183e4"; // 
const watchmodeApiKey = "NgObMKWGQPhz4UH6Zs8xwidmsw6s8JZdRstAbtio"; // Already good

const tmdbBase = "https://api.themoviedb.org/3";
const watchmodeBase = "https://api.watchmode.com/v1";
const imageBase = "https://image.tmdb.org/t/p/w200";

let mediaType = "movie";

const searchInput = document.createElement("input");
const typeSelect = document.createElement("select");
const genreSelect = document.createElement("select");
const yearSelect = document.createElement("select");
const resultsContainer = document.createElement("div");

const app = document.getElementById("app");
app.appendChild(typeSelect);
app.appendChild(searchInput);
app.appendChild(genreSelect);
app.appendChild(yearSelect);
app.appendChild(resultsContainer);

searchInput.placeholder = "Search Movies or TV Shows";
searchInput.style.margin = "10px";
searchInput.style.width = "60%";

typeSelect.innerHTML = `<option value="movie">Movies</option><option value="tv">TV Shows</option>`;
typeSelect.style.margin = "10px";
genreSelect.style.margin = "10px";
yearSelect.style.margin = "10px";

resultsContainer.className = "movies";

const now = new Date().getFullYear();
yearSelect.innerHTML = `<option value="">All Years</option>`;
for (let y = now; y >= 1950; y--) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

async function loadGenres() {
  const res = await fetch(`${tmdbBase}/genre/${mediaType}/list?api_key=${tmdbApiKey}`);
  const data = await res.json();
  genreSelect.innerHTML = `<option value="">All Genres</option>`;
  data.genres.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.name;
    genreSelect.appendChild(opt);
  });
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

const fetchResults = debounce(async () => {
  const query = searchInput.value.trim();
  const genre = genreSelect.value;
  const year = yearSelect.value;

  if (!query) {
    resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  let url = `${tmdbBase}/search/${mediaType}?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}&page=1`;
  if (genre) url += `&with_genres=${genre}`;
  if (year) url += `&primary_release_year=${year}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayResults(data.results.slice(0, 2)); // Max 2 results
  } catch (e) {
    console.error("TMDb error:", e);
    resultsContainer.innerHTML = "<p>Error loading results.</p>";
  }
}, 1000);

async function displayResults(items) {
  resultsContainer.innerHTML = "";
  if (!items.length) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  for (const item of items) {
    const card = document.createElement("div");
    card.className = "movie";

    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || "").slice(0, 4);
    const poster = item.poster_path ? `${imageBase}${item.poster_path}` : "";

    card.innerHTML = `
      <h3>${title}</h3>
      ${poster ? `<img src="${poster}" alt="${title}" />` : ""}
      <p>${year}</p>
      <div class="streams">Loading streaming info...</div>
    `;

    resultsContainer.appendChild(card);

    const streamBox = card.querySelector(".streams");
    const providers = await getStreaming(item.id);
    if (providers.length) {
      streamBox.innerHTML = `<strong>Streaming:</strong><ul>${providers
        .map((p) => `<li>${p.name} (${p.region || "Global"})</li>`)
        .join("")}</ul>`;
    } else {
      streamBox.innerHTML = "No streaming data found.";
    }
  }
}

async function getStreaming(tmdbId) {
  try {
    const match = await fetch(
      `${watchmodeBase}/search/?apiKey=${watchmodeApiKey}&search_field=tmdb_id&search_value=${tmdbId}`
    );
    const matchData = await match.json();
    const found = matchData.title_results[0];
    if (!found) return [];

    const sourcesRes = await fetch(
      `${watchmodeBase}/title/${found.id}/sources/?apiKey=${watchmodeApiKey}`
    );
    const sources = await sourcesRes.json();

    // Return all sources (no country filter)
    const filtered = sources.filter(
      (s) => s.type === "sub" || s.type === "free"
    );

    // Remove duplicates by name
    const seen = new Set();
    return filtered.filter((s) => {
      if (seen.has(s.name))
