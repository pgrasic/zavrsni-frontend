import React from "react";
import RegisterForm from "../components/Auth/RegisterForm";
import "../assets/css/register.css";

const Register: React.FC = () => {
  const handleSuccess = () => {
    window.location.href = "/login";
  };
  return (
    <main aria-label="Register page" className="page page--center">
      <div className="card">
        <h1 className="card__title">Registracija</h1>
        <RegisterForm onSuccess={handleSuccess} />

        <div className="auth__alt">
          <span>Već imate račun?</span>
          <a className="link-button" href="/login">
            Prijavite se
          </a>
        </div>
      </div>
    </main>
  );
};

export default Register;
