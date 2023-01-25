async function fetchOldQuery(query, variables) {
  queryName = query.substring(6);
  let regex = new RegExp(/\w*/g);
  queryName = regex.exec(queryName)[0];
  let func = window[queryName];
  variables = variables != "" ? variables : null;
  if (typeof func == "function") {
    let result = await func(variables);
    return result;
  }
}

async function GetAllGeneration() {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Access-Control-Allow-Origin", "*");
  config = {
    method: "GET",
    mode: "cors",
    headers: headers,
    cache: "default",
  };
  let query = "https://pokeapi.co/api/v2/generation";
  let results = await fetch(query, config);
  results = await results.json();
  results = results.results;
  let result = { data: { gens: [] } };
  results.forEach((element, key) => {
    result.data.gens.push({
      name: element.name,
      id: key + 1,
    });
  });
  return result;
}

async function GetPokemonFromGeneration(id) {
  let result = { data: { genSpecies: [] } };
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Access-Control-Allow-Origin", "*");
  config = {
    method: "GET",
    mode: "cors",
    headers: headers,
    cache: "default",
    async: false,
  };
  let query = "https://pokeapi.co/api/v2/generation/" + id.id;
  let results = await fetch(query, config);
  results = await results.json();
  results = results.pokemon_species;
  let data = [];
  let promises = [];
  for (const [key, element] of results.entries()) {
    let pkId = key + 1;
    let query = "https://pokeapi.co/api/v2/pokemon/" + pkId;

    let sprites = fetch(query, config)
      .then((res) => res.json())
      .then((sprites) => {
        data[key] = {
          "name": element.name,
          "id": pkId,
          "pokemon_v2_pokemons": [
            {
              "pokemon_v2_pokemonsprites": [
                {
                  "sprites": JSON.stringify(sprites.sprites),
                },
              ],
            },
          ],
        };
      })
      .catch(() => {
        data[key] = {
          "name": element.name,
          "id": pkId,
          "pokemon_v2_pokemons": [
            {
              "pokemon_v2_pokemonsprites": [
                {
                  "sprites": null,
                },
              ],
            },
          ],
        };
      });
    delay(50);
    promises.push(sprites);
  }
  let tmp = await Promise.allSettled(promises);
  result.data.genSpecies.push(...data);
  return result;
}
