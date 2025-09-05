import React from "react";
import LoginForm from "../components/Auth/LoginForm";

const Login: React.FC = () => {
  const handleSuccess = () => {
    window.location.href = "/medication";
  };
  return (
    <main aria-label="Login page" style={{ textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '56px', lineHeight: '1.1' }}>Prijava</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '420px', maxWidth: '95%' }}>
          <LoginForm onSuccess={handleSuccess} />
        </div>
      </div>
    </main>
  );
};

export default Login;
