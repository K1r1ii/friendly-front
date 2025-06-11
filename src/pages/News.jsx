import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import NewsItem from '../components/NewsItem';
import { newsAPI } from '../api/news';

export default function News({ userId }) {
  const { userData } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleNewsDeleted = (newsId) => {
    setNews(prevNews => prevNews.filter(item => item.post_body.news_id !== newsId));
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        let newsData;
        if (typeof userId === "undefined") {
          newsData = await newsAPI.getNews();
        } else {
          newsData = await newsAPI.getUserNews(userId);
        }
        setNews(newsData);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить новости');
        console.error('Ошибка загрузки новостей:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">News</h1>
            {userData && (
              <Link to="/news/create_news" className="btn btn-primary">
                <i className="bi bi-plus-lg me-1"></i>add news
              </Link>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading news...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <div className="mt-2">
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            </div>
          ) : news.length === 0 ? (
            <div className="card shadow text-center py-5">
              <div className="card-body">
                <i className="bi bi-newspaper display-1 text-muted mb-4"></i>
                <h3 className="card-title">No news yet</h3>
                <p className="card-text">
                  Be the first to share the news!
                </p>
                <Link to="/news/create_news" className="btn btn-primary mt-2">
                  Create news
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {news.map(item => (
                <NewsItem key={item.post_body.news_id} news={item} onNewsDeleted={handleNewsDeleted} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}