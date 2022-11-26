const movieList = document.querySelector("#movie-list");
const liveToastContent = document.querySelector("#liveToast");
const liveToastBtn = document.querySelector("#liveToastBtn");

// Input
document.querySelector("#search-button").addEventListener("click", function () {
	getAndShowMovies();
});

document.querySelector("#input-keyword").addEventListener("keyup", function (e) {
	if (e.keyCode === 13) {
		getAndShowMovies();
	}
});

// Cores function
async function getAndShowMovies() {
	try {
		spinner();

		const inputKeyword = validateString(document.querySelector("#input-keyword").value);
		const movies = await getMovie(inputKeyword);
		updateUI(movies);
	} catch (error) {
		toastClick(error);
	}

	document.querySelector("#input-keyword").value = "";
}

async function getMovie(keyword) {
	return await fetch(`https://www.omdbapi.com/?apikey=9da156cc&s=${keyword}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			return response.json();
		})
		.then(async function (response) {
			if (response.Response === "False") {
				if (response.Error === "Movie not found!") {
					fade(movieList);
					movieList.innerHTML = `<h4 class="text-center">Movie gak ditemukan :(`;
					throw new Error("Movie yang kamu cari enggak ditemukan. Silahkan cari yang lain :3");
				}
				throw new Error(response.Error);
			}

			let movies = response.Search;

			let imdbID = movies.map((movie) => {
				return movie.imdbID;
			});

			const movieDetails = await getMovieDetail(imdbID);

			return movieDetails;
		});
}

async function getMovieDetail(imdbID) {
	let movieDetails = await imdbID.map((id) => {
		return fetch(`https://www.omdbapi.com/?apikey=9da156cc&i=${id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				return response.json();
			})
			.then((response) => {
				if (response.Response === "False") {
					throw new Error(response.Error);
				}
				return response;
			});
	});

	movieDetails = await Promise.all(movieDetails).then((r) => r);

	return movieDetails;
}

function updateUI(movieDetails) {
	let content = "";
	movieDetails.forEach((mv) => {
		content += `<div class="col-12 col-lg-4 col-md-6">
					<div class="card">
						<div class="card-body">
							<h4 class="card-title">${mv.Title}</h4>
							<img src="${mv.Poster}" alt="${mv.Title}" class="img-fluid w-100">
							<h6 class="font-extrabold my-3">${mv.Year}</h6>

							<div class="modal-primary me-1 mb-1 d-inline-block">
								<!-- Button trigger for primary themes modal -->
								<button type="button" class="btn btn-primary" data-bs-toggle="modal"
									data-bs-target="#${mv.imdbID}">
									Detail
								</button>

								<!--primary theme Modal -->
								<div class="modal fade text-left" id="${mv.imdbID}" tabindex="-1" role="dialog"
									aria-labelledby="myModalLabel160" aria-hidden="true">
									<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl"
										role="document">
										<div class="modal-content">
											<div class="modal-header bg-primary">
												<h5 class="modal-title white" id="myModalLabel160">
													${mv.Title}
												</h5>
												<button type="button" class="close" data-bs-dismiss="modal"
													aria-label="Close">
													<i data-feather="x"></i>
												</button>
											</div>
											<div class="modal-body">
												<div class="d-lg-flex">
													<div class="pe-3 text-center mb-3">
														<img src="${mv.Poster}" alt="">
													</div>

													<ul class="list-group w-100">
														<li class="list-group-item">Released: ${mv.Released}</li>
														<li class="list-group-item">Runtime: ${mv.Runtime}</li>
														<li class="list-group-item">Type: ${mv.Type}</li>
														<li class="list-group-item">Genre: ${mv.Genre}</li>
														<li class="list-group-item">Director: ${mv.Director}</li>
														<li class="list-group-item">Writer: ${mv.Writer}</li>
														<li class="list-group-item">Actors: ${mv.Actors}</li>
														<li class="list-group-item">Language: ${mv.Language}</li>
														<li class="list-group-item">Country: ${mv.Country}</li>
														<li class="list-group-item">Plot: ${mv.Plot}</li>
														<li class="list-group-item">Rating: ${mv.imdbRating} (based on IMDB's rating)</li>
													</ul>
												</div>
											</div>
											<div class="modal-footer">
												<button type="button" class="btn btn-outline-light"
													data-bs-dismiss="modal">
													<span class="d-sm-block">Close</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>`;
	});

	movieList.innerHTML = content;
}

// Utilities function
function toastClick(error) {
	liveToastContent.innerHTML = `
		<div class="toast-header">
			<svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false">
				<rect width="100%" height="100%" fill="#007aff"></rect>
			</svg>
			<strong class="me-auto">Announcement</strong>
			<!-- <small>11 mins ago</small> -->
			<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
		</div>
		<div class="toast-body">${error}</div>`;

	liveToastBtn.click();
}

function fade(element) {
	element.classList.replace("show", "hide");
	setTimeout(() => {
		element.classList.replace("hide", "show");
	}, 150);
}

function spinner() {
	movieList.innerHTML = `
			<div class="text-center">
				<div class="spinner-border" style="width: 3rem; height: 3rem" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		`;
}

function validateString(inputKeyword) {
	if (inputKeyword === "") {
		fade(movieList);
		movieList.innerHTML = `<h4 class="text-center">Ketik terlebih dahulu movie yang ingin kamu cari ya~!! :></h4>`;

		throw new Error("Input gak boleh kosong!!>_<");
	}
	return inputKeyword;
}
