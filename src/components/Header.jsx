import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const authLinks = [
    { to: '/profile', label: 'Profile' },
    { to: '/friends', label: 'Friends' },
    { to: '/users', label: 'Users' },
    { to: '/news', label: 'News' },
    { to: '/news/create-news', label: 'Create News' },
  ];

  const guestLinks = [
    { to: '/login', label: 'Sign in' },
    { to: '/registration', label: 'Registration' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-custom py-2">
      <div className="container-fluid position-relative d-flex align-items-center">
        <Link className="navbar-brand text-white fs-3 fw-bold fst-italic" to="/" onClick={() => setMenuOpen(false)}>
          Friendly
        </Link>

        {/* Анимированная бургер-кнопка */}
        <button
          className={`navbar-toggler border-0 d-lg-none ${menuOpen ? 'open' : ''}`}
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="bar top-bar"></span>
          <span className="bar middle-bar"></span>
          <span className="bar bottom-bar"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          {userData && (
            <div className="center-nav d-none d-lg-flex">
              {authLinks.map((item) => (
                <Link key={item.to} to={item.to} className="nav-link-custom">
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="right-nav d-none d-lg-flex">
            {userData ? (
              <Link to="/login" onClick={handleLogout} className="nav-link-custom">
                Logout
              </Link>
            ) : (
              guestLinks.map((item) => (
                <Link key={item.to} to={item.to} className="nav-link-custom">
                  {item.label}
                </Link>
              ))
            )}
          </div>

          {/* Мобильное меню */}
          <ul className="navbar-nav d-lg-none w-100">
            {userData ? (
              <>
                {authLinks.map((item) => (
                  <li key={item.to} className="nav-item">
                    <Link to={item.to} className="nav-link-custom" onClick={() => setMenuOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="nav-item">
                  <Link to="/login" onClick={handleLogout} className="nav-link-custom">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              guestLinks.map((item) => (
                <li key={item.to} className="nav-item">
                  <Link to={item.to} className="nav-link-custom" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
