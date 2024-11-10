import React, { useState } from "react";
import "./Categories.css";

export default function Categories() {
  // State to track selected category (number)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Handle category selection
  const handleCategoryClick = (category: number) => {
    setSelectedCategory(category);
  };

  // Handle Nurse Name Button Click
  const handleButtonClick = () => {
    if (selectedCategory !== null) {
      alert(`You have selected Category: ${selectedCategory}`);
    } else {
      alert("Please select a category first.");
    }
  };

  return (
    <div
      className="main-container"
      style={{
        backgroundImage: "url(./assets/signin.png)",
      }}
    >
      <div className="section">{/* Here should be a navigation bar */}</div>

      {/* Categories label */}
      <div className="wrapper">
        <span className="text text-large">Categories: Nurse</span>
      </div>

      {/* Big Box Container */}
      <div className="big-box">
        <div className="wrapper-2">
          {/* Category boxes */}
          {[...Array(10)].map((_, index) => (
            <div
              className={`category-box ${
                selectedCategory === index + 1 ? "selected" : ""
              }`}
              key={index}
              onClick={() => handleCategoryClick(index + 1)} // Pass the category index
            >
              <span className="category-text">{`Category ${index + 1}`}</span>
            </div>
          ))}
        </div>

        {/* Nurse Name Button */}
        <button
          className="nurse-button"
          onClick={handleButtonClick}
          disabled={selectedCategory === null} // Disable button if no category is selected
        >
          Nurse Name
        </button>
      </div>

      <div className="img-2" />
    </div>
  );
}
