const apiKey = "8015f104741271883e610d9c704183e4";
const apiBase = "https://api.themoviedb.org/3";
const imageBase = "https://image.tmdb.org/t/p/w200";

const searchInput = document.createElement("input");
searchInput.placeholder = "Search for movies...";
searchInput.style.padding = "10px";
searchInput.style.margin = "10px";
searchInput.style.width = "60%";

const genreSelect = document.createElement("select");
genreSelect.style.margin = "10px";

const yearSelect = document.createElement("select");
yearSelect.style.margin = "10px";

// Add year options (last 30 years)
const currentYear = new Date().getFullYear();
for (let y = currentYear; y >= currentYear - 30; y--) {
  const option = document.createElement("option");
  option.value = y;
  option.textContent = y;
  yearSelect.appendChild(option);
}

// Add "All Years" option
const allYearsOption = document.createElement("option");
allYearsOption.value = "";
allYearsOption.textContent = "All Years";
allYearsOption.selected = true;
yearSelect.prepend(allYearsOption);

document.body.prepend(yearSelect);
document.body.prepend(genreSelect);
document.body.prepend(searchInput);

const movieContainer = document.createElement("div");
movieContainer.className = "movies";
document.body.appendChild(movieContainer);

async function getGenres() {
  const res = await fetch(`${apiBase}/genre/movie/list?api_key=${apiKey}`);
  const data = await res.json();
  genreSelect.innerHTML = "";

  const allGenresOption = document.createElement("option");
  allGenresOption.value = "";
  allGenresOption.textContent = "All Genres";
  genreSelect.appendChild(allGenresOption);

  data.genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

async function fetchMovies({ searchQuery = "", genre = "", year = "" } = {}) {
  let url;

  if (searchQuery) {
    url = `${apiBase}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}`;
  } else {
    url = `${apiBase}/trending/movie/week?api_key=${apiKey}`;
  }

  if (genre) url += `&with_genres=${genre}`;
  if (year) url += `&primary_release_year=${year}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results || []);
  } catch (err) {
    console.error("Failed to fetch movies", err);
  }
}

function displayMovies(movies) {
  movieContainer.innerHTML = "";
  if (movies.length === 0) {
    movieContainer.innerHTML = "<p>No movies found.</p>";
    return;
  }

  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="${imageBase}${movie.poster_path}" alt="${movie.title}" />
      <p>${movie.release_date ? movie.release_date.slice(0, 4) : ""}</p>
    `;
    movieContainer.appendChild(div);
  });
}

// Event listeners
searchInput.addEventListener("input", () => {
  fetchMovies({
    searchQuery: searchInput.value,
    genre: genreSelect.value,
    year: yearSelect.value,
  });
});

genreSelect.addEventListener("change", () => {
  fetchMovies({
    searchQuery: searchInput.value,
    genre: genreSelect.value,
    year: yearSelect.value,
  });
});

yearSelect.addEventListener("change", () => {
  fetchMovies({
    searchQuery: searchInput.value,
    genre: genreSelect.value,
    year: yearSelect.value,
  });
});

// Init
getGenres();
fetchMovies();
