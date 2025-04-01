import React, { useState, useEffect } from "react";
import "./App.css";

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
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cuisines</th>
            <th>Rating</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant, index) => (
              <tr key={index}>
                <td>{restaurant.name}</td>
                <td>{restaurant.cuisines.map(c => c.name).join(", ")}</td>
                <td>{restaurant.rating?.starRating || "N/A"}</td>
                <td>{restaurant.address.firstLine}, {restaurant.address.postalCode}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No restaurants found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
