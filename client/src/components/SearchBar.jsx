import React, { useState } from "react";
import "../style/searchbar.css";
import { Button } from "react-bootstrap";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar-container">
      <input
        className="search-bar-input"
        type="text"
        placeholder="Search groups by name"
        value={searchTerm}
        onChange={handleChange}
      />
      <Button className="search-bar-button" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
