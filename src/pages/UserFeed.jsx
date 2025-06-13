import { useEffect, useState } from 'react';
import axios from 'axios';
import UserItem from '../components/UserItem';
import { usersAPI } from "../api/users";
import { useAuth } from "../context/AuthContext";
import { useError } from "../context/ErrorContext";
import handleApiErrors from "../utils/handleApiErrors";

function UserFeed() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const [friendIds, setFriendIds] = useState(new Set());
  const { setErrorCode, setErrorMessage } = useError();

  useEffect(() => {
    usersAPI.getUserFeedList()
    .then((usersList) => {
    if (Array.isArray(usersList)) {
        setUsers(usersList);
    } else {
        console.error("Invalid user data:", usersList);
        setError("Invalid response format");
    }
  })
      .catch((err) => {
        handleApiError(err, setErrorCode, setErrorMessage);
      })
      .finally(() => {
        setLoading(false); // обязательно
      });
  }, []);

  const handleAddFriend = async (userId) => {
    try {
      await usersAPI.addFriend(userId);
    } catch (error) {
      console.error("Ошибка при добавлении в друзья:", error);
    } finally {
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (users.length === 1) {
    return (
          <div className="card shadow text-center py-5">
            <div className="card-body">
              <i className="bi bi-inbox display-1 text-muted mb-4" />
              <h3 className="card-title">No Users</h3>
              <p className="card-text">You are alone...</p>
            </div>
          </div>
        );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 profile-edit-title">Users List</h2>
      <div className="list-group">
      {users
        .filter(user => user.id !== userData.id)
        .map(user => (
              <UserItem
                key={user.id}
                id={user.id}
                user={user}
                onAdd={() => handleAddFriend(user.id)}
              />
            ))}
      </div>
    </div>
  );
  
}

export default UserFeed;
