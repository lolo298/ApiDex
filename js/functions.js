let headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");
headers.append("Access-Control-Allow-Origin", "http://apidex.localhost");

let config = {
  method: "GET",
  mode: "cors",
  headers: headers,
  cache: "default",
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
async function setup() {
  setSideBar();
  setPkmnList("https://pokeapi.co/api/v2/generation/1/");
  setTheme();
}

async function setSideBar() {
  const gen = await fetch("https://pokeapi.co/api/v2/generation/", config)
    .then(function (res) {
      return res.json();
    })
    .catch(function (err) {
      console.log(err);
    });
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

async function setPkmnList(url, id) {
  let pkmnList = await fetch(url, config)
    .then(function (res) {
      return res.json();
    })
    .catch(function (err) {
      console.log(err);
    });
  let pkmnListContainer = document.querySelector(".pkmn-container");
  let template = document.getElementsByTagName("template")[0];

  pkmnListContainer.innerHTML = "";
  pkmnList.pokemon_species.forEach(function (element) {
    let id = getIdFromUrl(element.url);
    element.url = id;
    element.url = parseInt(element.url);
  });
  pkmnList.pokemon_species.sort(function (a, b) {
    return a.url - b.url;
  });
  pkmnList.pokemon_species.forEach(function (element) {
    let clone = template.content.cloneNode(true);
    let sprite = clone.querySelector(".sprite");
    let name = clone.querySelector(".name");
    name.innerHTML = element.name;
    name.alt = element.name;
    let id = element.url;
    url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const pkmn = fetch(url, config)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.sprites.front_default != null) {
          sprite.src = data.sprites.front_default;
        } else {
          sprite.src =
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    pkmnListContainer.appendChild(clone);
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
