if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

setSideBar();
setTheme();
setPkmnList("https://pokeapi.co/api/v2/generation/1/");
setRedirect();
