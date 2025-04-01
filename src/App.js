import React, { useState, useEffect } from "react";
import "./App.css";
import { motion } from "framer-motion";

import pizzaIcon from "./assets/pizza.png";
import burgerIcon from "./assets/burger.png";
import chineseIcon from "./assets/chinese.png";
import dessertIcon from "./assets/dessert.png";
import takeawayIcon from "./assets/takeaway.png";


const fetchRestaurants = async (postcode) => {
  try {
    const response = await fetch(`http://localhost:5001/restaurants/${postcode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const RestaurantCard = ({ restaurant }) => {
  const [expanded, setExpanded] = useState(false);
  const cuisineImage = getCuisineImage(restaurant.cuisines);

  return (
    <motion.div 
      className="card"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="card-image">
        <img src={cuisineImage} alt="Cuisine" />
      </div>
      
      <p>⭐ {restaurant.rating.starRating} <soft>({restaurant.rating.count})</soft></p>
      <h3>{restaurant.name}</h3>
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p><strong>Cuisines:</strong> {restaurant.cuisines.map(c => c.name).join(", ")}</p>
          <p><strong>Address:</strong> {restaurant.address.city}, {restaurant.address.firstLine}, {restaurant.address.postalCode}</p>
        </motion.div>
      )}
    </motion.div>
  );
};


const getCuisineImage = (cuisines) => {
  const cuisineNames = cuisines.map(c => c.name.toLowerCase());

  if (cuisineNames.includes("pizza")) return pizzaIcon;
  if (cuisineNames.includes("burgers")) return burgerIcon;
  if (cuisineNames.includes("chinese") || cuisineNames.includes("noodles")) return chineseIcon;
  if (cuisineNames.includes("dessert")) return dessertIcon;

  return takeawayIcon; // Default image
};


function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [postcode, setPostcode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  useEffect(() => {
    if (postcode) {
      fetchRestaurants(postcode).then(setRestaurants);
    }
  }, [postcode]);

  // Extract unique cuisines
  const uniqueCuisines = [...new Set(restaurants.flatMap(r => r.cuisines.map(c => c.name)))];

  // Define fixed rating options (1 to 5)
  const ratingOptions = [1, 2, 3, 4, 5];

  // Apply filters
  const filteredRestaurants = restaurants.filter(r => {
    const roundedRating = Math.floor(r.rating?.starRating || 0);

    return (
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCuisine ? r.cuisines.some(c => c.name === selectedCuisine) : true) &&
      (selectedRating ? roundedRating === parseInt(selectedRating) : true)
    );
  });

  return (
    <div className="App">
      <h1>Restaurant Finder</h1>

      {/* Postcode Search Box */}
      <label>Enter Postcode: </label>
      <input 
        type="text" 
        placeholder="e.g., CT1 2EH" 
        value={postcode} 
        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
      />

      {/* Restaurant Name Search */}
      <label>Search Restaurant: </label>
      <input 
        type="text" 
        placeholder="Search by name..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Cuisine Dropdown */}
      <label>Filter by Cuisine: </label>
      <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}>
        <option value="">All</option>
        {uniqueCuisines.map((cuisine, index) => (
          <option key={index} value={cuisine}>{cuisine}</option>
        ))}
      </select>

      {/* Rating Dropdown */}
      <label>Filter by Rating: </label>
      <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
        <option value="">All</option>
        {ratingOptions.map((rating) => (
          <option key={rating} value={rating}>{rating} Stars</option>
        ))}
      </select>

      {/* Restaurant Table */}
      <div className="restaurant-list">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((r, index) => <RestaurantCard key={index} restaurant={r} />)
        ) : (
          <p>No restaurants found</p>
        )}
      </div>
    </div>
  );
}

export default App;
