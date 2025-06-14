import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
       if (err?.response?.status === 422){
          const errorMessage = err.response.data.detail[0].msg;
          setError(errorMessage);
       }

       if (err?.response?.status === 401){
           const errorMessage = err.response.data.detail;
           setError(errorMessage);
       }
    }
  };

  return (
    <div className="container">
        <div className="row justify-content-center mt-5">
            <div className="col-md-6 col-lg-4">
            <div className="card shadow mb-4">
                <div className="card-body">
                <h2 className="card-title text-center mb-4">Log in</h2>

                {error && (
                    <div className="alert alert-danger mb-4">
                      <strong>Error!</strong> {error}
                    </div>
                )}
                
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
                    <label htmlFor="password" className="form-label">Password</label>
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
                    Log in
                    </button>

{/*                     <div className="text-center"> */}
{/*                     <Link to="#!" className="text-decoration-none">Забыли пароль?</Link> */}
{/*                     </div> */}
                </form>
                </div>
                
                <div className="card-footer text-center">
                  New to Friendly? {' '}
                  <Link to="/registration" className="text-decoration-none">Register</Link>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
}