async function fetchPokemon() {
    const name = document.getElementById("pokemonName").value.toLowerCase();
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${name}`;
    const encountersUrl = `https://pokeapi.co/api/v2/pokemon/${name}/encounters`;

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

        // Get Pokémon types
        const types = pokemonData.types.map(t => t.type.name).join(", ");

        // Get encounter locations 
