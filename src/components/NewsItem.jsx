import React from 'react';

export default function NewsItem({ news }) {
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
                src="/emblem_logo.png"
                alt="Автор"
                className="rounded-circle me-2"
                width="32"
                height="32"
            />
            <small className="text-muted">ID автора: {news.owner_id}</small>
            </div>
        </div>
        </div>
    </div>
    );
}