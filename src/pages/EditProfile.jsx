import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../context/ErrorContext";
import { profileAPI } from "../api/profile";
import EditProfileForm from "../components/EditProfileForm";
import handleApiErrors from "../utils/handleApiErrors";

export default function EditProfile() {
  const { userData, updateUserData, fetchUserData } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { setErrorCode, setErrorMessage } = useError();

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
    setError(null);
    try {
      await profileAPI.updateProfile(formData);
      await fetchUserData();
      setSuccess("Profile updated successfully! Redirecting...");

      setTimeout(() => {
        navigate("/profile");
      }, 1300);
    } catch (err) {
      setSuccess(null);
      if (err?.response?.status === 422) {
        const errorMessage = err.response.data.detail[0].msg;
        setError(errorMessage);
      } else {
        handleApiErrors(err, setErrorCode, setErrorMessage, false);
      }
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
            success={success}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/profile")}
            disabled={success} // можно добавить проп для блокировки формы, если надо
          />
        </div>
      </div>
    </div>
  );
}
