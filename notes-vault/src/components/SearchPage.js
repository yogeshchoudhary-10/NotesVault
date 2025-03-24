import React, { useState } from 'react';

function SearchPage({ isLoggedIn, onLogout, onMyNotes }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Redirect if not logged in
  if (!isLoggedIn) {
    return <div>You need to login first</div>;
  }
  
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you would search through the OCR database here
    // For now, just simulate some results
    if (searchQuery) {
      setSearchResults([
        { id: 1, title: "Math Notes", preview: "Contains formula for..." },
        { id: 2, title: "Chemistry Notes", preview: "Periodic table elements..." },
        { id: 3, title: "Physics Notes", preview: "Newton's laws of motion..." }
      ]);
    } else {
      setSearchResults([]);
    }
  };
  
  return (
    <div className="search-page">
      <nav className="navbar">
        <div className="nav-brand">Notes Vault</div>
        <div className="nav-links">
          <a href="#" className="nav-link" onClick={onMyNotes}>My Notes</a>
          <a href="#" className="nav-link" onClick={onLogout}>Logout</a>
        </div>
      </nav>
      
      <div className="search-content">
        <h2>Search Your Notes</h2>
        <form onSubmit={handleSearch}>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Enter search keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">Search</button>
          </div>
        </form>
        
        <div className="search-results">
          {searchResults.length > 0 ? (
            <>
              <h3>Results:</h3>
              <ul className="results-list">
                {searchResults.map(result => (
                  <li key={result.id} className="result-item">
                    <h4>{result.title}</h4>
                    <p>{result.preview}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            searchQuery && <p>No results found for "{searchQuery}"</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;