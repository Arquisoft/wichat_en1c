const axios = require('axios');

// Wikidata SPARQL endpoint URL
const WIKIDATA_SPARQL_URL = 'https://query.wikidata.org/sparql';

// Function to execute a SPARQL query and return the results
async function queryWikidata(sparqlQuery) {
  try {
    const response = await axios.get(WIKIDATA_SPARQL_URL, {
      params: {
        query: sparqlQuery,
        format: 'json'
      },
      headers: {
        'Accept': 'application/sparql-results+json'
      }
    });

    // Extract and return the results
    return response.data.results.bindings;

  } catch (error) {
    console.error('Error querying Wikidata:', error.message || error);
    return null;
  }
}

// Combined SPARQL query to get musicians from the UK with their birth dates and images
const sparqlQuery = `
  SELECT ?musicianLabel ?birthDate ?image
  WHERE {
    ?musician wdt:P106 wd:Q639669;   # Occupation (P106): "musician" (Q639669)
              wdt:P27 wd:Q145;       # Filter by country of citizenship (P27): United Kingdom (Q145)
              wdt:P569 ?birthDate;   # Obtain date of birth (P569)
              wdt:P18 ?image.        # Obtain image (P18)
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
  }
  LIMIT 100
`;

// Execute the query and log the results
queryWikidata(sparqlQuery).then(results => {
  if (results) {
    results.forEach(result => {
      console.log(`Musician: ${result.musicianLabel.value}, Birth Date: ${result.birthDate.value}, Image: ${result.image.value}`);
    });
  } else {
    console.log('No results found or an error occurred.');
  }
});