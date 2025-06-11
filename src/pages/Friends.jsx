import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usersAPI } from "../api/users";
import UserItem from "../components/UserItem";
import { useAuth } from "../context/AuthContext";
import FriendsTabs from "../components/FriendsTabs";
import UserListWithPagination from "../components/UserListWithPagination";
import updateSearchParams from "../utils/navigation";

export default function Friends() {
  const { userData } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const paramsUserId = searchParams.get("whose_friends_usr_id")
  const whose_friends_usr_id = paramsUserId === userData.id ? null : paramsUserId;
  const tab = searchParams.get("tab") || "friends";
  const LIMIT = 2;
  const offset = parseInt(searchParams.get("offset") || "0", 10) * LIMIT;

  const handleEmptyPage = async (getCountFn) => {
      const totalCount = await getCountFn();
      const newOffset = Math.max(Math.ceil(totalCount / LIMIT) - 1, 0);
      setSearchParams(updateSearchParams({
        whose_friends_usr_id,
        offset: newOffset,
        tab,
      }, userData.id));
      return true;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        setSearchParams(updateSearchParams({
            whose_friends_usr_id,
            offset,
            tab,
          }, userData.id), { replace: true });

        if (tab === "friends") {
          const response = !whose_friends_usr_id
            ? await usersAPI.getMyFriends(offset, LIMIT + 1)
            : await usersAPI.getUserFriends(whose_friends_usr_id, offset, LIMIT + 1);

          if (offset > 0 && response.length === 0) {
            const redirected = await handleEmptyPage(() =>
              usersAPI.countUserFriends(whose_friends_usr_id || userData.id)
            );
            if (redirected) return;
          }

          setFriends(response.slice(0, LIMIT));
          setHasMore(response.length > LIMIT);

        } else if (tab === "requests") {
          const response = await usersAPI.getFriendRequests(offset, LIMIT + 1);

          if (offset > 0 && response.length === 0) {
            const redirected = await handleEmptyPage(() =>
              usersAPI.countRequestsFriend()
            );
            if (redirected) return;
          }

          setRequests(response.slice(0, LIMIT));
          setHasMore(response.length > LIMIT);
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


const fetchNextUser = async (listType) => {
  try {
    const currentList = listType === "friends" ? friends : requests;
    const nextOffset = currentList.length - 1;

    let response = null;
    let nextCheck = null;

    console.log(currentList, nextOffset);

    if (listType === "friends") {
      response = await usersAPI.getMyFriends(nextOffset, 1);
      nextCheck = await usersAPI.getMyFriends(nextOffset + 1, 1);
    } else {
      response = await usersAPI.getFriendRequests(nextOffset, 1);
      nextCheck = await usersAPI.getFriendRequests(nextOffset + 1, 1);
    }

    console.log(response, nextCheck);

    if (response.length === 1) {
      if (listType === "friends") {
        setFriends(prev => [...prev, response[0]]);
      } else {
        setRequests(prev => [...prev, response[0]]);
      }
    }

    setHasMore(nextCheck.length > 0);

  } catch (err) {
    console.error("Ошибка при подгрузке следующего пользователя:", err);
  }
};

const handleRemove = async (userId) => {
  try {
    await usersAPI.removeFriend(userId);
    const friends_length = friends.length;
    setFriends(prev => prev.filter(user => user.friend_id !== userId));

    if (hasMore) {
      await fetchNextUser("friends");
    }
    else if (friends_length === 1){
        setSearchParams(updateSearchParams({
            whose_friends_usr_id,
            offset: Math.max(Math.ceil(offset/LIMIT)-1, 0),
            tab,
        }));
    }

  } catch (err) {
    console.error("Ошибка при удалении из друзей:", err);
  }
};

const handleAccept = async (userId) => {
  try {
    await usersAPI.acceptFriend(userId);
    setRequests(prev => prev.filter(user => user.sender_id !== userId));
    const requests_length = requests.length;

    if (hasMore) {
      await fetchNextUser("requests");
    }
    else if (requests === 1){
        setSearchParams(updateSearchParams({
            whose_friends_usr_id,
            offset: Math.max(offset-1, 0),
            tab,
        }));
    }
  } catch (err) {
    console.error("Ошибка при принятии заявки в друзья:", err);
  }
};


if (error) {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2" />
            {error}
          </div>
        </div>
      </div>
    </div>
  );
}

if (loading) {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3">Загрузка...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Основной return — если нет ошибки и загрузки
return (
  <div className="container mt-4">
    <div className="row justify-content-center">
      <div className="col-lg-10">
        {/* Навигация */}
        {!whose_friends_usr_id && (
          <FriendsTabs currentTab={tab} />
        )}

        <h2 className="mb-4 text-center profile-edit-title">
          {!whose_friends_usr_id
            ? tab === "requests"
              ? "Friend Requests"
              : "My Friends"
            : "Friends"}
        </h2>

        <UserListWithPagination
          key={tab}
          users={(tab === "friends" || whose_friends_usr_id) ? friends : requests}
          offset={offset}
          hasMore={hasMore}
          tab={!whose_friends_usr_id ? tab : null}
          emptyIcon={(tab === "friends" || whose_friends_usr_id) ? "bi bi-person-x" : "bi bi-inbox"}
          emptyTitle={(tab === "friends" || whose_friends_usr_id) ? "No Friends" : "No Requests"}
          emptyText={!whose_friends_usr_id ? (tab === "friends"
            ? "Add someone as a friend"
            : "No one wants to be friends with you 😢") : ""}
          keyProp={((tab === "friends") || (whose_friends_usr_id)) ? ("friend_id") : (tab ? "sender_id" : "id")}
          LIMIT={LIMIT}
          onRemove={handleRemove}
          onAccept={handleAccept}
        />
      </div>
    </div>
  </div>
);
}
