let config = {
  method: "GET",
  mode: "cors",
  headers: new Headers({ "content-type": "application/json" }),
  cache: "default",
};

function theme(toggle) {
  let icon = document.getElementById("theme-icon");
  let root = document.getElementById("root");
  if (toggle.checked) {
    icon.src = "./assets/img/moon.png";
    root.classList.add("dark-mode");
    root.classList.remove("light-mode");
    console.log("dark mode");
  } else {
    icon.src = "./assets/img/sun.png";
    root.classList.remove("dark-mode");
    root.classList.add("light-mode");
    console.log("light mode");
  }
}
async function setup() {
  setSideBar();
  setPkmnList("https://pokeapi.co/api/v2/generation/1/");
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
    let clone = template.content.cloneNode(true);
    let sprite = clone.querySelector(".sprite");
    let name = clone.querySelector(".name");
    name.innerHTML = element.name;
    name.alt = element.name;
    //console.log(element);
    url = clearUrl(element.url);
    let id = url.match(/(\d+)/)[0];
    url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const pkmn = fetch(url, config)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        sprite.src = data.sprites.front_default;
      })
      .catch(function (err) {
        console.log(err);
      });

    pkmnListContainer.appendChild(clone);
  });
}

function clearUrl(url) {
  return url.replace("https://pokeapi.co/api/v2/", "");
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
