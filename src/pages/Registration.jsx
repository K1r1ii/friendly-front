import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // состояние успеха
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ email, password });
      setSuccess(true); // показываем сообщение об успехе
      setTimeout(() => {
        navigate("/login"); // через 2 секунды редирект на главную
      }, 2000);
    } catch (err) {
      if (err?.response?.status === 422) {
        const errorMessage = err.response.data.detail[0].msg;
        setError(errorMessage);
      } else if (err?.response?.status === 409) {
        const errorMessage = err.response.data.detail;
        setError(errorMessage);
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow mb-4">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Registration</h2>

              {error && (
                <div className="alert alert-danger mb-4">
                  <strong>Error!</strong> {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success mb-4">
                  Register successful! Now you will be redirect...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    disabled={success} // блокируем поля при успехе, чтобы не было редактирования
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={success}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={success} // блокируем кнопку при успехе
                >
                  Register
                </button>
              </form>
            </div>

            <div className="card-footer text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
