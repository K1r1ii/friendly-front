import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { userData, user, logout } = useAuth();
  console.log(userData);
  console.log(user)
  return (
    <div>
      <h1>Welcome, {userData.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}