import React, { useState } from "react";
import { login } from "../../utils/api";
import { Link } from 'react-router-dom';

const LoginForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Prijava nije uspjela. Provjerite svoje podatke.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Login form">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="username"
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="password">Lozinka</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          aria-required="true"
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button type="submit" disabled={loading} style={{ fontSize: "1.6rem", padding: "1rem 2rem" }}>
          {loading ? "Prijava u tijeku..." : "Prijava"}
        </button>
      </div>
      {error && (
        <div role="alert" aria-live="assertive" style={{ color: "red" }} tabIndex={-1}>
          {error}
        </div>
      )}
  {/* register link removed per UI decision */}
    </form>
  );
};

export default LoginForm;
