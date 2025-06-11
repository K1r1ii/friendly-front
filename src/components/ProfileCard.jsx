import { useNavigate } from "react-router-dom";

export default function ProfileCard({
  dataToShow,
  otherUserId,
  age,
  isFriend,
  loading,
  handleAddFriend,
  handleRemoveFriend,
//   handleBanUser,
  handleDeleteAccount
}) {
  const navigate = useNavigate();

  return (
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
            src="/avatar.png"
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
            <span className="profile-list-label">Sex</span>
            <span className="profile-list-value">
                {dataToShow.sex}
            </span>
          </li>
          <li className="list-group-item profile-list-item">
            <span className="profile-list-label">Birthday</span>
            <span className="profile-list-value birthday">
              {new Date(dataToShow.birthday).toLocaleDateString("ru-RU")} ({age} y.o.)
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
            <button
                className="btn btn-show-friends"
                onClick={() => navigate(`/friends?whose_friends_usr_id=${otherUserId}`)}
                disabled={loading}
            >
                Show friends
            </button>
            {!isFriend ? (
              <button
                className="btn btn-add-friend"
                onClick={handleAddFriend}
                disabled={loading}
              >
                Add friend
              </button>
            ) : (
              <button
                className="btn btn-outline-danger"
                onClick={handleRemoveFriend}
                disabled={loading}
              >
                Delete friend
              </button>
            )}

{/*             <button */}
{/*               className="btn btn-outline-orange" */}
{/*               onClick={handleBanUser} */}
{/*               disabled={loading} */}
{/*             > */}
{/*               Ban user */}
{/*             </button> */}
          </div>
        )}
      </div>
    </div>
  );
}
