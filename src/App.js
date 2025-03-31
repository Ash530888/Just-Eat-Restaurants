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
    <p>{JSON.stringify(restaurants)}</p>
    
      </div>
  );
}

export default App;
