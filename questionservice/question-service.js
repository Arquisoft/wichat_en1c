const express = require('express');
const axios = require('axios');
//endpoint ??
const app = express();
const port = 8004;



const WIKIDATA_SPARQL_URL = 'https://query.wikidata.org/sparql';

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
  LIMIT 5
`;

app.get('/musicians', async (req, res) => {
  const results = await queryWikidata(sparqlQuery);
  if (results) {
    // Randomly select one musician as the correct answer
    const correctMusician = results[Math.floor(Math.random() * results.length)];
    const otherMusicians = results.filter(m => m !== correctMusician);

    // Prepare the question and options
    const question = {
      question: `Who is the musician born on ${correctMusician.birthDate.value} in the image?`,
      image: correctMusician.image.value,
      options: [
        correctMusician.musicianLabel.value,
        ...otherMusicians.slice(0, 3).map(m => m.musicianLabel.value)
      ].sort(() => Math.random() - 0.5), // Shuffle the options
      musicianName: correctMusician.musicianLabel.value
    };

    res.json(question);
  } else {
    res.status(500).json({ error: 'An error occurred while querying Wikidata.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});