import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) navigate("/login");
  }, [userData]);

  return userData ? children : null;
};