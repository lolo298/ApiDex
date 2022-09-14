let headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");
headers.append("Access-Control-Allow-Origin", "*");

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const config = {
  method: "GET",
  mode: "cors",
  headers: headers,
  cache: "reload",
};

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
  if (sessionStorage.getItem("theme") == "dark") {
    toggle.checked = true;
    root.classList.add("dark-mode");
    root.classList.remove("light-mode");
    icon.src = "./assets/img/moon.png";
  } else {
    toggle.checked = false;
    root.classList.remove("dark-mode");
    root.classList.add("light-mode");
    icon.src = "./assets/img/sun.png";
  }
}

async function setSideBar() {
  const gen = await fetch("https://pokeapi.co/api/v2/generation/", config)
    .then(function (res) {
      return res.json();
    })
    .catch(function (err) {
      console.log(err);
    });
  await delay(10);
  let sidebar = document.querySelector(".sidebar").querySelector("nav");
  for (let i = 0; i < gen.count; i++) {
    let element = gen.results[i];
    let a = document.createElement("a");
    a.href = `#${element.name}`;
    a.innerHTML = romanize(i + 1);
    a.addEventListener("click", function (e) {
      e.preventDefault();
      setPkmnList(element.url, i + 1);
    });
    sidebar.appendChild(a);
  }
}

function setPkmnList(url, id) {
  console.log("list");
  let pkmnListContainer = document.querySelector(".pkmn-container");
  let template = document.getElementsByTagName("template")[0];

  pkmnListContainer.innerHTML = "";
  console.log("Fetching data...");
  fetch(url, config)
    .then(function (res) {
      return res.json();
    })
    .then(async function (data) {
      let array = new Array();
      for (let i = 0; i < data.pokemon_species.length; i++) {
        let element = data.pokemon_species[i];
        let id = getIdFromUrl(element.url);
        array[id] = element.url.replace("pokemon-species", "pokemon");
        element.url = id;
        element.url = parseInt(element.url);

        console.log("Fetched");
      }
      /*
      data.pokemon_species.sort(function (a, b) {
        return a.url - b.url;
      });
      */
      for (let i = 1; i < array.length; i++) {
        let element = array[i];
        let clone = template.content.cloneNode(true);
        let sprite = clone.querySelector(".sprite");
        let name = clone.querySelector(".name");

        let id = i;
        clone.querySelector(".sprite-container").id = id;
        url = element;

        await fetch(url, config)
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            name.innerHTML = data.species.name;
            name.alt = data.species.name;
            url = data.species.url;
            console.log(data);

            if (data.sprites.front_default != null) {
              sprite.src = data.sprites.front_default;
            } else {
              sprite.src =
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
            }

            pkmnListContainer.appendChild(clone);
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

function getIdFromUrl(url) {
  let tmp = url.replace("https://pokeapi.co/api/v2/", "");
  let id = tmp.match(/(\d+)/)[0];
  return id;
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

async function getPokedex(gen) {
  await fetch(`https://pokeapi.co/api/v2/pokedex/${gen}`, config)
    .then(function (res) {
      return res.json();
    })
    .catch(function (err) {
      console.log(err);
    });
}

async function getAllPkmn() {
  await fetch("https://pokeapi.co/api/v2/pokemon/", config)
    .then(function (res) {
      return res.json();
    })
    .catch(function (err) {
      console.log(err);
    });
}

async function getGenPkmn(gen) {
  await fetch(`https://pokeapi.co/api/v2/generation/${gen}/`, config)
    .then(function (res) {
      return res.json();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}

function setRedirect() {
  let card = document.querySelectorAll(".sprite-container");
  card.forEach(function (element) {
    if (window.location.href == "http://apidex/") {
      element.addEventListener("click", function () {
        window.location.href = "http://apidex/pokemon.html?id=" + element.id;
      });
    }
  });
}
