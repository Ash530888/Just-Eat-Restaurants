const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const port = 5001;

// Fetch restaurant data by postcode from Just Eat API
app.get('/restaurants/:postcode', async (req, res) => {
  const postcode = req.params.postcode;
  
  try {
    // Fetch data from Just Eat API
    const response = await axios.get(`https://uk.api.just-eat.io/discovery/uk/restaurants/enriched/bypostcode/${postcode}`);
    
    // Extract first 10 restaurants and map relevant information
    const restaurantData = response.data.restaurants
      .slice(0, 10) // Get only the first 10
      .map(restaurant => ({
        name: restaurant.name,
        cuisines: restaurant.cuisines,
        rating: restaurant.rating,
        address: restaurant.address,
      }));
    
    // Send the extracted data as the response
    res.json(restaurantData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching restaurant data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
