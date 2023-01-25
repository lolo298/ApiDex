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

let spin = ".pkmn-container";

window.onload = async () => {
  spinner(spin);

  // Make all the necessary requests
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
      chain: pokemon_v2_evolutionchain {
        specie: pokemon_v2_pokemonspecies {
          name
          id
        }
      }
    }
    Type: pokemon_v2_pokemontype(where: {pokemon_id: {_eq: $id}}) {
      pokemon_v2_type {
        name
      }
    }
  }`;
  let variables = `{"id": ${id}}`;
  const data = await fetchQuery(query, variables);
  let chain = data.Pokemon[0].chain.specie;
  let queryData = (queryParam = variablesParam = "");
  variables = `{`;
  chain.forEach((element) => {
    queryData += `
      ${element.name}: pokemon_v2_pokemonsprites(where: {pokemon_id: {_eq: $id${element.id}}}) {
        sprites
      }
    `;
    variablesParam += `,"id${element.id}": ${element.id} `;
    queryParam += `$id${element.id}: Int! `;
  });
  query = `query GetPokemonsSprites(` + queryParam + `) {` + queryData + `}`;
  variablesParam = variablesParam.slice(1);
  variables = `{` + variablesParam + `}`;
  const sprites = await fetchQuery(query, variables);
  let pokemon = data.Pokemon[0];
  const currentSprites = JSON.parse(sprites[pokemon.name][0].sprites);
  let types = data.Type;

  // get the html elements
  let img = document.querySelector("#sprite");
  let name = document.querySelector("#name");
  let docChain = document.querySelector("#chain");

  //set initial data
  name.innerHTML = pokemon.name;
  img.src = currentSprites.other["official-artwork"].front_default;
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

  //set the evolution chain
  console.log(chain);
  let template = document.getElementsByTagName("template")[0];
  chain.forEach((element) => {
    let clone = template.content.cloneNode(true);
    clone.querySelector(".name").innerHTML = element.name;
    clone.querySelector(".sprite").src = JSON.parse(
      sprites[element.name][0].sprites
    ).other["official-artwork"].front_default;
    clone.querySelector(".sprite").alt = element.name;

    docChain.appendChild(clone);
  });
  spinner(spin);
};
