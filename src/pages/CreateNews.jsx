import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsAPI } from '../api/news';
import { file_storageAPI } from '../api/file_storage';

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
        const image_data = await file_storageAPI.uploadFile(image);
        data["attachments"] = [image_data.file_id];
      }

      await newsAPI.createNews(data);
      setSuccess(true);

      setTimeout(() => {
        navigate('/news');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Не удалось опубликовать новость');
      // err.response.data.detail.map((one_err) => {
      //   console.log(one_err.msg);
      // })
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <div className="d-flex justify-content-center">
            <h1 className="profile-edit-title">Create News</h1>
          </div>

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              The news has been successfully published!
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
                Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control profile-input"
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
                Text <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="main_text"
                name="main_text"
                rows="5"
                value={formData.main_text}
                onChange={handleChange}
                placeholder="Введите основной текст"
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Photo (optional)
              </label>
              <input
                type="file"
                className="form-control profile-input"
                id="image"
                name="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-center">
                <button
                    type="submit"
                    className="btn btn-primarybtn profile-save-button"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Published...
                        </>
                    ) : (
                        'Publish'
                    )}
                </button>
                <button
                    className="btn btn-danger ms-2"
                    onClick={() => navigate("/profile")}
                    type="button"
                >
                    Cancel
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}