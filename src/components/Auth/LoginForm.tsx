import React, { useState } from "react";
import { login } from "../../utils/api";

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const LoginForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);

  const validate = (state?: { email: string; password: string }) => {
    const v = state ?? { email, password };
    const e: { email?: string; password?: string } = {};
    if (!v.email.trim()) e.email = "Unesite email adresu.";
    else if (!emailRegex.test(v.email)) e.email = "Unesite ispravan email.";
    if (!v.password.trim()) e.password = "Unesite lozinku.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const eMap = validate();
    setErrors(eMap);
    setTouched({ email: true, password: true });
    if (Object.keys(eMap).length > 0) return;

    setLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setServerError(msg || "Prijava nije uspjela. Provjerite svoje podatke.");
    } finally {
      setLoading(false);
    }
  };

  const onBlurField = (field: "email" | "password") => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Login form"
      className="form"
      noValidate
    >
      <div className="form__row">
        <label htmlFor="email" className="form__label">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            const val = e.target.value;
            setEmail(val);
            if (touched.email) setErrors(validate({ email: val, password }));
          }}
          onBlur={() => onBlurField("email")}
          required
          autoComplete="username"
          aria-required="true"
          aria-invalid={Boolean(touched.email && errors.email)}
          aria-describedby={
            touched.email && errors.email ? "email-error" : undefined
          }
          className={`form__input ${
            touched.email && errors.email ? "form__input--invalid" : ""
          }`}
          placeholder="primjer@domena.com"
          inputMode="email"
        />
        {touched.email && errors.email && (
          <small id="email-error" className="form__error-inline">
            {errors.email}
          </small>
        )}
      </div>

      <div className="form__row">
        <label htmlFor="password" className="form__label">
          Lozinka
        </label>
        <div className="form__input-wrap">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              if (touched.password)
                setErrors(validate({ email, password: val }));
            }}
            onBlur={() => onBlurField("password")}
            required
            autoComplete="current-password"
            aria-required="true"
            aria-invalid={Boolean(touched.password && errors.password)}
            aria-describedby={
              touched.password && errors.password ? "password-error" : undefined
            }
            className={`form__input form__input--with-button ${
              touched.password && errors.password ? "form__input--invalid" : ""
            }`}
            placeholder="Unesite lozinku"
          />
          <button
            type="button"
            className="icon-button"
            aria-label={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Sakrij" : "Prikaži"}
          </button>
        </div>
        {touched.password && errors.password && (
          <small id="password-error" className="form__error-inline">
            {errors.password}
          </small>
        )}
      </div>

      {serverError && (
        <div role="alert" aria-live="assertive" className="form__error">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="button button--primary button--lg"
      >
        {loading ? "Prijava u tijeku..." : "Prijava"}
      </button>
    </form>
  );
};

export default LoginForm;
