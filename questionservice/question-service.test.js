// test.js
const axios = require('axios');

const PORT = 8004;
const BASE_URL = `http://localhost:${PORT}`;

async function testMusiciansEndpoint() {
  try {
    const response = await axios.get(`${BASE_URL}/musicians`);
    console.log('Test Passed\nResponse from /musicians endpoint:', response.data);
  } catch (error) {
    console.error('Error testing /musicians endpoint:', error.message || error);
  }
}

testMusiciansEndpoint();