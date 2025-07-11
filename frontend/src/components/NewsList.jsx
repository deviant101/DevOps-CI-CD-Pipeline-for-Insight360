import React, { useState, useEffect } from 'react';
import './NewsList.css';

const NewsList = ({ category, count }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&pageSize=${count * 2}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`);
        const data = await response.json();
        if (data.articles) {
          const filteredArticles = data.articles.filter(article => article.urlToImage && !article.removed);
          const shuffledArticles = shuffleArray(filteredArticles);
          setArticles(shuffledArticles.slice(0, count));
        } else {
          console.error('No articles found in the response');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, [category, count]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="news-list">
      <div className="news-header">
        <h2>{category} News</h2>
        <a href="#seeAll" className="see-all">See All</a>
      </div>
      <div className="news-items">
        {articles.map((article, index) => (
          <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="news-item">
            <div className="image-container">
              <img src={article.urlToImage} alt={article.title} />
            </div>
            <div className="news-info">
              <span className="category">{article.source.name}</span>
              <h3 className="title">{article.title}</h3>
              <p className="author">by {article.author}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsList;