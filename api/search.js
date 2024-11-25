const axios = require('axios'); // Used to make HTTP requests to the TMDB API
require('dotenv').config();  // This loads environment variables from the .env file (TMDB API key)

const TMDB_API_URL = 'https://api.themoviedb.org/3/search/multi?'


module.exports = async (req, res) => {
    const query = req.query.query;  // Get the search query from the frontend
  

    try {
        // Make the request to TMDB API
        const tmdbResponse = await axios.get(TMDB_API_URL, {
          params: {
            api_key: process.env.TMDB_API_KEY,  // Use the secure API key from the .env file
            query: query
          }
        });
    
        // Send the results from the USDA API back to the frontend
      
        res.status(200).json(tmdbResponse.data);  // Return the data as JSON
      } catch (error) {
        console.error('Error fetching data from TMDB API:', error);
        res.status(500).json({ error: 'Failed to fetch data from TMDB API' });
      }
};