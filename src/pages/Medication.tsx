import React, { useRef, useState, useEffect } from "react";
import MedicationForm from "../components/Medication/MedicationForm";

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
    <main aria-label="Medication input page" style={{ textAlign: 'center' }}>
  <h1 style={{ marginBottom: '1.5rem', fontSize: '2.2rem', fontWeight: 800 }}>Unos lijeka</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
  <div style={{ width: '560px', maxWidth: '95%', margin: '0 auto' }}>
          <MedicationForm onSuccess={handleSuccess} />
        </div>
      </div>
      {message && (
        <div
          ref={msgRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          style={{
            marginTop: "1.25rem",
            padding: "1.25rem",
            border: "1px solid #2e7d32",
            background: "#dff0d8",
            color: "#155724",
            fontSize: "1.1rem",
            borderRadius: '8px'
          }}
        >
          {message}
        </div>
      )}
    </main>
  );
};

export default Medication;
