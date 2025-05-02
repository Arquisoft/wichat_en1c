// @ts-check
const axios = require("axios");
const config = require("./config");

/**
 * Query the Wikidata SPARQL endpoint with a given query.
 * @param {string} sparqlQuery - The SPARQL query to execute.
 * @return {Promise<Array>} - The results of the query.
 */
async function sendQuery(sparqlQuery) {
  const response = await axios.get(config.wikidataUrl, {
    params: { query: sparqlQuery, format: "json" },
    headers: { Accept: "application/sparql-results+json" },
  });
  return response.data.results.bindings;
}

const buildBatchQuery = (category, lang, limit) => `
SELECT DISTINCT ?entity ?name WHERE {
  ?entity   wdt:P106 ${config.categories[category]};          # Occupation
            rdfs:label ?name;                                 # Name
            wdt:P569 ?birthDate;                              # Date of birth
            wdt:P18 ?image.                                   # Image
  FILTER (LANG(?name) = "${lang}" && !REGEX(?name, "\\\\d"))
}
LIMIT ${limit}`;

const buildSpecificQuery = (id) => `
SELECT ?birthDate ?image WHERE {
  ?entity   wdt:P569 ?birthDate;                              # Date of birth
            wdt:P18 ?image.                                   # Image
  FILTER (?entity = wd:${id})
}`;

const parseEntities = (entities) =>
  entities.map(({ entity, name }) => ({
    id: entity.value.split("/").pop(),
    name: name.value,
  }));

const parseSpecificData = (data) =>
  data.map(({ birthDate, image }) => ({
    birthDate: new Date(birthDate.value),
    image: image.value,
  }))[0];

module.exports = {
  sendQuery,
  buildBatchQuery,
  buildSpecificQuery,
  parseEntities,
  parseSpecificData,
};
