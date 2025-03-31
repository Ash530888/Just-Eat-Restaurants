import React, { useState, useEffect } from "react";
import './App.css';

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
  const [postcode, setPostcode] = useState("CT1 2EH"); 

  useEffect(() => {
    fetchRestaurants(postcode).then(setRestaurants);
  }, [postcode]);

  return (
    <div>

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
          {restaurants.length > 0 ? (
            restaurants.map((restaurant, index) => (
              <tr key={index}>
                <td>{restaurant.name}</td>
                <td>{restaurant.cuisines.map(cuisine => cuisine.name).join(", ")}</td>
                <td>{restaurant.rating.starRating} ({restaurant.rating.count})</td>
                <td>{restaurant.address.city}, {restaurant.address.firstLine}, {restaurant.address.postalCode}</td>
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
