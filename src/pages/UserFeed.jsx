import { useEffect, useState } from 'react';
import axios from 'axios';
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
      <h2 className="text-center mb-4">User Feed</h2>
      <div className="list-group">
        {users.map(user => (
          <div key={user.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
            <div>
              <h5>{user.first_name} {user.last_name} <small className="text-muted">({user.nickname})</small></h5>
              <p className="mb-1">
                <strong>Birthday:</strong> {user.birthday}<br />
                <strong>Sex:</strong> {user.sex}<br />
                <strong>Email:</strong> {user.email}
              </p>
            </div>
            {user.is_admin && <span className="badge bg-primary">Admin</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserFeed;
