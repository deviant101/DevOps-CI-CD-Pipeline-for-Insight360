const express = require('express');
const axios = require('axios');

const router = express.Router();

// Get top headlines by category
router.get('/headlines/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { count = 10 } = req.query;
        
        const apiKey = process.env.REACT_APP_NEWS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'News API key not configured' });
        }
        
        const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
            params: {
                category: category.toLowerCase(),
                pageSize: parseInt(count) * 2, // Get more to filter
                apiKey: apiKey,
                country: 'us' // You can make this configurable
            }
        });
        
        if (response.data.articles) {
            // Filter articles that have images and are not removed
            const filteredArticles = response.data.articles.filter(article => 
                article.urlToImage && 
                article.title && 
                article.description && 
                !article.removed
            );
            
            // Return only the requested count
            const limitedArticles = filteredArticles.slice(0, parseInt(count));
            
            res.json({
                status: 'success',
                articles: limitedArticles,
                totalResults: filteredArticles.length
            });
        } else {
            res.status(404).json({ error: 'No articles found' });
        }
    } catch (error) {
        console.error('News API Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to fetch news', 
            details: error.response?.data?.message || error.message 
        });
    }
});

// Search articles
router.get('/search', async (req, res) => {
    try {
        const { q, sortBy = 'popularity' } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        
        const apiKey = process.env.REACT_APP_NEWS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'News API key not configured' });
        }
        
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: q,
                sortBy: sortBy,
                apiKey: apiKey,
                pageSize: 20
            }
        });
        
        if (response.data.articles) {
            // Filter articles that have images and are not removed
            const filteredArticles = response.data.articles.filter(article => 
                article.urlToImage && 
                article.title && 
                article.description && 
                !article.removed
            );
            
            res.json({
                status: 'success',
                articles: filteredArticles,
                totalResults: response.data.totalResults
            });
        } else {
            res.status(404).json({ error: 'No articles found' });
        }
    } catch (error) {
        console.error('News Search API Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to search news', 
            details: error.response?.data?.message || error.message 
        });
    }
});

module.exports = router;
