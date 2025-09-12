import React, { useEffect, useMemo, useState } from "react";
import {
  getAllMeds,
  createKorisnikLijek,
  getUserIdFromToken,
} from "../../utils/api";
import "../../assets/css/medicationForm.css"; // new stylesheet

function formatCroatianDateWith24Hour(isoLike: Date | string | null) {
  if (!isoLike) return "";
  const d = isoLike instanceof Date ? isoLike : new Date(isoLike);
  const parts = new Intl.DateTimeFormat("hr-HR", {
    timeZone: "Europe/Zagreb",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get(
    "minute"
  )}`;
}

const MedicationForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [meds, setMeds] = useState<Array<any>>([]);
  const [medId, setMedId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [intervalHours, setIntervalHours] = useState<number>(24);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [loadingMeds, setLoadingMeds] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    search?: string;
    startTime?: string;
    intervalHours?: string;
    quantity?: string;
  }>({});

  useEffect(() => {
    setLoadingMeds(true);
    getAllMeds()
      .then((data) => setMeds(data || []))
      .catch(() => {
        /* optionally show a page-level alert */
      })
      .finally(() => setLoadingMeds(false));
  }, []);

  const filteredMeds = useMemo(
    () =>
      meds.filter((m: any) =>
        m.naziv.toLowerCase().includes(search.toLowerCase())
      ),
    [meds, search]
  );

  const validate = () => {
    const e: typeof errors = {};
    if (!medId) e.search = "Odaberite lijek iz popisa.";
    if (!startTime) e.startTime = "Odaberite početno vrijeme.";
    if (!intervalHours || intervalHours < 1)
      e.intervalHours = "Razmak mora biti najmanje 1 sat.";
    if (!quantity || quantity < 1)
      e.quantity = "Količina mora biti najmanje 1.";
    setErrors(e);
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMap = validate();
    if (Object.keys(eMap).length > 0) return;

    setLoading(true);
    try {
      const korisnik_id = getUserIdFromToken();
      if (!korisnik_id) throw new Error("Niste prijavljeni");

      await createKorisnikLijek({
        korisnik_id: Number(korisnik_id),
        lijek_id: medId!,
        pocetno_vrijeme: startTime,
        razmak_sati: Number(intervalHours),
        kolicina: Number(quantity),
      });

      onSuccess();
      // reset
      setMedId(null);
      setSearch("");
      setStartTime(new Date());
      setIntervalHours(24);
      setQuantity(1);
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  if (loadingMeds) {
    return (
      <div className="form form--loading">
        <div className="spinner" aria-hidden="true"></div>
        <div>Učitavanje lijekova...</div>
      </div>
    );
  }

  return (
    <form
      className="form"
      onSubmit={handleSubmit}
      aria-label="Medication form"
      noValidate
    >
      <div className="form__row">
        <label htmlFor="medication-search" className="form__label">
          Lijek
        </label>
        <div className="input-with-button">
          <input
            id="medication-search"
            type="text"
            className={`form__input ${
              errors.search ? "form__input--invalid" : ""
            }`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
              setMedId(null);
              if (errors.search)
                setErrors((prev) => ({ ...prev, search: undefined }));
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Pretraži i odaberi lijek"
            aria-required="true"
            aria-invalid={Boolean(errors.search)}
            aria-describedby={
              errors.search ? "medication-search-error" : undefined
            }
          />
          {search && (
            <button
              type="button"
              className="icon-button"
              aria-label="Očisti"
              onClick={() => {
                setSearch("");
                setMedId(null);
                setShowSuggestions(false);
              }}
            >
              Očisti
            </button>
          )}
        </div>

        {showSuggestions && (
          <div className="dropdown">
            <div className="dropdown__header">
              <span>Rezultati</span>
              <button
                type="button"
                className="dropdown__close"
                onClick={() => setShowSuggestions(false)}
              >
                Zatvori
              </button>
            </div>
            <ul className="dropdown__list" role="listbox">
              {filteredMeds.length === 0 && (
                <li className="dropdown__empty">Nema rezultata</li>
              )}
              {filteredMeds.map((m: any) => (
                <li
                  key={m.id}
                  className="dropdown__item"
                  role="option"
                  onClick={() => {
                    setMedId(Number(m.id));
                    setSearch(m.naziv);
                    setShowSuggestions(false);
                  }}
                >
                  {m.naziv}
                </li>
              ))}
            </ul>
          </div>
        )}
        {errors.search && (
          <small id="medication-search-error" className="form__error-inline">
            {errors.search}
          </small>
        )}
      </div>

      <div className="form__row">
        <label htmlFor="start-time" className="form__label">
          Početno vrijeme
        </label>
        <input
          id="start-time"
          type="datetime-local"
          className={`form__input ${
            errors.startTime ? "form__input--invalid" : ""
          }`}
          value={
            startTime
              ? new Date(
                  startTime.getTime() - startTime.getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .slice(0, 16)
              : ""
          }
          onChange={(e) => {
            setStartTime(e.target.value ? new Date(e.target.value) : null);
            if (errors.startTime)
              setErrors((prev) => ({ ...prev, startTime: undefined }));
          }}
          aria-required="true"
          aria-invalid={Boolean(errors.startTime)}
          aria-describedby={errors.startTime ? "start-time-error" : undefined}
        />
        {errors.startTime && (
          <small id="start-time-error" className="form__error-inline">
            {errors.startTime}
          </small>
        )}
      </div>

      <div className="form__row">
        <label htmlFor="interval" className="form__label">
          Razmak (sati)
        </label>
        <input
          id="interval"
          type="number"
          min={1}
          className={`form__input ${
            errors.intervalHours ? "form__input--invalid" : ""
          }`}
          value={intervalHours}
          onChange={(e) => {
            const n = Number(e.target.value);
            setIntervalHours(n);
            if (n >= 1 && errors.intervalHours)
              setErrors((prev) => ({ ...prev, intervalHours: undefined }));
          }}
          aria-required="true"
          aria-invalid={Boolean(errors.intervalHours)}
          aria-describedby={errors.intervalHours ? "interval-error" : undefined}
        />
        {errors.intervalHours && (
          <small id="interval-error" className="form__error-inline">
            {errors.intervalHours}
          </small>
        )}
      </div>

      <div className="form__row">
        <label htmlFor="quantity" className="form__label">
          Količina
        </label>
        <input
          id="quantity"
          type="number"
          min={1}
          className={`form__input ${
            errors.quantity ? "form__input--invalid" : ""
          }`}
          value={quantity}
          onChange={(e) => {
            const n = Number(e.target.value);
            setQuantity(n);
            if (n >= 1 && errors.quantity)
              setErrors((prev) => ({ ...prev, quantity: undefined }));
          }}
          aria-required="true"
          aria-invalid={Boolean(errors.quantity)}
          aria-describedby={errors.quantity ? "quantity-error" : undefined}
        />
        {errors.quantity && (
          <small id="quantity-error" className="form__error-inline">
            {errors.quantity}
          </small>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="button button--primary button--lg"
      >
        {loading ? "Spremanje..." : "Spremi podsjetnik"}
      </button>
    </form>
  );
};

export default MedicationForm;
