import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="container">
        <div className="row justify-content-center mt-5">
            <div className="col-md-6 col-lg-4">
            <div className="card shadow">
                <div className="card-body">
                <h2 className="card-title text-center mb-4">Вход в систему</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                    />
                    </div>

                    <div className="mb-4">
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <input 
                        type="password" 
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                    </div>

                    <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    >
                    Войти
                    </button>

                    <div className="text-center">
                    <Link to="#!" className="text-decoration-none">Забыли пароль?</Link>
                    </div>
                </form>
                </div>
                
                <div className="card-footer text-center">
                  Нет аккаунта? {' '}
                  <Link to="/registration" className="text-decoration-none">Зарегистрироваться</Link>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
}