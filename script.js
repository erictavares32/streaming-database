const tmdbApiKey = "8015f104741271883e610d9c704183e4";
const watchmodeApiKey = "NgObMKWGQPhz4UH6Zs8xwidmsw6s8JZdRstAbtio";
const tmdbBase = "https://api.themoviedb.org/3";
const watchmodeBase = "https://api.watchmode.com/v1";
const imageBase = "https://image.tmdb.org/t/p/w200";

let mediaType = "movie";

const searchInput = document.createElement("input");
const typeSelect = document.createElement("select");
const genreSelect = document.createElement("select");
const yearSelect = document.createElement("select");
const countrySelect = document.createElement("select");
const resultsContainer = document.createElement("div");

document.body.prepend(countrySelect);
document.body.prepend(yearSelect);
document.body.prepend(genreSelect);
document.body.prepend(typeSelect);
document.body.prepend(searchInput);
document.body.appendChild(resultsContainer);

searchInput.placeholder = "Search Movies or TV Shows";
searchInput.style.padding = "10px";
searchInput.style.margin = "10px";
searchInput.style.width = "60%";

typeSelect.innerHTML = `<option value="movie">Movies</option><option value="tv">TV Shows</option>`;
typeSelect.style.margin = "10px";
genreSelect.style.margin = "10px";
yearSelect.style.margin = "10px";
countrySelect.style.margin = "10px";

resultsContainer.className = "movies";

// Year filter
const now = new Date().getFullYear();
yearSelect.innerHTML = `<option value="">All Years</option>`;
for (let y = now; y >= 1950; y--) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

// Country list
async function loadCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();
  const sorted = countries.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );
  countrySelect.innerHTML = `<option value="">All Countries</option>`;
  sorted.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.cca2;
    opt.textContent = c.name.common;
    countrySelect.appendChild(opt);
  });
}

// Genre list
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

// Fetch results
async function fetchResults() {
  const query = searchInput.value.trim();
  const genre = genreSelect.value;
  const year = yearSelect.value;
  const region = countrySelect.value;

  let url;
  if (query) {
    url = `${tmdbBase}/search/${mediaType}?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}`;
  } else {
    url = `${tmdbBase}/trending/${mediaType}/week?api_key=${tmdbApiKey}`;
  }

  if (genre) url += `&with_genres=${genre}`;
  if (year) url += `&primary_release_year=${year}`;
  if (region) url += `&region=${region}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayResults(data.results || []);
  } catch (e) {
    console.error("TMDb error
