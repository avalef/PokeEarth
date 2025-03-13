async function fetchPokemon() {
    const name = document.getElementById("pokemonName").value.toLowerCase();
    if (!name) {
        document.getElementById("result").innerHTML = `<p style="color: red;">Please enter a Pokémon name!</p>`;
        return;
    }
    fetchPokemonData(name);
}

async function fetchPokemonBySpecies() {
    const speciesName = document.getElementById("speciesName").value.toLowerCase();
    if (!speciesName) {
        document.getElementById("result").innerHTML = `<p style="color: red;">Please enter a species name!</p>`;
        return;
    }

    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${speciesName}`;

    try {
        const speciesResponse = await fetch(speciesUrl);
        if (!speciesResponse.ok) {
            throw new Error("Species not found!");
        }

        const speciesData = await speciesResponse.json();
        
        // Get the first Pokémon in the species (default form)
        const firstPokemon = speciesData.varieties[0]?.pokemon.name;
        if (!firstPokemon) {
            throw new Error("No Pokémon found for this species.");
        }

        fetchPokemonData(firstPokemon);

    } catch (error) {
        document.getElementById("result").innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

async function fetchPokemonData(pokemonName) {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;
    const encountersUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters`;

    try {
        const [pokemonResponse, speciesResponse, encountersResponse] = await Promise.all([
            fetch(pokemonUrl),
            fetch(speciesUrl),
            fetch(encountersUrl)
        ]);

        if (!pokemonResponse.ok || !speciesResponse.ok) {
            throw new Error("Pokémon not found!");
        }

        const pokemonData = await pokemonResponse.json();
        const speciesData = await speciesResponse.json();
        const encountersData = await encountersResponse.json();

        // Get the first English description
        const description = speciesData.flavor_text_entries.find(entry => entry.language.name === "en")?.flavor_text || "No description available.";

        // Get Pokémon genus (species name)
        const genus = speciesData.genera.find(genus => genus.language.name === "en")?.genus || "Unknown";

        // Get Pokémon types
        const types = pokemonData.types.map(t => t.type.name).join(", ");

        // Get encounter locations (regions)
        let regions = encountersData.map(encounter => encounter.location_area.name.replace(/-/g, ' '));
        regions = regions.length > 0 ? regions.join(", ") : "Unknown location";

        // Get Evolution Chain
        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionResponse = await fetch(evolutionChainUrl);
        const evolutionData = await evolutionResponse.json();
        let evolutionText = getEvolutionChain(evolutionData.chain);

        document.getElementById("result").innerHTML = `
            <h2>${pokemonData.name.toUpperCase()}</h2>
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
            <p><strong>Type:</strong> ${types}</p>
            <p><strong>Height:</strong> ${pokemonData.height}</p>
            <p><strong>Weight:</strong> ${pokemonData.weight}</p>
            <p><strong>Species:</strong> ${genus}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Regions Found:</strong> ${regions}</p>
            <p><strong>Evolution Chain:</strong> ${evolutionText}</p>
        `;
    } catch (error) {
        document.getElementById("result").innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function getEvolutionChain(chain) {
    let evolutionNames = [];
    while (chain) {
        evolutionNames.push(chain.species.name);
        chain = chain.evolves_to[0]; // Get the next evolution stage
    }
    return evolutionNames.join(" → ");
}
