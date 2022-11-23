async function fetchOldQuery(query, variables) {
  queryName = query.substring(6);
  let regex = new RegExp(/\w*/g);
  queryName = regex.exec(queryName)[0];
  let func = window[queryName];
  if (typeof func == "function") {
    let result = await func();
    return result;
  }
}

async function GetAllGeneration() {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  //headers.append("X-Method-Used", "graphiql");
  //headers.append("Accept", "application/json");
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
      id: key,
    });
  });
  return result;
}
