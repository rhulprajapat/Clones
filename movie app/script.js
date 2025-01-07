const searchForm = document.querySelector('form');
const movieContainer = document.querySelector('.movie-container');
const inputBox = document.querySelector('.input-Box');

const getMovieInfo = async (movie) => {
    const myAPIKey = "eeb2ae2e";
    const url = `https://www.omdbapi.com/?apikey=${myAPIKey}&t=${movie}`;

    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Response === "False") {
        showNoMovieFound();
    } else {
        showMovieData(data);
    }
};

const showMovieData = (data) => {
    movieContainer.innerHTML = "";
    movieContainer.classList.remove('noBack');

    const { Title, imdbRating, Genre, Actors, Runtime, Released, Poster, Plot } = data;

    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-info');
    movieElement.innerHTML = `<h2>${Title}</h2> <p><strong>Rating: &#11088;</strong> ${imdbRating}</p>`;

    const movieGenreElement = document.createElement('div');
    movieGenreElement.classList.add('movie-genre');

    Genre.split(",").forEach((element) => {
        const p = document.createElement('p');
        p.innerText = element.trim();
        movieGenreElement.appendChild(p);
    });

    movieElement.appendChild(movieGenreElement);

    movieElement.innerHTML += `<p><strong>Released Date:</strong> ${Released}</p>
     <p><strong>Duration:</strong> ${Runtime}</p>
     <p><strong>Cast:</strong> ${Actors}</p> 
     <p><strong>Plot:</strong> ${Plot}</p>`;

    // Movie poster
    const moviePosterElement = document.createElement('div');
    moviePosterElement.classList.add('movie-poster');
    moviePosterElement.innerHTML = `<img src="${Poster}" alt="${Title} Poster" />`;

    movieContainer.appendChild(moviePosterElement);
    movieContainer.appendChild(movieElement);
};

const showNoMovieFound = () => {
    movieContainer.innerHTML = `<h2>No Movie Found</h2>
                                <p>We couldn't find any movie matching your search. Please try again with a different title.</p>`;
    movieContainer.classList.add('noBack');
};

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const movieName = inputBox.value.trim();
    if (movieName !== '') {
        getMovieInfo(movieName);
        movieContainer.innerHTML = `<h2>Searching Movie...</h2>`;
    } else {
        movieContainer.innerHTML = `<h2>Please Search Movie</h2>`;
        movieContainer.classList.add('noBack');
    }
});
