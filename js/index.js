if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

let totalImage = 0;
let loaded = 0;

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

spin = ".pkmn-container";
setSideBar();
setPkmnList(1);

async function setSideBar() {
  console.log("Gotcha!");
  query = "query GetAllGeneration {gens: pokemon_v2_generation{name id}}";
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
  spinner(spin);
  let pkmnListContainer = document.querySelector(".pkmn-container");
  let template = document.getElementsByTagName("template")[0];

  pkmnListContainer.innerHTML = "";
  const species = (await getGenPkmn(id)).genSpecies;
  let totalImage = species.length;
  for (let [i, element] of Object.entries(species)) {
    let clone = template.content.cloneNode(true);
    let sprite = clone.querySelector(".sprite");
    let name = clone.querySelector(".name");

    let id = element.id;
    clone.querySelector(".sprite-container").id = id;
    clone.querySelector(".sprite-container").style.order = id;
    name.innerHTML = element.name;
    name.alt = element.name;
    let sprites = element.pokemon_v2_pokemons[0].pokemon_v2_pokemonsprites[0].sprites;
    if (sprites.front_default != null) {
      sprite.src = sprites.front_default;
    } else {
      sprite.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
    }

    sprite.addEventListener("load", loadingImage);
    pkmnListContainer.appendChild(clone);
  }

  setRedirect();
}

function loadingImage(e) {
  loaded = loaded + 1;
  if (loaded >= totalImage - 10) {
    document.querySelectorAll(".sprite").forEach((element) => {
      element.removeEventListener("load", loadingImage);
    });
    spinner(spin);
  }
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
  query =
    "query GetPokemonFromGeneration($id: Int!) {genSpecies: pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {id: {_eq: $id}}}, order_by: {id: asc}) {name id pokemon_v2_pokemons {pokemon_v2_pokemonsprites {sprites}}}}";
  let variables = '{"id": ' + gen + "}";
  return await fetchQuery(query, variables);
}

function setRedirect() {
  oldurl = window.location.href;

  regex = /\/[a-z]+\.html/;
  newurl = oldurl.replace(regex, "");
  newurl =
    newurl.at(-1) == "/"
      ? newurl + "pokemon/?id="
      : newurl.at(-1) == "#"
      ? newurl.substring(0, newurl.length - 1) + "pokemon/?id="
      : newurl + "/pokemon/?id=";
  let card = document.querySelectorAll(".sprite-container");
  card.forEach(function (element) {
    element.addEventListener("click", function () {
      window.location.href = newurl + element.id;
    });
  });
}
