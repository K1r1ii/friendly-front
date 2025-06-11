import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileAPI } from "../api/profile";
import EditProfileForm from "../components/EditProfileForm";

export default function EditProfile() {
  const { userData, updateUserData, fetchUserData } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birthday: "",
    nickname: "",
    sex: "",
    email: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        birthday: userData.birthday || "",
        nickname: userData.nickname || "",
        sex: userData.sex || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileAPI.updateProfile(formData);
      await fetchUserData();
      navigate("/profile");
    } catch (err) {
      const errorResponse = err.response;
      let errorMessage = "Unknown error!";
      if (errorResponse) {
        console.error("Ошибка от сервера:", errorResponse.data);
        errorMessage = errorResponse.data?.detail?.[0]?.msg || errorMessage;
      } else {
        console.error("Ошибка без ответа от сервера:", err.message);
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="container profile-form-wrapper">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="profile-edit-title">Edit Profile</h2>
          <EditProfileForm
            formData={formData}
            error={error}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/profile")}
          />
        </div>
      </div>
    </div>
  );
}
