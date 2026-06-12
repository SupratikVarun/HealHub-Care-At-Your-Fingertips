import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await login(phone.trim(), password);
      navigate(result.user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="form-page">
        <div className="form-card">
          <h2>Login to HealHub</h2>
          <p>Enter your phone number and password to login.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter phone number"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {error && <p className="form-error">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default Login;
