import { useEffect, useState } from 'react';
import axios from 'axios';
import FriendItem from '../components/FriendItem';
import { usersAPI } from "../api/users";

function UserFeed() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
      .catch((error) => {
        console.error("Error fetching user feed:", error);
        setError("Failed to load user feed");
      })
      .finally(() => {
        setLoading(false); // обязательно
      });
  }, []);

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 profile-edit-title">Users List</h2>
      <div className="list-group shadow-sm rounded">
        {users.length === 0 ? (
          <p className="text-center text-muted py-3">No users found.</p>
        ) : (
          users.map(user => (
            <FriendItem key={user.id} user={user} />
          ))
        )}
      </div>
    </div>
  );
  
}

export default UserFeed;
