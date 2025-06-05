import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { profileAPI } from "../api/profile";
import { usersAPI } from "../api/users";
import axios from "axios";


export default function Profile() {
  const location = useLocation();
  const { userData, logout } = useAuth(); // Текущий пользователь
  const queryParams = new URLSearchParams(location.search);
  const otherUsrId = queryParams.get("other_usr_id");
  const otherUserId = (otherUsrId === userData.id ? null : otherUsrId) ;
  const navigate = useNavigate();

  const [otherUserData, setOtherUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  const isUserFriend = async (otherUserId) => {
    let limit = 49;
    let i = 0;
    let friends = await usersAPI.getMyFriends(i, limit+1);
    let friendsArray = Object.values(friends);
    let res = friendsArray.some(friend => friend.friend_id === otherUserId);

    while (friendsArray.length > limit && !res){
        i++;
        friends = await usersAPI.getMyFriends(i, limit+1);
        friendsArray = Object.values(friends);
        res = friendsArray.some(friend => friend.friend_id === otherUserId);
    }
    return res;
  };

  // Если указан другой пользователь — загружаем его
  useEffect(() => {
    const fetchOtherUser = async () => {
      if (otherUserId) {
        setLoading(true);
        try {
          const data  = await profileAPI.getUserProfile(otherUserId);
          const userIsFriend = await isUserFriend(otherUserId);
          setIsFriend(userIsFriend);
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

  const handleAddFriend = async () => {
      try {
        setLoading(true);
        await usersAPI.addFriend(otherUserId);
      } catch (error) {
        console.error("Ошибка при добавлении в друзья:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleRemoveFriend = async () => {
      try {
        setLoading(true);
        await usersAPI.removeFriend(otherUserId);
        setIsFriend(false);
      } catch (error) {
        console.error("Ошибка при удалении из друзей:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleBanUser = async () => {
      try {
        setLoading(true);
        await usersAPI.banUser(otherUserId);
        setIsFriend(false);
      } catch (error) {
        console.error("Ошибка при бане пользователя:", error);
      } finally {
        setLoading(false);
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

              {/* Аватар и имя */}
              <div className="d-flex align-items-center mb-3">
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

              {/* Основная информация */}
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

              {/* Кнопки */}
              {!otherUserId && (
                <div className="mt-3 d-grid gap-2">
                  <button
                    className="btn btn-orange"
                    onClick={() => navigate("/profile/edit")}
                  >
                    Edit profile
                  </button>
                  <button className="btn btn-outline-danger" onClick={handleDeleteAccount}>
                    Delete account
                  </button>
                </div>
              )}

              {otherUserId && (
                <div className="mt-4 d-grid gap-2">
                  {!isFriend ? (
                    <button
                      className="btn btn-add-friend"
                      onClick={handleAddFriend}
                      disabled={loading}
                    >
                      Добавить в друзья
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-danger"
                      onClick={handleRemoveFriend}
                      disabled={loading}
                    >
                      Удалить из друзей
                    </button>
                  )}

                  <button
                    className="btn btn-outline-orange"
                    onClick={handleBanUser}
                    disabled={loading}
                  >
                    Забанить пользователя
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
