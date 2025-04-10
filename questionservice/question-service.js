const express = require("express");
const axios = require("axios");
const queries = require("./queries");
const app = express();
const port = 8004;

const WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql";
const CACHE_SIZE = 10;
const REFILL_THRESHOLD = 3;

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

async function generateQuestion(category = 'musician') {
  const sparqlQuery = queries[category] || queries.musician;
  const results = await queryWikidata(sparqlQuery);
  if (!results || results.length < 5) return null;

  // Filter: If name includes numeric, skip the name.
  const validResults = results.filter(person => {
    const label = person[`${category}Label`].value;
    return !/\d/.test(label); 
  });

  if (validResults.length < 5) return null;

  const correctPerson = validResults[Math.floor(Math.random() * validResults.length)];
  const otherPeople = validResults.filter((m) => m !== correctPerson);


  
  // Date Format (DD/MM/YYYY)
  const rawDate = correctPerson.birthDate.value;
  const formattedDate = formatWikidataDate(rawDate);

  const options = new Set();
  options.add(correctPerson[`${category}Label`].value);
  for (const person of otherPeople) {
    if (options.size >= 4) break; // We only need 4 options total
    const label = person[`${category}Label`].value;
    if (!options.has(label)) {
      options.add(label);
    }
  }

  // If we couldn't get enough unique options, return null
  if (options.size < 4) return null;

  return {
    question_en: `Who is the ${category} born on ${formattedDate} in the image?`,
    question_es: `¿Quién es el ${category} nacido el ${formattedDate} en la imagen?`,
    image: correctPerson.image.value,
    options: [...options].sort(() => Math.random() - 0.5),
    correctAnswer: correctPerson[`${category}Label`].value,
    category: category
  };
}

function formatWikidataDate(wikidataDate) {
  try {
    
    const datePart = wikidataDate.split('T')[0]; 
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    console.error('Date could not formatted correctly:', wikidataDate);
    return wikidataDate; 
  }
}

async function refillCache() {
  if (isRefilling) return;
  isRefilling = true;
  
  try {
    while (questionCache.length < CACHE_SIZE) {
      
      const categories = ['musician', 'scientist', 'actor', 'painter', 'writer'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const question = await generateQuestion(randomCategory);
      if (question) {
        questionCache.push(question);
      }
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
const bgRefill = setInterval(() => {
  if (questionCache.length <= REFILL_THRESHOLD && !isRefilling) {
    refillCache();
  }
}, 1000);

app.get("/question", async (req, res) => {
  if (questionCache.length === 0) {
    const question = await generateQuestion();
    if (question) {
      res.json(question);
    } else {
      res.status(503).json({ error: "Service temporarily unavailable" });
    }
    return;
  }

  const question = questionCache.shift();
  res.json(question);

  if (questionCache.length <= REFILL_THRESHOLD && !isRefilling) {
    refillCache();
  }
});

// Category endpoints: musician, scientist, actor, painter, writer
app.get("/question/:category", async (req, res) => {
  const category = req.params.category;
  if (!queries[category]) {
    return res.status(400).json({ error: "Invalid category" });
  }

  try {
    const question = await generateQuestion(category);
    if (question) {
      res.json(question);
    } else {
      res.status(503).json({ error: "Could not generate question" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.on("close", () => {
  clearInterval(bgRefill); // Stop the background refill process
});

process.on("SIGINT", () => {
  server.close();
});

module.exports = server;