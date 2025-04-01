import React, { useState, useEffect } from "react";
import "./App.css";
import { motion, AnimatePresence } from "framer-motion";  // Import AnimatePresence

import plate1 from "./assets/plate1.png";
import plate2 from "./assets/plate2.png";
import plate3 from "./assets/plate3.png";
import plate4 from "./assets/plate4.png";
import plate5 from "./assets/plate5.png";

const plateImages = [plate1, plate2, plate3, plate4, plate5];

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



const Plate = ({ restaurant, plateImage, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation(); // Prevents the event from propagating up to parent elements, but may need to be removed for debugging
    onClick(restaurant, plateImage);  // This should be triggered when a plate is clicked
  };

  return (
    <motion.div 
      className="card"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}  // Ensure onClick is attached
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="card-image">
        <img src={plateImage} alt="plate" />
      </div>
      
      <div className="card-content">
        <h3>{restaurant.name}</h3>
        <p>⭐ {restaurant.rating.starRating} <soft>({restaurant.rating.count})</soft></p>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p><strong>Cuisines:</strong> {restaurant.cuisines.map(c => c.name).join(", ")}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};


const Modal = ({ restaurant, plateImage, onClose }) => {

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content"
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 100 }}
        onClick={e => e.stopPropagation()}
      >
        <motion.div 
          className="utensil fork"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
        
        <motion.div 
          className="modal-plate"
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
        >
          <img src={plateImage} alt="plate" />
        </motion.div>
        
        <motion.div 
          className="utensil knife"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        <motion.div 
          className="modal-info"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2>{restaurant.name}</h2>
          <p>⭐ {restaurant.rating?.starRating || "N/A"} ({restaurant.rating?.count || "N/A"} reviews)</p>
          <p>
            <strong>Cuisines:</strong> 
            {restaurant.cuisines && restaurant.cuisines.length > 0
              ? restaurant.cuisines.map(c => c.name).join(", ")
              : "N/A"}
          </p>
          <p><strong>Address:</strong> {restaurant.address.firstLine}, {restaurant.address.city}, {restaurant.address.postalCode}</p>
        </motion.div>

        <button className="close-button" onClick={onClose}>×</button>
      </motion.div>
    </motion.div>
  );
};


const getPlateImage = () => {
  const randomIndex = Math.floor(Math.random() * plateImages.length);
  return plateImages[randomIndex];
};

const insertRandomEmptyCells = (restaurants) => {
  const newRestaurantsArray = [];

  restaurants.forEach(restaurant => {

    newRestaurantsArray.push(restaurant);
    const emptyCellsCount = Math.floor(Math.random() * 6);  

    // Insert empty cells
    for (let i = 0; i < emptyCellsCount; i++) {
      newRestaurantsArray.push(null);  // Add empty cell
    }
  });

  return newRestaurantsArray;
}

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [postcode, setPostcode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null) ;

  const handleSelectRestaurant = (restaurant, plateImage) => {
    console.log("Selected restaurant:", { restaurant, plateImage });
    setSelectedRestaurant({ restaurant, plateImage });
  };

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

  // grid of plates with random empty cells
  const gridLayout = insertRandomEmptyCells(filteredRestaurants);

  

  return (
    <div className="App">
      <h1>Take Your Pick From The Virtual Table</h1>

      <div className="filters">
        {/* Postcode Search Box */}
        <div className="filter-group">
          <label>Enter Postcode: </label>
          <input 
            type="text" 
            placeholder="e.g., CT1 2EH" 
            value={postcode} 
            onChange={(e) => setPostcode(e.target.value.toUpperCase())}
          />
        </div>

        {/* Restaurant Name Search */}
        <div className="filter-group">
          <label>Search Restaurant: </label>
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        

        {/* Cuisine Dropdown */}
        <div className="filter-group">
          <label>Filter by Cuisine: </label>
          <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}>
            <option value="">All</option>
            {uniqueCuisines.map((cuisine, index) => (
              <option key={index} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>
        

        {/* Rating Dropdown */}
        <div className="filter-group">
          <label>Filter by Rating: </label>
          <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
            <option value="">All</option>
            {ratingOptions.map((rating) => (
              <option key={rating} value={rating}>{rating} Stars</option>
            ))}
          </select>
        </div>
      </div>
      

      {/* Restaurant Table */}
      <div className="restaurant-list">
        {gridLayout.map((item, index) => (
          <div key={index} className="card-container">
            {item ? (
              <Plate 
                restaurant={item} 
                plateImage={getPlateImage()} 
                onClick={() => handleSelectRestaurant(item, getPlateImage())}
              />
            ) : (
              <div className="empty-cell"></div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedRestaurant && (
          <Modal 
            restaurant={selectedRestaurant.restaurant}
            plateImage={selectedRestaurant.plateImage}
            onClose={() => setSelectedRestaurant(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
