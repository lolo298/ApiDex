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

function setConfig(query) {
  config = {
    method: "POST",
    mode: "cors",
    headers: headers,
    cache: "default",
    body: JSON.stringify({ query: query }),
  };
}

function theme(toggle) {
  let icon = document.getElementById("theme-icon");
  let root = document.getElementById("root");
  if (toggle.checked) {
    icon.src = "./assets/img/moon.png";
    root.classList.add("dark-mode");
    root.classList.remove("light-mode");
    sessionStorage.setItem("theme", "dark");
  } else {
    icon.src = "./assets/img/sun.png";
    root.classList.remove("dark-mode");
    root.classList.add("light-mode");
    sessionStorage.setItem("theme", "light");
  }
}
function setTheme() {
  let icon = document.getElementById("theme-icon");
  let root = document.getElementById("root");
  let toggle = document.getElementById("themeSwitch");
  if (sessionStorage.getItem("theme") == "light") {
    toggle.checked = false;
    root.classList.add("light-mode");
    root.classList.remove("dark-mode");
    icon.src = "./assets/img/sun.png";
  } else {
    toggle.checked = true;
    root.classList.remove("light-mode");
    root.classList.add("dark-mode");
    icon.src = "./assets/img/moon.png";
  }
}

async function setSideBar() {
  query = `query GetAllGeneration {
    gen: pokemon_v2_generation{
      name
      id
    }
  }`;
  setConfig(query);
  let gen = await fetch("https://beta.pokeapi.co/graphql/v1beta", config)
    .then(function (res) {
      return res.json();
    })
    .catch(function (err) {
      console.log(err);
    });
  gen = gen.data.gen;

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
  spinner(true);
  let pkmnListContainer = document.querySelector(".pkmn-container");
  let template = document.getElementsByTagName("template")[0];

  pkmnListContainer.innerHTML = "";
  const species = await getGenPkmn(id);
  /*
      data.pokemon_species.sort(function (a, b) {
        return a.url - b.url;
      });
      */
  let array = species.data.gen_species;
  let totalImage = array.length;
  let loaded = 0;
  for (let i = 0; i < array.length; i++) {
    let element = array[i];
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
        spinner(false);
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
  query = `query GetPokemonFromGeneration {
    gen_species: pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {id: {_eq: "${gen}"}}}, order_by: {id: asc}) {
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
  setConfig(query);
  let tmp = await fetch("https://beta.pokeapi.co/graphql/v1beta", config)
    .then(function (res) {
      return res.json();
    })
    .catch(function (err) {
      console.log(err);
    });
  return tmp;
}

function setRedirect() {
  let card = document.querySelectorAll(".sprite-container");
  card.forEach(function (element) {
    if (
      window.location.href == "http://apidex/" ||
      window.location.href == "http://127.0.0.1:5500/" ||
      window.location.href == "https://lolo298.github.io/ApiDex/"
    ) {
      element.addEventListener("click", function () {
        window.location.href =
          window.location.href + "/pokemon.html?id=" + element.id;
      });
    }
  });
}

function spinner(state) {
  let spinner = document.querySelector(".spinner");
  let main = document.querySelector(".pkmn-container");
  if (state) {
    main.style.visibility = "hidden";
    spinner.style.display = "flex";
  } else {
    main.style.visibility = "";
    spinner.style.display = "none";
  }
}
