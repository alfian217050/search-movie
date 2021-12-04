/* Fetch refactor (Async Await) */
const searchButton = document.body.querySelector(".search-button");
searchButton.addEventListener("click", async function () {
	try {
		const inputKeyword = document.body.querySelector(".input-keyword");
		const movies = await getMovies(inputKeyword.value);
		updateUI(movies);
	} catch (err) {
		alert(err);
	}
});

function getMovies(keyword) {
	return fetch(`https://www.omdbapi.com/?apikey=9da156cc&s=${keyword}`)
		.then((r) => {
			if (!r.ok) {
				throw new Error(r.statusText);
			}
			return r.json();
		})
		.then((movies) => {
			if (movies.Response === "False") {
				throw new Error(movies.Error);
			}
			return movies.Search;
		});
}

function updateUI(movies) {
	let cards = "";
	movies.forEach((movie) => {
		cards += showCards(movie);
	});
	const movieContainer = document.body.querySelector(".movie-container");
	movieContainer.innerHTML = cards;
}

/* Ketika tombol Show Details di-klik */
document.addEventListener("click", async function (e) {
	if (e.target.classList.contains("modal-detail-button")) {
		const imdbid = e.target.dataset.imdbid;
		const movieDetail = await getMovieDetail(imdbid);
		updateUIDetail(movieDetail);
	}
});

function getMovieDetail(mDetail) {
	return fetch(`https://www.omdbapi.com/?apikey=9da156cc&i=${mDetail}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			return response.json();
		})
		.then((movie) => {
			if (movie.Response === "False") {
				throw new Error(movie.Error);
			}
			return movie;
		});
}

function updateUIDetail(mDetail) {
	const movieDetail = showMovieDetail(mDetail);
	const modalBody = document.body.querySelector(".modal-body");
	modalBody.innerHTML = movieDetail;
}

function showMovieDetail(movie) {
	return `
	<div class="container-fluid">
			<div class="row">
				<div class="col-md-3">
					<img src="${movie.Poster}" class="img-fluid" />
				</div>

				<div class="col-md">
					<ul class="list-group">
						<li class="list-group-item"><h4>${movie.Title} (${movie.Year})</h4></li>
						<li class="list-group-item"><strong>Director : </strong> ${movie.Director}</li>
						<li class="list-group-item"><strong>Actors : </strong> ${movie.Actors}</li>
						<li class="list-group-item"><strong>Writer : </strong> ${movie.Writer}</li>
						<li class="list-group-item">
							<strong>Plot : </strong> <br />
							${movie.Plot}
						</li>
					</ul>
				</div>
			</div>
		</div>
	`;
}

function showCards(movie) {
	return `
	<div class="col-md-4 my-3">
		<div class="card">
			<img src="${movie.Poster}" class="card-img-top" />
			<div class="card-body">
				<h5 class="card-title mb-2">${movie.Title}</h5>
				<h6 class="card-subtitle mb-2 text-muted mb-4">${movie.Year}</h6>
				<a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#movieDetailModal" data-imdbid="${movie.imdbID}">Show Details</a>
			</div>
		</div>
	</div>`;
}
