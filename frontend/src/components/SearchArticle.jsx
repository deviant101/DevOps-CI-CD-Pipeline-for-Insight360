// src/components/SearchArticle.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './SearchArticle.css';

const SearchArticle = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`https://newsapi.org/v2/everything?q=${query}&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`);
                if (response.data.articles.length > 0) {
                    const filteredArticles = response.data.articles.filter(article => 
                        article.urlToImage && article.title && article.description && !article.removed
                    );
                    setArticles(filteredArticles);
                } else {
                    setArticles([]);
                }
            } catch (error) {
                setError('Error fetching articles');
            }
            setLoading(false);
        };

        if (query) {
            fetchArticles();
        }
    }, [query]);

    return (
        <div className="search-article">
            <h2>Search Results for "{query}"</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && articles.length === 0 && <p>No articles found</p>}
            <div className="articles">
                {articles.map((article, index) => (
                    <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="article">
                        <div className="image-container">
                            <img src={article.urlToImage} alt={article.title} />
                        </div>
                        <div className="article-info">
                            <span className="category">{article.source.name}</span>
                            <h3 className="title">{article.title}</h3>
                            <p className="author">by {article.author}</p>
                            <p className="description">{article.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default SearchArticle;