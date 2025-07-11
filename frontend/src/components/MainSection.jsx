// FILE: src/components/MainSection.jsx
import React, { useEffect, useState } from 'react';
import './MainSection.css';

const MainSection = () => {
    const [featuredArticle, setFeaturedArticle] = useState(null);
    const [sideArticles, setSideArticles] = useState([]);
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;

    // Function to shuffle an array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
                const data = await response.json();
                if (data.articles && data.articles.length > 0) {
                    // Filter out articles with missing content
                    const filteredArticles = data.articles.filter(article =>
                        article.urlToImage && article.title && article.description && article.author && article.source.name
                    );
                    const shuffledArticles = shuffleArray(filteredArticles);
                    setFeaturedArticle(shuffledArticles[0]); // Assuming the first article is the featured one
                    setSideArticles(shuffledArticles.slice(1, 4)); // The next 3 articles are side articles
                } else {
                    console.error('No articles found in the response');
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, [apiKey]);

    return (
        <section className="main-section">
            {featuredArticle && (
                <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer" className="featured-article">
                    <img
                        src={featuredArticle.urlToImage}
                        alt="Featured Article"
                        className="featured-image"
                    />
                    <div className="featured-content">
                        <h2 className="featured-category">{featuredArticle.source.name}</h2>
                        <h1 className="featured-title">{featuredArticle.title}</h1>
                        <p>{featuredArticle.description}</p>
                        <p className="featured-author">by {featuredArticle.author}</p>
                    </div>
                </a>
            )}

            <div className="side-articles">
                {sideArticles.map((article, index) => (
                    <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="side-article">
                        <img
                            src={article.urlToImage}
                            alt={`Side Article ${index + 1}`}
                            className="side-article-image"
                        />
                        <div className="side-article-content">
                            <h3 className="side-category">{article.source.name}</h3>
                            <h2 className="side-title">{article.title}</h2>
                            <p className="side-author">by {article.author}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default MainSection;