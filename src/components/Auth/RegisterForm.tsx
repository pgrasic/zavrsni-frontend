import React, { useState } from "react";
import { register } from "../../utils/api";

type Errors = Partial<{
  name: string;
  surname: string;
  email: string;
  password: string;
  confirm: string;
}>;

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const RegisterForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Errors>({});

  const markTouched = (field: keyof Errors) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const validate = (state?: {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirm: string;
  }): Errors => {
    const v = state ?? { name, surname, email, password, confirm };
    const e: Errors = {};
    if (!v.name.trim() || v.name.trim().length < 2)
      e.name = "Unesite ime (min. 2 znaka).";
    if (!v.surname.trim() || v.surname.trim().length < 2)
      e.surname = "Unesite prezime (min. 2 znaka).";
    if (!v.email.trim()) e.email = "Unesite email adresu.";
    else if (!emailRegex.test(v.email)) e.email = "Unesite ispravan email.";
    if (!v.password) e.password = "Unesite lozinku.";
    else if (v.password.length < 8)
      e.password = "Lozinka mora imati najmanje 8 znakova.";
    if (!v.confirm) e.confirm = "Ponovno unesite lozinku.";
    else if (v.confirm !== v.password) e.confirm = "Lozinke se ne podudaraju.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const eMap = validate();
    setErrors(eMap);
    // mark all fields touched so borders appear
    setTouched({
      name: true,
      surname: true,
      email: true,
      password: true,
      confirm: true,
    });
    if (Object.keys(eMap).length > 0) return;

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

  const onBlurField = (field: keyof Errors) => {
    markTouched(field);
    setErrors(validate());
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Register form"
      className="form"
      noValidate
    >
      <div className="form__row">
        <label htmlFor="name" className="form__label">
          Ime
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (touched.name)
              setErrors(
                validate({
                  name: e.target.value,
                  surname,
                  email,
                  password,
                  confirm,
                })
              );
          }}
          onBlur={() => onBlurField("name")}
          required
          aria-required="true"
          aria-invalid={Boolean(touched.name && errors.name)}
          aria-describedby={
            touched.name && errors.name ? "name-error" : undefined
          }
          className={`form__input ${
            touched.name && errors.name ? "form__input--invalid" : ""
          }`}
          placeholder="Unesite ime"
          inputMode="text"
          autoComplete="given-name"
        />
        {touched.name && errors.name && (
          <small id="name-error" className="form__error-inline">
            {errors.name}
          </small>
        )}
      </div>

      <div className="form__row">
        <label htmlFor="surname" className="form__label">
          Prezime
        </label>
        <input
          id="surname"
          type="text"
          value={surname}
          onChange={(e) => {
            setSurname(e.target.value);
            if (touched.surname)
              setErrors(
                validate({
                  name,
                  surname: e.target.value,
                  email,
                  password,
                  confirm,
                })
              );
          }}
          onBlur={() => onBlurField("surname")}
          required
          aria-required="true"
          aria-invalid={Boolean(touched.surname && errors.surname)}
          aria-describedby={
            touched.surname && errors.surname ? "surname-error" : undefined
          }
          className={`form__input ${
            touched.surname && errors.surname ? "form__input--invalid" : ""
          }`}
          placeholder="Unesite prezime"
          inputMode="text"
          autoComplete="family-name"
        />
        {touched.surname && errors.surname && (
          <small id="surname-error" className="form__error-inline">
            {errors.surname}
          </small>
        )}
      </div>

      <div className="form__row">
        <label htmlFor="email" className="form__label">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (touched.email)
              setErrors(
                validate({
                  name,
                  surname,
                  email: e.target.value,
                  password,
                  confirm,
                })
              );
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
              setPassword(e.target.value);
              if (touched.password)
                setErrors(
                  validate({
                    name,
                    surname,
                    email,
                    password: e.target.value,
                    confirm,
                  })
                );
            }}
            onBlur={() => onBlurField("password")}
            required
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={Boolean(touched.password && errors.password)}
            aria-describedby={
              touched.password && errors.password
                ? "password-error"
                : "password-hint"
            }
            className={`form__input form__input--with-button ${
              touched.password && errors.password ? "form__input--invalid" : ""
            }`}
            placeholder="••••••••"
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
        <small id="password-hint" className="form__hint">
          Minimalno 8 znakova. Koristite slova i brojeve.
        </small>
        {touched.password && errors.password && (
          <small id="password-error" className="form__error-inline">
            {errors.password}
          </small>
        )}
      </div>

      <div className="form__row">
        <label htmlFor="confirm" className="form__label">
          Potvrda lozinke
        </label>
        <div className="form__input-wrap">
          <input
            id="confirm"
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (touched.confirm)
                setErrors(
                  validate({
                    name,
                    surname,
                    email,
                    password,
                    confirm: e.target.value,
                  })
                );
            }}
            onBlur={() => onBlurField("confirm")}
            required
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={Boolean(touched.confirm && errors.confirm)}
            aria-describedby={
              touched.confirm && errors.confirm ? "confirm-error" : undefined
            }
            className={`form__input form__input--with-button ${
              touched.confirm && errors.confirm ? "form__input--invalid" : ""
            }`}
            placeholder="Ponovno unesite lozinku"
          />
          <button
            type="button"
            className="icon-button"
            aria-label={
              showConfirm ? "Sakrij potvrdu lozinke" : "Prikaži potvrdu lozinke"
            }
            onClick={() => setShowConfirm((v) => !v)}
          >
            {showConfirm ? "Sakrij" : "Prikaži"}
          </button>
        </div>
        {touched.confirm && errors.confirm && (
          <small id="confirm-error" className="form__error-inline">
            {errors.confirm}
          </small>
        )}
      </div>

      {error && (
        <div role="alert" aria-live="assertive" className="form__error">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="button button--primary button--lg"
      >
        {loading ? "Registracija u tijeku..." : "Registriraj se"}
      </button>
    </form>
  );
};

export default RegisterForm;
