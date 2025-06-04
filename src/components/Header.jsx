import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const { userData, logout } = useAuth();
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
      style={{ background: 'linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)' }}
    >
      <div className="container-fluid">
        {/* Логотип */}
        <Link className="navbar-brand text-white fs-3 fw-bold fst-italic" to="/">
          Friendly
        </Link>

        {/* Справа: аватар или кнопки */}
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
              
              {/* Выпадающее меню */}
              {isDropdownOpen && (
                <div 
                  className="dropdown-menu show position-absolute end-0 mt-2"
                  style={{ zIndex: 1000 }}
                >
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/" 
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/news" 
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    News
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
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