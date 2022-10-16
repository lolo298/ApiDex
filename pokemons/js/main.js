let headers = new Headers();
headers.append("Content-Type", "application/json");
//headers.append("X-Method-Used", "graphiql");
//headers.append("Accept", "application/json");
headers.append("Access-Control-Allow-Origin", "*");
let query = "";
let config = {
  method: "POST",
  mode: "cors",
  headers: headers,
  cache: "default",
};

window.onload = async () => {
  spinner();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  query = `query GetPokemonById($id: Int!) {
    Pokemon: pokemon_v2_pokemonspecies(where: {id: {_eq: $id}}) {
      name
      base_happiness
      capture_rate
      evolution_chain_id
      evolves_from_species_id
      forms_switchable
      gender_rate
      generation_id
      growth_rate_id
      has_gender_differences
      hatch_counter
      is_baby
      is_legendary
      is_mythical
      pokemon_v2_evolutionchain {
        pokemon_v2_pokemonspecies {
          name
        }
      }
    }
    Type: pokemon_v2_pokemontype(where: {pokemon_id: {_eq: $id}}) {
      pokemon_v2_type {
        name
      }
    }
    Sprite: pokemon_v2_pokemonsprites(where: {pokemon_id: {_eq: $id}}) {
      sprites
    }
  }`;
  let variables = `{"id": ${id}}`;
  const data = await fetchQuery(query, variables);
  let sprites = JSON.parse(data.Sprite[0].sprites);
  let pokemon = data.Pokemon[0];
  let types = data.Type;
  let img = document.querySelector("#sprite");
  let name = document.querySelector("#name");
  name.innerHTML = pokemon.name;
  img.src = sprites.other["official-artwork"].front_default;
  img.alt = pokemon.name;
  let divTypes = document.querySelector("#types");
  types.forEach(async (type) => {
    let span = document.createElement("span");
    span.classList.add("type");
    let name = document.createElement("p");
    name.innerHTML = type.pokemon_v2_type.name;
    span.classList.add(type.pokemon_v2_type.name);
    let image = document.createElement("img");
    image.src = `../assets/icons/types/${type.pokemon_v2_type.name}.svg`;
    image.alt = type.pokemon_v2_type.name;
    image.id = "typeIcon";
    span.appendChild(image);
    span.appendChild(name);
    divTypes.appendChild(span);
  });
  spinner();
};
