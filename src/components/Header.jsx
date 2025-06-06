// Header.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext'; // ✅ Хук для уведомлений

export default function Header() {
  const { userData, logout } = useAuth();
  const { notifications } = useNotifications(); // ✅ Получаем уведомления
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav
      className="navbar navbar-expand-lg py-1 position-relative"
      style={{
        background: 'linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)',
      }}
    >
      <div className="container-fluid">
        {/* Логотип */}
        <Link className="navbar-brand text-white fs-3 fw-bold fst-italic" to="/">
          Friendly
        </Link>

        {/* Блок уведомлений */}
        <div className="me-3 position-relative">
          <button className="btn btn-light btn-sm rounded-circle p-2">
            🔔
            <span className="badge bg-danger">{notifications.length}</span>
          </button>
          {notifications.length > 0 && (
            <ul className="dropdown-menu show position-absolute mt-2 bg-white shadow border" style={{ minWidth: '250px', maxHeight: '300px', overflowY: 'auto' }}>
              {notifications.map((n, index) => (
                <li key={index} className="dropdown-item">
                  <strong>{n.title}</strong>
                  <p className="mb-0 small">{n.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Аватар и выпадающее меню */}
        {userData ? (
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button
                className="btn p-0 border-0 bg-transparent"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                <img
                  src={"/emblem_logo.png"}
                  alt="User avatar"
                  className="rounded-circle"
                  width={50}
                  height={50}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="dropdown-menu show position-absolute end-0 mt-2"
                  style={{ zIndex: 1000 }}
                >
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    Home
                  </Link>
                  <Link to="/users" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    Users
                  </Link>
                  <Link to="/news" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    News
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <Link to="/login" className="btn btn-outline-light me-2">Войти</Link>
            <Link to="/registration" className="btn btn-light">Регистрация</Link>
          </div>
        )}
      </div>
    </nav>
  );
}