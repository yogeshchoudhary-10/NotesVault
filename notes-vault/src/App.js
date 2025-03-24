import React, { useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SearchPage from './components/SearchPage';
import MyNotesPage from './components/MyNotesPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigateTo = (page) => {
    setCurrentPage(page);
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('search');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };
  
  return (
    <div className="App">
      {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
      {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentPage === 'search' && (
        <SearchPage 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout} 
          onMyNotes={() => navigateTo('my-notes')} 
        />
      )}
      {currentPage === 'my-notes' && (
        <MyNotesPage 
          onBack={() => navigateTo('search')} 
        />
      )}
    </div>
  );
}

export default App;