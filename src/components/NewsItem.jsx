import React, { useState, useEffect } from 'react';
import { profileAPI } from '../api/profile';

export default function NewsItem({ news }) {
    const [author, setAuthor] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    const fetchAuthor = async () => {
        try {
            setLoading(true);
            const author = await profileAPI.getUserProfile(news.owner_id);
            setAuthor(author);
        } catch (err) {
            setError(err.message || 'Не удалось загрузить автора');
            console.error('Ошибка загрузки автора:', err);
        } finally {
            setLoading(false);
        }
    };
    fetchAuthor();
    }, []);

    return (
    <div className="card mb-4 shadow-sm">
        <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">{news.topic}</h5>
            <small className="text-muted">{news.created_at}</small>
        </div>
        
        <p className="card-text">{news.main_text}</p>
        
        <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="d-flex align-items-center">
            <img 
                src="/avatar.png"
                alt="Автор"
                className="rounded-circle me-2"
                width="32"
                height="32"
            />
            <small className="text-muted">Author: {author.firstName ? author.firstName : author.nickname}</small>
            </div>
        </div>
        </div>
    </div>
    );
}