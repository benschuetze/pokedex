/*helper function*/

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

/* async functions*/
let allPokemon;
let pokemon;

let arrOfAllPokemon = [];
let arrOfFavoritePokemon = [];

async function load() {
    loadAllPokemon();
}

async function loadAllPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=100';
    let response = await fetch(url);
    allPokemon = await response.json();
    renderAllPokemonHTML(allPokemon);
    pushToArray(allPokemon);

}

async function pushToArray(allPokemon) {
    for (i = 0; i < 100; i++) {
        let singlePokemonUrl = allPokemon['results'][i]['url'];
        let response = await fetch(singlePokemonUrl);
        pokemon = await response.json();
        pokemon.favorite = false;
        arrOfAllPokemon.push(pokemon);
    }
}

let arrIndex = 0;
let length = 20;

async function renderAllPokemonHTML(allPokemon) {
    for (i = arrIndex; i < length; i++) {
        let singlePokemonUrl = allPokemon['results'][i]['url'];
        let response = await fetch(singlePokemonUrl);
        pokemon = await response.json();
        let all = document.getElementById('all-pokemon');
        all.innerHTML = '';
        for (i = 0; i < arrOfAllPokemon.length; i++) {
            let title = capitalize(arrOfAllPokemon[i]['name']);
            let type = capitalize(arrOfAllPokemon[i]['types'][0]['type']['name']);
            let image = arrOfAllPokemon[i]['sprites']['other']['dream_world']['front_default'];
            let ability = capitalize(arrOfAllPokemon[i]['abilities'][0]['ability']['name']);
            all.innerHTML += pokemonHTML(i, title, type, image, ability);
            backgroundColor(i, type);
            document.getElementById(`heart-${i}`).classList.add('d-none');
            document.getElementById(`heart-minus-${i}`).classList.add('d-none');
        }
    }
}

/*functions*/

window.onscroll = function () {

    let scrollY = window.scrollY;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        arrIndex += + 20;
        length += 19;
        renderAllPokemonHTML(allPokemon);
        scrollY = window.scrollY - window.innerHeight;
    }
};

function showPokemon(i) {
    if (arrOfAllPokemon[i]['favorite'] == true) {
        document.getElementById(`heart-minus-${i}`).classList.remove('d-none');
        document.getElementById(`heart-${i}`).classList.add('d-none');
    }
    zoomMode(i);
    configureZoomCard(i);
    animateStats(i);
}

function backToAll(i) {
    exitZoomMode(i);
    removeZoomCard(i);
    resetStats(i);
}

function zoomMode(i) {
    document.getElementById('body').classList.add('stop-scrolling');
    document.getElementById(`pokemon-type-${i}`).classList.add('d-none');
    document.getElementById(`ability-${i}`).classList.add('d-none');
    checkFavStatusAndChangeHeart(i);
}

function checkFavStatusAndChangeHeart(i) {
    if(arrOfAllPokemon[i]['favorite'] == false) {
        document.getElementById(`heart-${i}`).classList.remove('d-none');
        } else {
            document.getElementById(`heart-minus-${i}`).classList.remove('d-none');
        }
}

function configureZoomCard(i) {
    let current = document.getElementById(i);
    let bg = document.getElementById(`bg-${i}`);
    let img = document.getElementById(`img-${i}`);
    let statsContainer = document.getElementById(`stats-container-${i}`)
    current.classList.add('zoom-in');
    bg.classList.remove('d-none');
    img.classList.add('zoom-in-image');
    statsContainer.classList.remove('opacity-0');
    statsContainer.style.width = "70%";
    statsContainer.classList.add('flex-around');
}

function animateStats(i) {
    setTimeout(function changeStats() {
        let hp = arrOfAllPokemon[i]['stats'][0]['base_stat'];
        let attack = arrOfAllPokemon[i]['stats'][1]['base_stat'];
        let defense = arrOfAllPokemon[i]['stats'][2]['base_stat'];
        let speed = arrOfAllPokemon[i]['stats'][5]['base_stat'];
        document.getElementById(`hp-bar-${i}`).style.height = `${hp}%`;
        document.getElementById(`attack-bar-${i}`).style.height = `${attack}%`;
        document.getElementById(`defense-bar-${i}`).style.height = `${defense}%`;
        document.getElementById(`speed-bar-${i}`).style.height = `${speed}%`;
    }, 150)
}

function exitZoomMode(i) {
    document.getElementById('body').classList.remove('stop-scrolling');
    document.getElementById(`pokemon-type-${i}`).classList.remove('d-none');
    document.getElementById(`ability-${i}`).classList.remove('d-none');
    document.getElementById(`heart-${i}`).classList.add('d-none');
    document.getElementById(`heart-minus-${i}`).classList.add('d-none');
}

