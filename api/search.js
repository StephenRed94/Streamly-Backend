const axios = require('axios'); // Used to make HTTP requests to the TMDB API
require('dotenv').config();  // This loads environment variables from the .env file (TMDB API key)

const TMDB_API_URL = 'https://api.themoviedb.org/3/search/multi?';
const TMDB_MOVIE_STREAMING_API_URL = 'https://api.themoviedb.org/3/watch/providers/movie?';
const TMDB_TV_STREAMING_API_URL = 'https://api.themoviedb.org/3/watch/providers/tv?';


module.exports = async (req, res) => {
  const query = req.query.query;  // Get the search query from the frontend

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 

  

    try {
        // Make the request to TMDB API
        const tmdbResponse = await axios.get(TMDB_API_URL, {
          params: {
            api_key: process.env.TMDB_API_KEY,  // Use the secure API key from the .env file
            query: query
          }
        });

        const results = tmdbResponse.data.results.map(item => ({
            title: item.title || item.name,
            overview: item.overview,
            release_date: item.release_date || item.first_air_date,
            // This acts as an if-else statement. If the movie or show has a poster path it completes the url, if not it is set to null
            poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
            media_type: item.media_type,
            id: item.id
        }))


    
        // Send the results from the USDA API back to the frontend
      
        res.status(200).json(results);  // Return the data as JSON
      } catch (error) {
        console.error('Error fetching data from TMDB API:', error);
        res.status(500).json({ error: 'Failed to fetch data from TMDB API' });
      }
};