import React from "react";
import { Link } from "react-router-dom";
import { usersAPI } from "../api/users";

// Удаление из друзей
const onRemove = async (userId) => {
  try {
    await usersAPI.removeFriend(userId);
    window.location.reload();
  } catch (err) {
    console.error("Ошибка при удалении из друзей:", err);
  }
};

// Принятие заявки в друзья
const onAccept = async (userId) => {
  try {
    await usersAPI.acceptFriend(userId);
    window.location.reload();
  } catch (err) {
    console.error("Ошибка при принятии заявки:", err);
  }
};

export default function FriendItem({ user, tab }) {
  return (
    <div className="card mb-3 friend-card text-white border-0 friend-card">
      <div className="card-body d-flex align-items-center position-relative overflow-hidden">
        <img
          src="/avatar.png"
          alt="Аватар"
          className="rounded-circle me-3"
          width="64"
          height="64"
        />
        <div>
          <h5 className="mb-1">
            <Link
              to={`/profile?other_usr_id=${tab ? (tab === "requests" ? user.sender_id : user.friend_id) : user.id}`}
              className="text-decoration-none friend-name"
            >
              {user.first_name} {user.last_name || ""}
            </Link>
          </h5>
          <p className="mb-0 text-muted">@{user.nickname}</p>
        </div>

        {/* Панель действия */}
        <div className="remove-panel">
          {tab === "friends" && (
            <button
              className="btn btn-sm remove-btn"
              onClick={() => onRemove(user.friend_id)}
              title="Удалить из друзей"
            >
              ×
            </button>
          )}

          {tab === "requests" && (
            <button
              className="btn btn-sm accept-btn"
              onClick={() => onAccept(user.sender_id)}
              title="Принять в друзья"
            >
              ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