function removeZoomCard(i) {
    let current = document.getElementById(i);
    let bg = document.getElementById(`bg-${i}`);
    let img = document.getElementById(`img-${i}`);
    let statsContainer = document.getElementById(`stats-container-${i}`);
    current.classList.remove('zoom-in');
    bg.classList.add('d-none');
    img.classList.remove('zoom-in-image');
    statsContainer.classList.add('opacity-0');
    statsContainer.style.width = "60px";
    statsContainer.classList.remove('flex-around');
}

function resetStats(i) {
    document.getElementById(`hp-bar-${i}`).style.height = `20%`;
    document.getElementById(`attack-bar-${i}`).style.height = `20%`;
    document.getElementById(`defense-bar-${i}`).style.height = `20%`;
    document.getElementById(`speed-bar-${i}`).style.height = `20%`;
}

function addToFavorites(i) {
    let alert = document.getElementById('alert');
    alert.classList.remove('opacity-0');
    document.getElementById(`heart-${i}`).style.display = 'none';
    document.getElementById(`heart-minus-${i}`).classList.remove('d-none');
    let title = capitalize(arrOfAllPokemon[i]['name']);
    alert.innerHTML = '';
    setTimeout(hideAlert, 4000);
    setFavStatusAndShowAlert(i, title, alert);

}

function setFavStatusAndShowAlert(i, title, alert) {
    if (arrOfAllPokemon[i]['favorite'] == false) {
        arrOfAllPokemon[i]['favorite'] = true;
        alert.innerHTML = `${title} was added to your favorites!`;
    } else {
        alert.innerHTML = `${title} is already in your favorites!`;
    }
}

function removeFromFavorites(i) {
    let alert = document.getElementById('alert');
    let title = capitalize(arrOfAllPokemon[i]['name']);
    document.getElementById(`heart-${i}`).style.display = 'block';
    document.getElementById(`heart-minus-${i}`).classList.add('d-none');
    alert.classList.remove('opacity-0');
    alert.innerHTML = '';
    alert.innerHTML = `${title} removed from your favorites!`;
    setTimeout(hideAlert, 4000);
    arrOfAllPokemon[i]['favorite'] = false;

}

function hideAlert() {
    console.log('timeout');
    document.getElementById('alert').classList.add('opacity-0');
}

function showFavorites() {
    document.getElementById('top-button').classList.add('opacity-0');
    document.getElementById('top-button').classList.add('z-index-negative');
    document.getElementById('top-input').classList.add('opacity-0');
    document.getElementById('top-input').classList.add('z-index-negative');
    document.getElementById('top-heart').classList.add('d-none');
    document.getElementById('top-heart-full').classList.remove('d-none');

    renderFavorites();


}

function renderFavorites() {
    
    let all = document.getElementById('all-pokemon');
    all.innerHTML = '';
    for (i = 0; i < arrOfAllPokemon.length; i++) {
        if (arrOfAllPokemon[i]['favorite'] == true) {
            let title = capitalize(arrOfAllPokemon[i]['name']);
            let type = capitalize(arrOfAllPokemon[i]['types'][0]['type']['name']);
            let image = arrOfAllPokemon[i]['sprites']['other']['dream_world']['front_default'];
            let ability = capitalize(arrOfAllPokemon[i]['abilities'][0]['ability']['name']);
            all.innerHTML += pokemonHTML(i, title, type, image, ability);
            backgroundColor(i, type);
            document.getElementById(`heart-${i}`).classList.add('d-none');
            document.getElementById(`heart-minus-${i}`).classList.add('d-none');
        }
    }

    showInfo(all);
}

function showInfo(all) {
    if(!all.innerHTML) {
        all.innerHTML = '<p class="favorite-info">You have not yet added your favorite pokemon here. Click on the heart on the top right of the pokemon card to add the pokemon to this list!</p>'
    }
}


function showAllPokemon() {
    document.getElementById('top-button').classList.remove('opacity-0');
    document.getElementById('top-button').classList.remove('z-index-negative');
    document.getElementById('top-input').classList.remove('opacity-0');
    document.getElementById('top-input').classList.remove('z-index-negative');
    document.getElementById('top-heart').classList.remove('d-none');
    document.getElementById('top-heart-full').classList.add('d-none');

    renderArray(arrOfAllPokemon);
}


function renderArray(array) {

    let all = document.getElementById('all-pokemon');
    all.innerHTML = '';
    for (i = 0; i < array.length; i++) {
        let title = capitalize(array[i]['name']);
        let type = capitalize(array[i]['types'][0]['type']['name']);
        let image = array[i]['sprites']['other']['dream_world']['front_default'];
        let ability = capitalize(array[i]['abilities'][0]['ability']['name']);
        all.innerHTML += pokemonHTML(i, title, type, image, ability);
        backgroundColor(i, type);
        document.getElementById(`heart-${i}`).classList.add('d-none');
        document.getElementById(`heart-minus-${i}`).classList.add('d-none');
    }



}

