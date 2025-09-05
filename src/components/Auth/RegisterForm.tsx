import React, { useState } from "react";
import { register } from "../../utils/api";

const RegisterForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Lozinke se ne podudaraju.");
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password, surname });
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Registracija nije uspjela. Pokušajte ponovno.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Register form">
      <div>
        <label htmlFor="name">Ime</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="surname">Prezime</label>
        <input
          id="surname"
          type="text"
          value={surname}
          onChange={e => setSurname(e.target.value)}
          required
          aria-required="true"
        />
      </div>
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
          autoComplete="new-password"
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="confirm">Potvrda lozinke</label>
        <input
          id="confirm"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          aria-required="true"
        />
      </div>
      <button type="submit" disabled={loading} style={{ fontSize: "1.2rem", padding: "0.75rem" }}>
        {loading ? "Registracija u tijeku..." : "Registriraj se"}
      </button>
      {error && <div role="alert" aria-live="assertive" style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default RegisterForm;
