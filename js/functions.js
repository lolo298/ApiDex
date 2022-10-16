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

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function setSideBar() {
  query = `query GetAllGeneration {
    gens: pokemon_v2_generation{
      name
      id
    }
  }`;
  let gen = (await fetchQuery(query)).gens;
  let sidebar = document.querySelector(".sidebar").querySelector("nav");
  for (let i = 0; i < gen.length; i++) {
    let element = gen[i];
    let a = document.createElement("a");
    a.href = `#${element.name}`;
    a.innerHTML = romanize(i + 1);
    a.addEventListener("click", function (e) {
      e.preventDefault();
      setPkmnList(i + 1);
    });
    sidebar.appendChild(a);
  }
}

async function setPkmnList(id) {
  spinner();
  let pkmnListContainer = document.querySelector(".pkmn-container");
  let template = document.getElementsByTagName("template")[0];

  pkmnListContainer.innerHTML = "";
  const species = (await getGenPkmn(id)).genSpecies;

  let totalImage = species.length;
  let loaded = 0;
  for (let i = 0; i < species.length; i++) {
    let element = species[i];
    let clone = template.content.cloneNode(true);
    let sprite = clone.querySelector(".sprite");
    let name = clone.querySelector(".name");

    let id = i + 1;
    clone.querySelector(".sprite-container").id = id;

    name.innerHTML = element.name;
    name.alt = element.name;
    let sprites = JSON.parse(
      element.pokemon_v2_pokemons[0].pokemon_v2_pokemonsprites[0].sprites
    );
    if (sprites.front_default != null) {
      sprite.src = sprites.front_default;
    } else {
      sprite.src =
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
    }

    sprite.addEventListener("load", function () {
      loaded = loaded + 1;
      if (loaded == totalImage) {
        console.log("loaded");
        spinner();
      }
    });
    pkmnListContainer.appendChild(clone);
  }

  setRedirect();
}

function romanize(num) {
  if (isNaN(num)) return NaN;
  var digits = String(+num).split(""),
    key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ],
    roman = "",
    i = 3;
  while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

async function getGenPkmn(gen) {
  query = `query GetPokemonFromGeneration($id: Int!) {
    genSpecies: pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {id: {_eq: $id}}}, order_by: {id: asc}) {
      name
      id
      pokemon_v2_pokemons {
        pokemon_v2_pokemonsprites {
          sprites
        }
      }
    }
  }
  `;
  let variables = `{"id": ${gen}}`;
  return fetchQuery(query, variables);
}

function setRedirect() {
  let card = document.querySelectorAll(".sprite-container");
  card.forEach(function (element) {
    element.addEventListener("click", function () {
      window.location.href =
        window.location.href + "pokemons/?id=" + element.id;
    });
  });
}
