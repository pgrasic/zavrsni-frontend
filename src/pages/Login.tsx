import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/api';
import LoginForm from "../components/Auth/LoginForm";
import "../assets/css/register.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname;

  const handleSuccess = () => {
    const safeFrom = typeof from === 'string' && from !== '/login' && from !== '/register' ? from : null;
    const user = getCurrentUser();

    if (safeFrom) {
      navigate(safeFrom, { replace: true });
      return;
    }

    if (user?.is_admin) {
      navigate('/admin', { replace: true });
      return;
    }

    navigate('/medication', { replace: true });
  };

  return (
    <main aria-label="Login page" className="page page--center">
      <div className="card">
        <h1 className="card__title">Prijava</h1>
        <LoginForm onSuccess={handleSuccess} />

        <div className="auth__alt">
          <span>Novi ste ovdje?</span>
          <a className="link-button" href="/register">
            Registriraj se
          </a>
        </div>
      </div>
    </main>
  );
};

export default Login;
