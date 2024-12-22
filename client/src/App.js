// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>Tech News Aggregator</h1>
      <div className="filters-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={fetchNews} className="refresh-btn">
          Refresh
        </button>
      </div>
      
      <div className="news-grid">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          filteredNews.map((item, index) => (
            <article key={index} className="news-card">
              <h2>{item.title}</h2>
              <p className="source">{item.source}</p>
              <div className="button-group">
                <button className="read-more-btn">Read more</button>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="visit-site-btn"
                >
                  Visit site
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default App;