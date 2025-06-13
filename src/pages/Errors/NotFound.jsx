import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="error-block">
      <h1 className="error-code">404</h1>
      <h2 className="error-title">Page not found</h2>
      <p className="error-message">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="error-btn">
        Go home
      </Link>
    </div>
  );
}
