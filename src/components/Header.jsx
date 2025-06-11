import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg py-1"
      style={{
        background: 'linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)'
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between w-100">
        {/* Логотип */}
        <Link className="navbar-brand text-white fs-3 fw-bold fst-italic" to="/">
          Friendly
        </Link>

        {/* Контейнер для кнопок и тогглера */}
        <div className="d-flex align-items-center gap-2">
          {/* Кнопка для мобильного меню */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Десктопная навигация */}
          {userData && (
            <div className="d-none d-lg-flex align-items-center gap-2 ms-auto">
              <Link to="/profile" className="btn btn-outline-warning hover-bg-orange">Profile</Link>
              <Link to="/" className="btn btn-outline-warning hover-bg-orange">Home</Link>
              <Link to="/users" className="btn btn-outline-warning hover-bg-orange">Users</Link>
              <Link to="/news" className="btn btn-outline-warning hover-bg-orange">News</Link>
              <Link to="/friends" className="btn btn-outline-warning hover-bg-orange">Friends</Link>
              <Link to="/news/create-news" className="btn btn-outline-warning hover-bg-orange">Create News</Link>

              {/* Вертикальный разделитель */}
              <span className="vr opacity-100 mx-2"></span>

              <button onClick={handleLogout} className="btn btn-outline-warning hover-bg-orange">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Мобильное меню */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {userData && (
            <>
              <li className="nav-item d-lg-none mb-2">
                <Link to="/profile" className="btn btn-outline-light w-100 hover-bg-orange">Profile</Link>
              </li>
              <li className="nav-item d-lg-none mb-2">
                <Link to="/" className="btn btn-outline-light w-100 hover-bg-orange">Home</Link>
              </li>
              <li className="nav-item d-lg-none mb-2">
                <Link to="/users" className="btn btn-outline-light w-100 hover-bg-orange">Users</Link>
              </li>
              <li className="nav-item d-lg-none mb-2">
                <Link to="/news" className="btn btn-outline-light w-100 hover-bg-orange">News</Link>
              </li>
              <li className="nav-item d-lg-none mb-2">
                <Link to="/friends" className="btn btn-outline-light w-100 hover-bg-orange">Friends</Link>
              </li>
              <li className="nav-item d-lg-none mb-2">
                <Link to="/news/create-news" className="btn btn-outline-light w-100 hover-bg-orange">Create News</Link>
              </li>
              <li className="nav-item d-lg-none mb-2">
                <hr className="dropdown-divider" />
              </li>
              <li className="nav-item d-lg-none mb-2">
                <button onClick={handleLogout} className="btn btn-outline-light w-100 hover-bg-orange">Logout</button>
              </li>
            </>
          )}

          {!userData && (
            <div className="d-none d-lg-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-outline-warning hover-bg-orange">Войти</Link>
              <Link to="/registration" className="btn btn-outline-warning hover-bg-orange">Регистрация</Link>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
}