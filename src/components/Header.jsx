import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const userData = useAuth();
  console.log(userData)
  return (
    <nav
      className="navbar navbar-expand-lg py-1"
      style={{ background: 'linear-gradient(135deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)' }}
    >
      <div className="container-fluid">
        {/* Логотип */}
        <a className="navbar-brand text-white fs-3 fw-bold fst-italic" href="/">
          Friendly
        </a>

        {/* Справа: аватар или кнопки */}
        {userData.user ? (
          <img
            src={"emblem_logo.png"}
            alt="User avatar"
            className="rounded-circle"
            width={50}
            height={50}
          />
        ) : (
          <div>
            <a href="/login" className="btn btn-outline-light me-2">Войти</a>
            <a href="/register" className="btn btn-light">Регистрация</a>
          </div>
        )}
      </div>
    </nav>
  );
}
