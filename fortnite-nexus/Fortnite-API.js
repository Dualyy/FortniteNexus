
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
// Define the server configuration
// This will read from the .env file in the root directory
const server = {
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  API_KEY: process.env.API_KEY || ''
};
import axios from 'axios';

import pkg from 'fnapicom';
import { get } from 'http';
console.log(process.env.API_KEY)

const app = express();
const port = 3000



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/', async (req, res) => {
  console.log('Received request for Fortnite stats');
  await getFortniteStatsSolo("exiira.x3").then(data => {
    console.log('Fortnite stats:', data);
  res.send(data);
});
});


// Example API call using axios

  async function getFortniteStatsSolo(username) {
  try {
    const response = await axios.get(`https://fortnite-api.com/v2/stats/br/v2?name=${username}`, {
      headers: { Authorization: `${server.API_KEY}` }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

