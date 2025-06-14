import React from 'react';
import { Link } from 'react-router-dom';

export default function Unprocessable( {msg} ) {
  return (
    <div className="error-block">
      <h1 className="error-code">422</h1>
      <h2 className="error-title">Unprocessable Entity</h2>
      <p className="error-message">{msg}</p>
      <Link to="/" className="error-btn">
        Go home
      </Link>
    </div>
  );
}
