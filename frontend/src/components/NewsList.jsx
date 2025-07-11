import React, { useState, useEffect } from 'react';
import './NewsList.css';

const NewsList = ({ category, count }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/news/headlines/${category}?count=${count}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.articles) {
          setArticles(data.articles);
        } else {
          console.error('Error from backend:', data.error);
          setError(data.error || 'Failed to fetch news');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to connect to news service');
      }
      setLoading(false);
    };

    fetchArticles();
  }, [category, count]);

  return (
    <div className="news-list">
      <div className="news-header">
        <h2>{category} News</h2>
        <a href="#seeAll" className="see-all">See All</a>
      </div>
      {loading && <div className="loading">Loading {category} news...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && articles.length === 0 && (
        <div className="no-articles">No {category} articles available</div>
      )}
      <div className="news-items">
        {articles.map((article, index) => (
          <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="news-item">
            <div className="image-container">
              <img src={article.urlToImage} alt={article.title} />
            </div>
            <div className="news-info">
              <span className="category">{article.source.name}</span>
              <h3 className="title">{article.title}</h3>
              <p className="author">by {article.author || 'Unknown'}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsList;