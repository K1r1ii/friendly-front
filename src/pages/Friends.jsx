import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usersAPI } from "../api/users";
import FriendItem from "../components/FriendItem";
import { useAuth } from "../context/AuthContext";

export default function Friends() {
  const { userData } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const whose_friends_usr_id = searchParams.get("whose_friends_usr_id") || userData.id;
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const tab = searchParams.get("tab") || "friends";
  const LIMIT = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (tab === "friends") {
          const response = userData.id == whose_friends_usr_id
            ? await usersAPI.getMyFriends(offset, LIMIT + 1)
            : await usersAPI.getUserFriends(whose_friends_usr_id, offset, LIMIT + 1);
          setFriends(response.slice(0, LIMIT));
          setHasMore(response.length > LIMIT);
        } else if (tab === "requests") {
          const response = await usersAPI.getFriendRequests();
          setRequests(response);
        }
      } catch (err) {
        setError(err.message || "Ошибка загрузки");
        console.error("Ошибка:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tab, whose_friends_usr_id, offset]);

  const changePage = (direction) => {
    const newOffset = Math.max(offset + direction, 0);
    setSearchParams({
      whose_friends_usr_id,
      offset: newOffset,
      tab,
    });
  };

  const switchTab = (newTab) => {
    setSearchParams({
      tab: newTab,
    });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Навигация */}
          {userData.id == whose_friends_usr_id && (
            <div className="friends-tabs-wrapper">
              <div className="friends-tabs-panel">
                <div className="friends-tabs">
                  <div
                    className={`tab-button ${tab === "friends" ? "active" : ""}`}
                    onClick={() => switchTab("friends")}
                  >
                    Мои друзья
                  </div>
                  <div
                    className={`tab-button ${tab === "requests" ? "active" : ""}`}
                    onClick={() => switchTab("requests")}
                  >
                    Заявки в друзья
                  </div>
                </div>
              </div>
            </div>
          )}

          <h2 className="mb-4 text-center profile-edit-title">
            {userData.id === whose_friends_usr_id
              ? tab === "requests"
                ? "Заявки в друзья"
                : "Мои друзья"
              : "Friends"}
          </h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-3">Загрузка...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2" />
              {error}
            </div>
          ) : tab === "friends" ? (
            friends.length === 0 ? (
              <div className="card shadow text-center py-5">
                <div className="card-body">
                  <i className="bi bi-person-x display-1 text-muted mb-4" />
                  <h3 className="card-title">Друзей нет</h3>
                  <p className="card-text">Добавьте кого-нибудь в друзья</p>
                </div>
              </div>
            ) : (
              <>
                {friends.map((friend) => (
                  <FriendItem key={friend.friend_id} user={friend} tab={tab} />
                ))}
                <div className="d-flex justify-content-between align-items-center mt-4 mb-5">
                  {offset > 0 && (
                    <button className="pagination-btn" onClick={() => changePage(-1)}>
                      ← Назад
                    </button>
                  )}
                  <div className="flex-grow-1" />
                  {hasMore && (
                    <button className="pagination-btn" onClick={() => changePage(1)}>
                      Вперед →
                    </button>
                  )}
                </div>
              </>
            )
          ) : (
            <>
              {requests.length === 0 ? (
                <div className="card shadow text-center py-5">
                  <div className="card-body">
                    <i className="bi bi-inbox display-1 text-muted mb-4" />
                    <h3 className="card-title">Нет заявок</h3>
                    <p className="card-text">Никто не хочет дружить с тобой 😢</p>
                  </div>
                </div>
              ) : (
                <>
                  {requests.map((request) => (
                    <FriendItem key={request.sender_id} user={request} tab={tab} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
