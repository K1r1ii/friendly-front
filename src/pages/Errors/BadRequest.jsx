import React from 'react';
import { Link } from 'react-router-dom';

export default function BadRequest() {
  return (
    <div className="error-block">
      <h1 className="error-code">400</h1>
      <h2 className="error-title">Bad Request</h2>
      <p className="error-message">
        The server could not understand your request. Please try again.
      </p>
      <Link to="/" className="error-btn">
        Go home
      </Link>
    </div>
  );
}
