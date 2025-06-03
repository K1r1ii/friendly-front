import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import axios from "axios";

export default function Profile() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const otherUserId = queryParams.get("other_usr_id");
  const navigate = useNavigate();

  const { userData } = useAuth(); // Текущий пользователь
  const [otherUserData, setOtherUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Если указан другой пользователь — загружаем его
  useEffect(() => {
    const fetchOtherUser = async () => {
      if (otherUserId) {
        setLoading(true);
        try {
          const { data } = await api.get(`/profile/get_information?other_usr_id=${otherUserId}`);
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

  return (
    <div className="container mb-5">
      <div className="row justify-content-center mt-5">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                {otherUserId ? `Profile ${dataToShow.nickname}` : "Your Profile"}
              </h2>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Имя:</strong> {dataToShow.first_name}
                </li>
                <li className="list-group-item">
                  <strong>Фамилия:</strong> {dataToShow.last_name}
                </li>
                <li className="list-group-item">
                  <strong>Никнейм:</strong> {dataToShow.nickname}
                </li>
                <li className="list-group-item">
                  <strong>Дата рождения:</strong> {dataToShow.birthday}
                </li>
                <li className="list-group-item">
                  <strong>Пол:</strong> {dataToShow.sex === "Male" ? "Мужской" : "Женский"}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {dataToShow.email}
                </li>
              </ul>
              {!otherUserId && (
                <button className="btn btn-warning mt-3" onClick={() => navigate("/profile/edit")}>
                  Редактировать
                </button>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
