import React, { useState } from "react";
import MedicationAction from "../components/Medication/MedicationAction";
import { medicationTaken, snoozeReminder, dontRemindToday } from "../utils/api";

const MedicationActionPage: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleTaken = async () => {
    await medicationTaken();
    setMessage("Marked as taken!");
  };
  const handleSnooze = async () => {
    await snoozeReminder();
    setMessage("Reminder snoozed!");
  };
  const handleDontRemind = async () => {
    await dontRemindToday();
    setMessage("No reminder for today!");
  };

  return (
    <main aria-label="Medication action page">
      <h1>Medication Reminder Actions</h1>
      <MedicationAction
        onTaken={handleTaken}
        onSnooze={handleSnooze}
        onDontRemind={handleDontRemind}
      />
      {message && <div role="status" aria-live="polite">{message}</div>}
    </main>
  );
};

export default MedicationActionPage;
