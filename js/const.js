setTheme();
var spinnerState = false;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * toggle the spinner for loading time
 * @param {string} target - the CSS selector of the element to hide
 */
function spinner(target) {
  let spinner = document.querySelector(".spinner");
  let main = document.querySelector(target);
  let sep = document.querySelector(".sideSep");
  if (!spinnerState) {
    spinnerState = true;
    main.style.display = "none";
    sep === null ? null : (sep.style.display = "none");
    spinner.style.display = "flex";
  } else {
    spinnerState = false;
    main.style.display = "flex";
    sep === null ? null : (sep.style.display = "flex");
    spinner.style.display = "none";
  }
}
/**
 * Toggle the light and dark mode
 * @param {input[type=checkbox]} toggle - the checkbox to toggle
 */
function theme(toggle) {
  let icon = document.getElementById("theme-icon");
  let root = document.getElementById("root");
  if (toggle.checked) {
    icon.src = "/assets/img/moon.png";
    root.classList.add("dark-mode");
    root.classList.remove("light-mode");
    sessionStorage.setItem("theme", "dark");
  } else {
    icon.src = "/assets/img/sun.png";
    root.classList.remove("dark-mode");
    root.classList.add("light-mode");
    sessionStorage.setItem("theme", "light");
  }
}
/**
 * Toggle the light and dark mode during the page load with the session storage
 */
function setTheme() {
  let icon = document.getElementById("theme-icon");
  let root = document.getElementById("root");
  let toggle = document.getElementById("themeSwitch");
  if (sessionStorage.getItem("theme") == "light") {
    toggle.checked = false;
    root.classList.add("light-mode");
    root.classList.remove("dark-mode");
    icon.src = "/assets/img/sun.png";
  } else {
    toggle.checked = true;
    root.classList.remove("light-mode");
    root.classList.add("dark-mode");
    icon.src = "/assets/img/moon.png";
  }
}

/**
 * Set the config to use for a graphql query
 * @param {string} query - the graphql query with the format `query queryName{ ... }`
 * @param {object} variables - the variables to use in the query with format "{ varName: value }"
 */
async function fetchQuery(query, variables = "") {
  const controller = new AbortController();
  const signal = controller.signal;
  if (variables == "") {
    config = {
      method: "POST",
      mode: "cors",
      headers: headers,
      cache: "default",
      body: JSON.stringify({ query }),
      signal: signal,
    };
  } else {
    variables = JSON.parse(variables);
    config = {
      method: "POST",
      mode: "cors",
      headers: headers,
      cache: "default",
      body: JSON.stringify({ query, variables }),
      signal: signal,
    };
  }
  let request = fetch("https://beta.pokeapi.co/graphql/v1beta", config);
  let result = await timeout(10000, request).catch(async (err) => {
    controller.abort();
    let res = await fetchOldQuery(query, variables);
    return res;
  });
  result = await result.json();
  result = result.data;
  return result;
}

function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("TIMEOUT"));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason) => {
        clearTimeout(timer);
        reject(reason);
      });
  });
}
