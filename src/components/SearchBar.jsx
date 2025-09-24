import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // it will trigger
        placeholder="Search users"
        className="border rounded px-3 py-2 mx-2 w-full max-w-sm"
      />
    </div>
  );
};

export default SearchBar;