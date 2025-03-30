const express = require("express");
const axios = require("axios");
const app = express();
const port = 8004;

const WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql";
const CACHE_SIZE = 10; // Number of questions to keep in cache
const REFILL_THRESHOLD = 3; // When cache drops to this size, refill it

// Question cache and control variables
let questionCache = [];
let isRefilling = false;

async function queryWikidata(sparqlQuery) {
  try {
    const response = await axios.get(WIKIDATA_SPARQL_URL, {
      params: { query: sparqlQuery, format: "json" },
      headers: { Accept: "application/sparql-results+json" },
    });
    return response.data.results.bindings;
  } catch (error) {
    console.error("Error querying Wikidata:", error.message || error);
    return null;
  }
}

const sparqlQuery = `
  SELECT ?musicianLabel ?birthDate ?image
  WHERE {
    ?musician wdt:P106 wd:Q639669;
              wdt:P27 wd:Q145;
              wdt:P569 ?birthDate;
              wdt:P18 ?image.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
  }
  LIMIT 20
`;

async function generateQuestion() {
  const results = await queryWikidata(sparqlQuery);
  if (!results || results.length < 5) return null;

  const correctMusician = results[Math.floor(Math.random() * results.length)];
  const otherMusicians = results.filter((m) => m !== correctMusician);

  return {
    question: `Who is the musician born on ${correctMusician.birthDate.value} in the image?`,
    image: correctMusician.image.value,
    options: [
      correctMusician.musicianLabel.value,
      ...otherMusicians.slice(0, 3).map((m) => m.musicianLabel.value),
    ].sort(() => Math.random() - 0.5),
    musicianName: correctMusician.musicianLabel.value,
  };
}

async function refillCache() {
  if (isRefilling) return;
  isRefilling = true;
  
  try {
    while (questionCache.length < CACHE_SIZE) {
      const question = await generateQuestion();
      if (question) {
        questionCache.push(question);
      }
      // Small delay to avoid hammering the API
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  } catch (error) {
    console.error("Error refilling cache:", error);
  } finally {
    isRefilling = false;
  }
}

// Initial cache fill
refillCache();

// Background cache maintenance
setInterval(() => {
  if (questionCache.length <= REFILL_THRESHOLD && !isRefilling) {
    refillCache();
  }
}, 1000);

app.get("/musicians", async (req, res) => {
  if (questionCache.length === 0) {
    // If cache is empty (shouldn't happen), generate one on the fly
    const question = await generateQuestion();
    if (question) {
      res.json(question);
    } else {
      res.status(503).json({ error: "Service temporarily unavailable" });
    }
    return;
  }

  // Get the first question from cache
  const question = questionCache.shift();
  res.json(question);

  // Trigger refill if needed
  if (questionCache.length <= REFILL_THRESHOLD && !isRefilling) {
    refillCache();
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = server;