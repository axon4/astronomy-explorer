const resultsNavigation = document.getElementById('results-navigation');
const favouritesNavigation = document.getElementById('favourites-navigation');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const APIKey = 'DEMO_KEY';
const count = 7;
const APIURL = `https://api.nasa.gov/planetary/apod?api_key=${APIKey}&count=${count}`;

let results = new Array();
let favourites = new Object();

function showConTent(page) {
	window.scrollTo({top: 0, behavior: 'instant'});

	if (page === 'results') {
		resultsNavigation.classList.remove('hidden');
		favouritesNavigation.classList.add('hidden');
	} else {
		resultsNavigation.classList.add('hidden');
		favouritesNavigation.classList.remove('hidden');
	};

	loader.classList.add('hidden');
};

function createDOMNodes(page) {
	const currentPageArray = page === 'results' ? results : Object.values(favourites);

	currentPageArray.forEach(result => {
		const card = document.createElement('div');

		card.classList.add('card');

		const link = document.createElement('a');

		link.setAttribute('href', result.hdurl);
		link.setAttribute('title', 'view full image');
		link.setAttribute('target', '_blank');

		const image = document.createElement('img');

		image.setAttribute('src', result.url);
		image.setAttribute('alt', 'NASA Astronomy Picture-of-the-Day');
		image.setAttribute('loading', 'lazy');
		image.classList.add('card-image-top');

		const cardBody = document.createElement('div');

		cardBody.classList.add('card-body');

		const cardTitle = document.createElement('h5');

		cardTitle.classList.add('card-title');

		cardTitle.textContent = result.title;

		const saveText = document.createElement('p');

		saveText.classList.add('clickable');

		if (page === 'results') {
			saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
			saveText.textContent = 'Add to Favourites';
		} else {
			saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
			saveText.textContent = 'SubTract from Favourites';
		};

		const cardText = document.createElement('p');

		cardText.textContent = result.explanation;

		const footer = document.createElement('small');

		footer.classList.add('text-muted');

		const date = document.createElement('strong');

		date.textContent = result.date;

		const copyrightResult = result.copyright === undefined ? '' : result.copyright;

		const copyright = document.createElement('span');

		copyright.textContent = ` ${copyrightResult}`;

		footer.append(date, copyright);
		cardBody.append(cardTitle, saveText, cardText, footer);
		link.appendChild(image);
		card.append(link, cardBody);
		imagesContainer.appendChild(card);
	});
};

function upDateDOM(page) {
	if (localStorage.getItem('astronomyExplorerFavourites')) {
		favourites = JSON.parse(localStorage.getItem('astronomyExplorerFavourites'));
	};

	imagesContainer.textContent = null;

	createDOMNodes(page);
	showConTent(page);
};

async function getImages() {
	loader.classList.remove('hidden');

	try {
		const response = await fetch(APIURL);

		results = await response.json();

		upDateDOM('results');
	} catch (error) {
		console.log(error);
	};
};

function saveFavourite(itemURL) {
	results.forEach(result => {
		if (result.url.includes(itemURL)) {
			if (!favourites[itemURL]) {
				saveConfirmed.textContent = 'FAVOURITED';
				favourites[itemURL] = result;
			} else {
				saveConfirmed.textContent = 'ALREADY FAVOURITED';
			};

			saveConfirmed.hidden = false;

			setTimeout(() => {saveConfirmed.hidden = true}, 2000);
		};

		localStorage.setItem('astronomyExplorerFavourites', JSON.stringify(favourites));
	});
};

function reMoveFavourite(itemURL) {
	if (favourites[itemURL]) {
		delete favourites[itemURL];

		saveConfirmed.textContent = 'UNFAVOURITED';
		saveConfirmed.hidden = false;

		setTimeout(() => {saveConfirmed.hidden = true}, 2000);
		localStorage.setItem('astronomyExplorerFavourites', JSON.stringify(favourites));
		upDateDOM('favourites');
	};
};

getImages();