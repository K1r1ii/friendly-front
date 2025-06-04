import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { newsAPI } from '../api/news';

export default function CreateNews() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    topic: '',
    main_text: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.topic.trim() || !formData.main_text.trim()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = {
        topic: formData.topic,
        main_text: formData.main_text
      };

      if (image) {
        data.append('image', image);
      }

      await newsAPI.createNews(data);
      setSuccess(true);

      setTimeout(() => {
        navigate('/news');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Не удалось опубликовать новость');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Создать новость</h1>
            <Link to="/news" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-1"></i>Назад
            </Link>
          </div>

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              Новость успешно опубликована!
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="topic" className="form-label">
                Название <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Введите название"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="main_text" className="form-label">
                Основной текст <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="main_text"
                name="main_text"
                rows="8"
                value={formData.main_text}
                onChange={handleChange}
                placeholder="Введите основной текст"
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Фото (опционально)
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Публикуется...
                </>
              ) : (
                'Опубликовать'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}