// Your TMDb and Watchmode API keys
const tmdbApiKey = "8015f104741271883e610d9c704183e4";
const watchmodeApiKey = "NgObMKWGQPhz4UH6Zs8xwidmsw6s8JZdRstAbtio";

// API Endpoints
const tmdbBaseUrl = "https://api.themoviedb.org/3";
const watchmodeBaseUrl = "https://api.watchmode.com/v1";

// DOM Elements
const searchInput = document.createElement("input");
const searchToggle = document.createElement("select");
const genreSelect = document.createElement("select");
const yearSelect = document.createElement("select");
const countrySelect = document.createElement("select");
const movieContainer = document.createElement("div");

// Initialize the application
function init() {
  setupSearchInput();
  setupSearchToggle();
  setupGenreSelect();
  setupYearSelect();
  setupCountrySelect();
  setupMovieContainer();
  fetchGenres();
  fetchCountries();
  fetchMovies();
}

// Setup Functions
function setupSearchInput() {
  searchInput.placeholder = "Search for movies or TV shows...";
  searchInput.style.padding = "10px";
  searchInput.style.margin = "10px";
  searchInput.style.width = "60%";
  searchInput.addEventListener("input", handleSearch);
  document.body.appendChild(searchInput);
}

function setupSearchToggle() {
  const movieOption = document.createElement("option");
  movieOption.value = "movie";
  movieOption.textContent = "Movies";
  const tvOption = document.createElement("option");
  tvOption.value = "tv";
  tvOption.textContent = "TV Shows";
  searchToggle.appendChild(movieOption);
  searchToggle.appendChild(tvOption);
  searchToggle.style.margin = "10px";
  searchToggle.addEventListener("change", handleSearch);
  document.body.appendChild(searchToggle);
}

function setupGenreSelect() {
  genreSelect.style.margin = "10px";
  genreSelect.addEventListener("change", handleSearch);
  document.body.appendChild(genreSelect);
}

function setupYearSelect() {
  yearSelect.style.margin = "10px";
  for (let y = new Date().getFullYear(); y >= 1900; y--) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }
  const allYearsOption = document.createElement("option");
  allYearsOption.value = "";
  allYearsOption.textContent = "All Years";
  allYearsOption.selected = true;
  yearSelect.prepend(allYearsOption);
  yearSelect.addEventListener("change", handleSearch);
  document.body.appendChild(yearSelect);
}

function setupCountrySelect() {
  countrySelect.style.margin = "10px";
  countrySelect.addEventListener("change", handleSearch);
  document.body.appendChild(countrySelect);
}

function setupMovieContainer() {
  movieContainer.className = "movies";
  document.body.appendChild(movieContainer);
}

// Fetch Functions
async function fetchGenres() {
  try {
    const response = await fetch(`${tmdbBaseUrl}/genre/movie/list?api_key=${tmdbApiKey}`);
    const data = await response.json();
    genreSelect.innerHTML = '<option value="">All Genres</option>';
    data.genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
}

async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();
    countrySelect.innerHTML = '<option value="">All Countries</option>';
    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.cca2;
      option.textContent = country.name.common;
      countrySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

async function fetchMovies() {
  const searchQuery = searchInput.value.trim();
  const mediaType = searchToggle.value;
  const genre = genreSelect.value;
  const year = yearSelect.value;
  const country = countrySelect.value;

  let url = `${tmdbBaseUrl}/trending/${mediaType}/week?api_key=${tmdbApiKey}`;
  if (searchQuery) {
    url = `${tmdbBaseUrl}/search/${mediaType}?api_key=${tmdbApiKey}&query=${encodeURIComponent(searchQuery)}`;
  }
  if (genre) url += `&with_genres=${genre}`;
  if (year) url += `&primary_release_year=${year}`;
  if (country) url += `&region=${country}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results || []);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function fetchStreamingAvailability(tmdbId, mediaType) {
  try {
    const response = await fetch(`${watchmodeBaseUrl}/search/?apiKey=${watchmodeApiKey}&search_field=tmdb_id&search_value=${tmdbId}`);
    const data = await response.json();
    if (data.title_results.length > 0) {
      const titleId = data.title_results[0].id;
      const availabilityResponse = await fetch(`${watchmodeBaseUrl}/title/${titleId}/sources/?apiKey=${watchmodeApiKey}`);
      const availabilityData = await availabilityResponse.json();
      return availabilityData;
    }
    return [];
  } catch (error) {
    console.error("Error fetching streaming availability:", error);
    return [];
  }
}

// Event Handlers
function handleSearch() {
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(fetchMovies, 500);
}

// Display Functions
async function displayMovies(movies) {
  movieContainer.innerHTML = "";
  if (movies.length === 0) {
    movieContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  for (const movie of movies) {
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <h3>${movie.title || movie.name}</h3>
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title || movie.name}" />
      <p>${movie.release_date ? movie.release_date.slice
::contentReference[oaicite:0]{index=0}
 
