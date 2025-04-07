import { useState, useEffect } from 'react';
import api from '../api/config';
import { FiSearch, FiX, FiFileText, FiClock } from 'react-icons/fi';


const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const searchNotes = async () => {
      if (query.trim().length < 3) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (err) {
        setError('Failed to search notes. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchNotes, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError('');
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search notes by content..."
          aria-label="Search notes"
        />
        {query && (
          <button className="clear-button" onClick={clearSearch} aria-label="Clear search">
            <FiX />
          </button>
        )}
      </div>

      {(isLoading || error || results.length > 0) && isFocused && (
        <div className="search-results">
          {isLoading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              Searching...
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {!isLoading && results.length === 0 && query.length >= 3 && (
            <div className="no-results">No matching notes found</div>
          )}

          {results.map(result => (
            <a 
              key={result.id} 
              className="result-item"
              href={`/notes/${result.id}`}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
            >
              <FiFileText className="file-icon" />
              <div className="result-content">
                <h4 className="result-title">{result.filename}</h4>
                <p className="result-snippet">{result.content_snippet}</p>
                <div className="result-meta">
                  <FiClock className="meta-icon" />
                  <span className="result-date">
                    {new Date(result.upload_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;