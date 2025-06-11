import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { profileAPI } from "../api/profile";
import { usersAPI } from "../api/users";
import calculateAge from "../utils/profile";
import updateSearchParams from "../utils/navigation";
import ProfileCard from "../components/ProfileCard";
import axios from "axios";


export default function Profile() {
  const location = useLocation();
  const { userData, logout } = useAuth(); // Текущий пользователь
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = new URLSearchParams(location.search);
  const paramsId = queryParams.get("other_usr_id");
  const otherUserId = (paramsId === userData.id ? null : paramsId) ;
  const navigate = useNavigate();

  const [otherUserData, setOtherUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  // Если указан другой пользователь — загружаем его
  useEffect(() => {
    const fetchOtherUser = async () => {
      setSearchParams(updateSearchParams({
          other_usr_id: otherUserId
      }, userData.id), { replace: true });

      if (otherUserId) {
        setLoading(true);
        try {
          const data = await profileAPI.getUserProfile(otherUserId);
          const userIsFriend = await usersAPI.isUserFriend(otherUserId);
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
        await usersAPI.addFriend(otherUserId);
      } catch (error) {
        console.error("Ошибка при добавлении в друзья:", error);
      } finally {
      }
    };

    const handleRemoveFriend = async () => {
      try {
        await usersAPI.removeFriend(otherUserId);
        setIsFriend(false);
      } catch (error) {
        console.error("Ошибка при удалении из друзей:", error);
      } finally {
      }
    };

//     const handleBanUser = async () => {
//       try {
//         setLoading(true);
//         await usersAPI.banUser(otherUserId);
//         setIsFriend(false);
//       } catch (error) {
//         console.error("Ошибка при бане пользователя:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

    if (!dataToShow || loading) {
        return (
          <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Загрузка профиля...</p>
          </div>
        );
    }

    const age = calculateAge(dataToShow.birthday);

return (
  <div className="container mb-5">
    <div className="row justify-content-center mt-5">
      <div className="col-md-7 col-lg-7">
        <ProfileCard
          dataToShow={dataToShow}
          otherUserId={otherUserId}
          age={age}
          isFriend={isFriend}
          loading={loading}
          handleAddFriend={handleAddFriend}
          handleRemoveFriend={handleRemoveFriend}
//           handleBanUser={handleBanUser}
          handleDeleteAccount={handleDeleteAccount}
        />
      </div>
    </div>
  </div>
);
};
