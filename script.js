async function fetchPokemon() {
    const name = document.getElementById("pokemonName").value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Pokémon not found!");
        }
        const data = await response.json();
        
        document.getElementById("result").innerHTML = `
            <h2>${data.name.toUpperCase()}</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <p>Type: ${data.types.map(t => t.type.name).join(", ")}</p>
            <p>Height: ${data.height}</p>
            <p>Weight: ${data.weight}</p>
        `;
    } catch (error) {
        document.getElementById("result").innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}
