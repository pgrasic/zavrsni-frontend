import React, { useRef, useState, useEffect } from "react";
import MedicationForm from "../components/Medication/MedicationForm";
import "../assets/css/register.css"; // reuse the same stylesheet for consistent look

const Medication: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const msgRef = useRef<HTMLDivElement | null>(null);

  const handleSuccess = () => {
    setMessage("Podsjetnik uspješno spremljen.");
  };

  useEffect(() => {
    if (message && msgRef.current) {
      msgRef.current.focus();
      const t = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(t);
    }
  }, [message]);

  return (
    <main aria-label="Medication input page" className="page page--center">
      <div className="card">
        <h1 className="card__title">Unos lijeka</h1>

        <div
          className="form"
          role="region"
          aria-label="Medication form section"
        >
          <MedicationForm onSuccess={handleSuccess} />
        </div>

        {message && (
          <div
            ref={msgRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="alert alert--success"
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
};

export default Medication;
