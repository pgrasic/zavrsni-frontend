import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MedicationAction from "../components/Medication/MedicationAction";
import { medicationTaken, snoozeReminder, dontRemindToday } from "../utils/api";

const MedicationActionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const lijekId = searchParams.get("lijek_id") ? Number(searchParams.get("lijek_id")) : undefined;

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!action || !lijekId) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = `/login?redirect=/medication-action?action=${action}&lijek_id=${lijekId}`;
      return;
    }

    setLoading(true);
    const perform = async () => {
      try {
        if (action === "confirm") {
          await medicationTaken(lijekId);
          setMessage("Lijek označen kao uzet.");
        } else if (action === "snooze") {
          await snoozeReminder(lijekId);
          setMessage("Podsjetnik odgođen za 1 sat.");
        } else if (action === "skip") {
          await dontRemindToday(lijekId);
          setMessage("Podsjetnik preskočen za danas.");
        } else {
          setError("Nepoznata akcija.");
        }
      } catch (e: any) {
        setError(e?.message || "Akcija nije uspjela.");
      } finally {
        setLoading(false);
      }
    };
    perform();
  }, [action, lijekId]);

  if (action && lijekId) {
    return (
      <main aria-label="Medication action page">
        {loading && <p>Obrađujem...</p>}
        {message && <p role="status" aria-live="polite">{message}</p>}
        {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
      </main>
    );
  }

  return (
    <main aria-label="Medication action page">
      <h1>Akcije podsjetnika</h1>
      <MedicationAction
        onTaken={async () => {
          await medicationTaken(lijekId);
          setMessage("Lijek označen kao uzet.");
        }}
        onSnooze={async () => {
          await snoozeReminder(lijekId);
          setMessage("Podsjetnik odgođen za 1 sat.");
        }}
        onDontRemind={async () => {
          await dontRemindToday(lijekId);
          setMessage("Podsjetnik preskočen za danas.");
        }}
      />
      {message && <p role="status" aria-live="polite">{message}</p>}
      {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
    </main>
  );
};

export default MedicationActionPage;