/*search function*/

function filterPokemon() {
    let search = document.getElementById('top-input').value;
    let pokemonContainer = document.getElementById('all-pokemon');
    search = search.toLowerCase();
    pokemonContainer.innerHTML = '';
    console.log(search);
    for (let i = 0; i < arrOfAllPokemon.length; i++) {
        let title = arrOfAllPokemon[i]['name'];
        let poketitle = capitalize(arrOfAllPokemon[i]['name']);
        let type = capitalize(arrOfAllPokemon[i]['types'][0]['type']['name']);
        let image = arrOfAllPokemon[i]['sprites']['other']['dream_world']['front_default'];
        let ability = capitalize(arrOfAllPokemon[i]['abilities'][0]['ability']['name']);
        if (title.toLowerCase().includes(search)) {
            pokemonContainer.innerHTML += pokemonHTML(i, poketitle, type, image, ability);
            backgroundColor(i, type);
            document.getElementById(`heart-${i}`).classList.add('d-none');
            document.getElementById(`heart-minus-${i}`).classList.add('d-none');
        }

    }
}

/*html*/

function pokemonHTML(i, title, type, image, ability) {
    let currentPokemon = document.getElementById(i);
    if (!currentPokemon) {
        return /*html*/ `
    <div loading="lazy" class="bg-zoom d-none" id="bg-${i}" onclick="backToAll(${i})">
    </div>
        <div loading="lazy" id="${i}" class="card-small" onclick="showPokemon(${i})">
            <span id="back-${i}" class="d-none">Back To All</span>
            <span class="pokemon-name">${title}</span>
            <img title="add to favorites" onclick="addToFavorites(${i})" id="heart-${i}" class="icon plus-heart" src="heart-plus.svg" alt="">
            <img src="heart-minus.svg" onclick="removeFromFavorites(${i})" class="icon plus-heart" id="heart-minus-${i}" alt="">
            <div class="img-container">
                <img src="${image}" class="pokemon-image" id="img-${i}">
            </div>
            <div class="type-ability">
                <p class="type" id="pokemon-type-${i}">${type}</p>
                <div class="bottom flex-center width-100">
                <div class="stats-container opacity-0" id="stats-container-${i}">
                    <div class="wrapper">
			            <div class="stats-bar">
				        <span class="stats-bar-fill" id="hp-bar-${i}"><p class="span-in-bar">HP</p></span>
			        </div>                        
		            </div>
                    <div class="wrapper">
			            <div class="stats-bar">
				        <span class="stats-bar-fill" id="attack-bar-${i}"><p class="span-in-bar">Attack</p></span>
			            </div>                        
		            </div>
                    <div class="wrapper">
			            <div class="stats-bar">
				        <span class="stats-bar-fill" id="defense-bar-${i}"><p class="span-in-bar">Defense</p></span>
			            </div>                        
		            </div>
                    <div class="wrapper">
			            <div class="stats-bar">
				        <span class="stats-bar-fill" id="speed-bar-${i}"><p class="span-in-bar">Speed</p></span>
			            </div>                        
		            </div>
                    
                </div>
    </div>
                <p class="ability" id="ability-${i}">${ability}</p>
            </div>

        </div>`;
    }
}

/*background-colors*/

function backgroundColor(i, type) {
    let currentPokemon = document.getElementById(i);
    if (type == 'Grass') {
        currentPokemon.classList.add('bg-grass');
    }

    if (type == 'Fire') {
        currentPokemon.classList.add('bg-fire');
    }

    if (type == 'Water') {
        currentPokemon.classList.add('bg-water');
    }

    if (type == 'Bug') {
        currentPokemon.classList.add('bg-bug');
    }

    if (type == 'Normal') {
        currentPokemon.classList.add('bg-normal');
    }

    if (type == 'Poison') {
        currentPokemon.classList.add('bg-poison');
    }

    if (type == 'Electric') {
        currentPokemon.classList.add('bg-electric');
    }

    if (type == 'Ground') {
        currentPokemon.classList.add('bg-ground');
    }

    if (type == 'Fairy') {
        currentPokemon.classList.add('bg-fairy');
    }

    if (type == 'Fighting') {
        currentPokemon.classList.add('bg-fighting');
    }

    if (type == 'Psychic') {
        currentPokemon.classList.add('bg-psychic');
    }

    if (type == 'Rock') {
        currentPokemon.classList.add('bg-rock');
    }

    if (type == 'Ghost') {
        currentPokemon.classList.add('bg-ghost');
    }
}

