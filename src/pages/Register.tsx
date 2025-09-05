import React from "react";
import RegisterForm from "../components/Auth/RegisterForm";

const Register: React.FC = () => {
  const handleSuccess = () => {
    window.location.href = "/login";
  };
  return (
    <main aria-label="Register page" style={{ textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Registracija</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '420px', maxWidth: '95%' }}>
          <RegisterForm onSuccess={handleSuccess} />
        </div>
      </div>
    </main>
  );
};

export default Register;
