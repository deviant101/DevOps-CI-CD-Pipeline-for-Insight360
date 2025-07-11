import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './NewsPage.css';

const NewsPage = ({ category, count }) => {
    const [articles, setArticles] = useState([]);
    const { category: routeCategory } = useParams();
    const finalCategory = category || routeCategory;

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${finalCategory}&pageSize=${count * 3}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`);
                const data = await response.json();
                if (data.articles) {
                    const filteredArticles = data.articles.filter(article => article.urlToImage && !article.removed);
                    setArticles(filteredArticles.slice(0, count));
                } else {
                    console.error('No articles found in the response');
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, [finalCategory, count]);

    return (
        <div className="news-page">
            <h2 className="news-category">{finalCategory} News</h2>
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

export default NewsPage;