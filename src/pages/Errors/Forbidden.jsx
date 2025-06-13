import React from 'react';
import { Link } from 'react-router-dom';

export default function Forbidden() {
  return (
    <div className="error-block">
      <h1 className="error-code">403</h1>
      <h2 className="error-title">Access Denied</h2>
      <p className="error-message">
        You do not have permission to access this page.
      </p>
      <Link to="/" className="error-btn">
        Go home
      </Link>
    </div>
  );
}
