const apiKey = "8015f104741271883e610d9c704183e4";
const apiUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;

async function fetchTrendingMovies() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function displayMovies(movies) {
  const container = document.createElement("div");
  container.className = "movies";

  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" />
    `;
    container.appendChild(div);
  });

  document.body.appendChild(container);
}

fetchTrendingMovies();
