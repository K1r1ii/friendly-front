import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileCard({
  dataToShow,
  otherUserId,
  age,
  isFriend,
  loading,
  handleAddFriend,
  handleRemoveFriend,
  handleDeleteAccount
}) {
  const navigate = useNavigate();

  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [confirmDeleteFriend, setConfirmDeleteFriend] = useState(false);

  const handleDeleteAccountClick = () => {
    if (!confirmDeleteAccount) {
      setConfirmDeleteAccount(true);
    } else {
      handleDeleteAccount();
      setConfirmDeleteAccount(false);
    }
  };

  const handleRemoveFriendClick = () => {
    if (!confirmDeleteFriend) {
      setConfirmDeleteFriend(true);
    } else {
      handleRemoveFriend();
      setConfirmDeleteFriend(false);
    }
  };

  return (
    <div className="card shadow-sm profile-card">
      <div className="card-body profile-card-body">
        <div className="d-flex justify-content-center mb-4">
          <h2 className="card-title text-center mb-0 profile-title">
            {otherUserId ? `Profile ${dataToShow.nickname}` : "My Profile"}
          </h2>
        </div>

        <div className="d-flex align-items-center mb-3">
          <img src="/avatar.png" alt="Avatar" className="profile-avatar" />
          <div className="profile-info-container">
            <h3 className="mb-1 fs-4 profile-info-name">
              {dataToShow.first_name} {dataToShow.last_name}
            </h3>
          </div>
        </div>

        <ul className="list-group list-group-flush profile-list">
          <li className="list-group-item profile-list-item">
            <span className="profile-list-label">Nickname</span>
            <span className="profile-list-value">@{dataToShow.nickname}</span>
          </li>
          <li className="list-group-item profile-list-item">
            <span className="profile-list-label">Sex</span>
            <span className="profile-list-value">{dataToShow.sex}</span>
          </li>
          <li className="list-group-item profile-list-item">
            <span className="profile-list-label">Birthday</span>
            <span className="profile-list-value birthday">
              {new Date(dataToShow.birthday).toLocaleDateString("ru-RU")} ({age} y.o.)
            </span>
          </li>
        </ul>

        <div className="mt-3 d-grid gap-2">
          <button
            className="btn btn-show-friends"
            onClick={() =>
              navigate(!otherUserId ? "/friends" : `/friends?whose_friends_usr_id=${otherUserId}`)
            }
            disabled={loading}
          >
            Show friends
          </button>

          {!otherUserId && (
            <>
              <button className="btn btn-orange" onClick={() => navigate("/profile/edit")}>
                Edit profile
              </button>

              {/* Кнопки удаления аккаунта и отмены без отдельного div */}
              <button
                className={`btn btn-outline-danger delete-transition-btn`}
                onClick={handleDeleteAccountClick}
                disabled={loading}
              >
                {confirmDeleteAccount ? "Confirm Delete" : "Delete account"}
              </button>
              {confirmDeleteAccount && (
                <button
                  className="btn btn-danger delete-btn-cancel"
                  onClick={() => setConfirmDeleteAccount(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </>
          )}

          {otherUserId &&
            (isFriend ? (
              <>
                <button
                  className={`btn btn-outline-danger delete-transition-btn`}
                  onClick={handleRemoveFriendClick}
                  disabled={loading}
                >
                  {confirmDeleteFriend ? "Confirm Delete" : "Delete friend"}
                </button>
                {confirmDeleteFriend && (
                  <button
                    className="btn btn-danger delete-btn-cancel"
                    onClick={() => setConfirmDeleteFriend(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <button className="btn btn-add-friend" onClick={handleAddFriend} disabled={loading}>
                Add friend
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
