const axios = require('axios'); // Used to make HTTP requests to the TMDB API
require('dotenv').config();  // This loads environment variables from the .env file (TMDB API key)

const TMDB_API_URL = 'https://api.themoviedb.org/3/search/multi?';


module.exports = async (req, res) => {
  const query = req.query.query;  // Get the search query from the frontend

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  

    try {
        // Make the request to TMDB API
        const tmdbResponse = await axios.get(TMDB_API_URL, {
          params: {
            api_key: process.env.TMDB_API_KEY,  // Use the secure API key from the .env file
            query: query
          }
        });

        const movieResults = [];
        const tvResults = [];

        for (let i = 0; i < tmdbResponse.data.results.length; i++) {

            const item = tmdbResponse.data.results[i];
            const movieShowData = {
            title: item.title || item.name,
            overview: item.overview,
            release_date: item.release_date || item.first_air_date,
            // This acts as an if-else statement. If the movie or show has a poster path it completes the url, if not it is set to null
            poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
            media_type: item.media_type,
            id: item.id
        };

        /* 
            If the result is a movie it calls the fetchMovieStreamingInfo function. Once the streaming info has been collected it is added to the 
            movieShowData object, which is then pushed to either the movieResults or tvResults array
        */
        if(item.media_type === 'movie') {
            const movieStreamingInfo = await fetchStreamingInfo(item.media_type, item.id);
            movieShowData.streaming_providers = movieStreamingInfo;
            movieResults.push(movieShowData); 
        }

        else {
            const tvStreamingInfo = await fetchStreamingInfo(item.media_type, item.id);
            movieShowData.streaming_providers = tvStreamingInfo;
            tvResults.push(movieShowData); 
        }
    }


    
        // Send the results from the TMDB API back to the frontend
      
        res.status(200).json({movies: movieResults, shows: tvResults });  // Return the data as JSON
      } catch (error) {
        console.error('Error fetching data from TMDB API:', error);
        res.status(500).json({ error: 'Failed to fetch data from TMDB API' });
      }
};

async function fetchStreamingInfo(mediaType, id) {
    try {
        let response;
    if (mediaType == 'movie') {
                    response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/watch/providers`, {
                        params: {
                            api_key: process.env.TMDB_API_KEY,  // Use the secure API key from the .env file
                        }
                    });
    }

    else if (mediaType == 'tv') {
            response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/watch/providers`, {
                params: {
                    api_key: process.env.TMDB_API_KEY,  // Use the secure API key from the .env file
                }
            });
    }

    else {
        throw new Error('Invalid media type');
    }

    const providers = [];
    const platformData = response.data.results;

    // Loop through available countries and extract the provider names
    for (const country in platformData) {
      if (platformData[country].flatrate) {
        platformData[country].flatrate.forEach(providerItem => {
            if (providerItem.provider_name){
            const providerItem = platformData[i];
            const provider = {
                country: country,
                provider_name: providerItem.provider_name
            };
            providers.push(provider);
        }
        });
    }
}

    return providers;





} catch (error) {
    console.error('Error fetching streaming data', error);
    return [];

    }

}
