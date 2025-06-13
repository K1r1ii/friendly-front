// Header.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext'; // ✅ Хук для уведомлений

export default function Header() {
  const { userData, logout } = useAuth();
  const { notifications, markAsRead, clearNotifications } = useNotifications(); // добавил markAsRead и clearNotifications
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const notifDropdown = () => {
    setNotificationsDropdownOpen(!notificationsDropdownOpen);
    console.log('Колокольчик нажали, текущее состояние:', notificationsDropdownOpen);
  };

  const onNotificationClick = (id) => {
    markAsRead(id); // помечаем как прочитанное
    setNotificationsDropdownOpen(false);
    // Пример навигации, поменяй под себя, если нужно
    navigate("/friends?tab=requests");
  };

  const onClearAll = () => {
    clearNotifications();
  };

  return (
    <nav
      className="navbar navbar-expand-lg py-1 position-relative"
      style={{
        background:
          'linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)',
      }}
    >
      <div className="container-fluid">
        {/* Логотип */}
        <Link className="navbar-brand text-white fs-3 fw-bold fst-italic" to="/">
          Friendly
        </Link>

        {/* Блок уведомлений */}
        <div className="me-3 position-relative">
  <button
    className="btn btn-light btn-sm rounded-circle p-2 position-relative"
    onClick={notifDropdown}
    aria-expanded={notificationsDropdownOpen}
    aria-label="Toggle notifications dropdown"
  >
    🔔
    {notifications.length > 0 && (
      <span className="badge bg-danger position-absolute top-0 start-100 translate-middle p-1 rounded-circle">
        {notifications.length}
      </span>
    )}
  </button>

  {notificationsDropdownOpen && (
    <div
      className="position-absolute mt-2 shadow border rounded w-100 text-white"
      style={{
        backgroundColor: '#cc5200', // ← ТЁМНО-ОРАНЖЕВЫЙ
        zIndex: 1050,
        minWidth: "250px",
        maxHeight: "300px",
        right: 0,
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom border-white">
        <strong>Уведомления</strong>
        <button
          onClick={onClearAll}
          className="btn btn-sm btn-outline-light"
          disabled={notifications.length === 0}
        >
          Очистить всё
        </button>
      </div>

      {Array.isArray(notifications) && notifications.length > 0 ? (
        notifications.map((n) => (
          <div
            key={n.id}
            className="dropdown-item text-white"
            style={{ cursor: "pointer", whiteSpace: "normal" }}
            onClick={() => onNotificationClick(n.id)}
          >
            <strong>{n.title}</strong>
            <p className="mb-0 small">{n.body}</p>
          </div>
        ))
      ) : (
        <div className="dropdown-item text-white text-center py-2">
          Уведомлений нет
        </div>
      )}
    </div>
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
                aria-label="Toggle user menu"
              >
                <img
                  src="/emblem_logo.png"
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
                  <Link
                    to="/friends"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Friends
                  </Link>
                  <Link
                    to="/news/create_news"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Create News
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
            <Link to="/login" className="btn btn-outline-light me-2">
              Войти
            </Link>
            <Link to="/registration" className="btn btn-light">
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
