const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("poke");

const fetchPokemon = () => {
	const promises = [];
	for (let i = 1; i <= 1008; i++) {
		const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
		promises.push(fetch(url).then((res) => res.json()));
	}

	Promise.all(promises).then((results) => {
		const pokemon = results.map((data) => ({
			name: data.name,
			id: data.id,
			image: data.sprites["front_default"],
			type: data.types.map((type) => type.type.name).join(", "),
		}));
		displayPokemon(pokemon);
		searchInput.addEventListener(
			"keyup",
			debounce((event) => searchPokemon(pokemon, event), 500)
		);
	});
};

const displayPokemon = (pokemon) => {
	console.log(pokemon);
	const pokemonHTMLString = pokemon
		.map(
			(pokeman) =>
				`
    <li class="card">
        <img class="card-image" src="${pokeman.image}"/>
        <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
        <p class="card-subtitle">Type: ${pokeman.type}</p>
    </li>
    `
		)
		.join("");
	pokedex.innerHTML = pokemonHTMLString;
};

const searchPokemon = (pokemon, event) => {
	const searchString = event.target.value.toLowerCase();
	const filteredPokemon = pokemon.filter((pokeman) => {
		return pokeman.name.toLowerCase().includes(searchString);
	});
	displayPokemon(filteredPokemon);
};

fetchPokemon();

function debounce(func, wait) {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			timeout = null;
			func.apply(context, args);
		}, wait);
	};
}
