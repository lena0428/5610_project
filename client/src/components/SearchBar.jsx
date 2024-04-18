import React, { useState } from "react";
import "../style/searchbar.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const SearchBar = ({ onSearch, filterGroups, isLogged }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
    if (filterGroups) {
      if (isLogged) {
        navigate(`/app/search/${searchTerm}`);
      } else {
        navigate(`/search/${searchTerm}`);
      }
    } else {
      if (isLogged) {
        navigate(`/app/search`);
      } else {
        navigate(`/search`);
      }
    }
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
