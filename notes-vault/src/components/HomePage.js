import React from 'react';

function HomePage({ navigateTo }) {
  return (
    <div className="home-page">
      <div className="content-container">
        <h1 className="app-title">Notes Vault</h1>
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search your notes..." 
          />
          <button 
            className="search-button"
            onClick={() => navigateTo('login')}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;