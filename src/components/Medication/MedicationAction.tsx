import React from "react";

interface Props {
  onTaken: () => void;
  onSnooze: () => void;
  onDontRemind: () => void;
}

const MedicationAction: React.FC<Props> = ({ onTaken, onSnooze, onDontRemind }) => (
  <div role="group" aria-label="Medication Actions">
    <button
      onClick={onTaken}
      style={{ fontSize: "1.5rem", padding: "1rem", margin: "0.5rem", background: "#007bff", color: "#fff", border: '2px solid #0056b3' }}
      aria-label="Mark medication as taken"
    >
      Označi kao uzeto
    </button>
    <button
      onClick={onSnooze}
      style={{ fontSize: "1.5rem", padding: "1rem", margin: "0.5rem", background: "#ffc107", color: "#000", border: '2px solid #b58c00' }}
      aria-label="Snooze reminder"
    >
      Odgodi
    </button>
    <button
      onClick={onDontRemind}
      style={{ fontSize: "1.5rem", padding: "1rem", margin: "0.5rem", background: "#dc3545", color: "#fff", border: '2px solid #a71d2a' }}
      aria-label="Don't remind me today"
    >
      Nemoj me podsjećati danas
    </button>
  </div>
);

export default MedicationAction;
