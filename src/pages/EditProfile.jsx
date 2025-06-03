import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../api/axios";
import { profileAPI } from "../api/profile";

export default function EditProfile() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null); // Состояние для ошибки

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birthday: "",
    nickname: "",
    sex: "",
    email: ""
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        birthday: userData.birthday || "",
        nickname: userData.nickname || "",
        sex: userData.sex || "",
        email: userData.email || ""
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.updateProfile(formData);
      window.location.href = "/profile";
    } catch (err) {
        const errorResponse = err.response;

        let errorMessage = "Unknown error!";

        if (errorResponse) {
          console.error("Ошибка от сервера:", errorResponse.data);

          errorMessage = errorResponse.data["detail"][0]["msg"] || errorMessage;
        } else {
          console.error("Ошибка без ответа от сервера:", err.message);
        }

        setError(errorMessage);
    }
  };

  return (
  <div className="container mt-5 mb-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4 text-center">Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          {["first_name", "last_name", "birthday", "nickname", "sex"].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label">
                {field
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </label>
              <input
                className="form-control"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Введите ${field.replace("_", " ")}`}
              />
            </div>
          ))}

          {error && (
            <div className="alert alert-danger mb-4">
              <strong>Error!</strong> {error}
            </div>
          )}

          <div className="d-grid gap-2 d-md-flex justify-content-center">
            <button className="btn btn-success" type="submit">
              Сохранить
            </button>
            <button
              className="btn btn-secondary ms-2"
              onClick={() => navigate("/profile")}
              type="button"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}
