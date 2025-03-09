const assert = require('assert');
const axios = require('axios');
const { queryWikidata } = require('./question-service'); // Replace with the actual file name

// Mock axios for testing
const mockAxios = {
  get: async (url, config) => {
    if (url === 'https://query.wikidata.org/sparql' && config.params.query.includes('LIMIT 100')) {
      return {
        data: {
          results: {
            bindings: [
              {
                musicianLabel: { value: 'John Doe' },
                birthDate: { value: '1980-01-01' },
                image: { value: 'http://example.com/johndoe.jpg' }
              },
              {
                musicianLabel: { value: 'Jane Doe' },
                birthDate: { value: '1985-02-02' },
                image: { value: 'http://example.com/janedoe.jpg' }
              }
            ]
          }
        }
      };
    } else {
      throw new Error('Invalid query or URL');
    }
  }
};

// Replace axios with the mock version
axios.get = mockAxios.get;

// Test the queryWikidata function
async function testQueryWikidata() {
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

  const results = await queryWikidata(sparqlQuery);

  // Assertions to verify the results
  assert(Array.isArray(results), 'Results should be an array');
  assert(results.length > 0, 'Results should not be empty');
  assert.strictEqual(results[0].musicianLabel.value, 'John Doe', 'First musician should be John Doe');
  assert.strictEqual(results[0].birthDate.value, '1980-01-01', 'John Doe\'s birth date should be 1980-01-01');
  assert.strictEqual(results[0].image.value, 'http://example.com/johndoe.jpg', 'John Doe\'s image URL should be correct');

  console.log('All tests passed!');
}

// Run the test
testQueryWikidata().catch(error => {
  console.error('Test failed:', error.message || error);
});