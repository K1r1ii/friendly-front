import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { profileAPI } from "../api/profile"
import axios from "axios";


export default function Profile() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const otherUserId = queryParams.get("other_usr_id");
  const navigate = useNavigate();

  const { userData, logout } = useAuth(); // Текущий пользователь
  const [otherUserData, setOtherUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Если указан другой пользователь — загружаем его
  useEffect(() => {
    const fetchOtherUser = async () => {
      if (otherUserId) {
        setLoading(true);
        try {
          const data  = await profileAPI.getUserProfile(otherUserId);
          setOtherUserData(data);
        } catch (error) {
          console.error("Ошибка при получении профиля другого пользователя:", error);
          setOtherUserData(null);
        } finally {
          setLoading(false);
        }
      }

    };

    fetchOtherUser();
  }, [otherUserId]);

  const dataToShow = otherUserId ? otherUserData : userData;

  if (!dataToShow || loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  // Функция для вычисления возраста
  function calculateAge(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  function getYearWord(age) {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return "лет";
    }

    if (lastDigit === 1) {
      return "год";
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return "года";
    }

    return "лет";
  }

  const age = calculateAge(dataToShow.birthday);

  const handleDeleteAccount = async () => {
    try {
      await profileAPI.deleteProfile();
      logout();
    } catch (err) {
      console.error("Ошибка при удалении аккаунта:", err);
      }
  };

return (
  <div className="container mb-5">
    <div className="row justify-content-center mt-5">
      <div className="col-md-7 col-lg-7">
        <div className="card shadow-sm profile-card">
          <div className="card-body profile-card-body">
            {/* Заголовок */}
            <div className="d-flex justify-content-center mb-4">
              <h2 className="card-title text-center mb-0 profile-title">
                {otherUserId ? `Profile ${dataToShow.nickname}` : "My Profile"}
              </h2>
            </div>

            {/* Аватар и информация */}
            <div className="d-flex align-items-center mb-3" style={{ marginBottom: "1.5rem" }}>
              <img
                src={dataToShow.avatar || "/avatar.png"}
                alt="Avatar"
                className="profile-avatar"
              />
              <div className="profile-info-container">
                <h3 className="mb-1 fs-4 profile-info-name">
                  {dataToShow.first_name} {dataToShow.last_name}
                </h3>
              </div>
            </div>

            {/* Информация */}
            <ul className="list-group list-group-flush profile-list">
              <li className="list-group-item profile-list-item">
                <span className="profile-list-label">Nickname</span>
                <span className="profile-list-value">@{dataToShow.nickname}</span>
              </li>
              <li className="list-group-item profile-list-item">
                <span className="profile-list-label">Birthday</span>
                <span className="profile-list-value birthday">
                  {new Date(dataToShow.birthday).toLocaleDateString("ru-RU")} (
                  {age} {getYearWord(age)})
                </span>
              </li>
            </ul>

            {/* Кнопки для редактирования и удаления */}
            {!otherUserId && (
              <div className="mt-3 d-grid gap-2">
                <button
                  className="btn btn-warning"
                  onClick={() => navigate("/profile/edit")}
                >
                  Edit profile
                </button>
                <button className="btn btn-danger" onClick={handleDeleteAccount}>
                  Delete account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
