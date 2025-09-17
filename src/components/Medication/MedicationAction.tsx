import React from "react";

interface Props {
  onTaken: () => void | Promise<void>;
  onSnooze: () => void | Promise<void>;
  onDontRemind: () => void | Promise<void>;
}

const MedicationAction: React.FC<Props> = ({ onTaken, onSnooze, onDontRemind }) => {
  const [loadingTaken, setLoadingTaken] = React.useState(false);
  const [loadingSnooze, setLoadingSnooze] = React.useState(false);
  const [loadingDontRemind, setLoadingDontRemind] = React.useState(false);

  const handle = async (fn: () => void | Promise<void>, setLoading: (v: boolean) => void) => {
    try {
      setLoading(true);
      await Promise.resolve(fn());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div role="group" aria-label="Medication Actions">
      <button
        onClick={() => handle(onTaken, setLoadingTaken)}
        style={{ fontSize: "1rem", padding: "0.5rem", margin: "0.5rem", background: "#007bff", color: "#fff", border: '2px solid #0056b3' }}
        aria-label="Mark medication as taken"
        aria-busy={loadingTaken}
        disabled={loadingTaken}
      >
        {loadingTaken ? "Učitavanje..." : "Označi kao uzeto"}
      </button>
      <button
        onClick={() => handle(onSnooze, setLoadingSnooze)}
        style={{ fontSize: "1rem", padding: "0.5rem", margin: "0.5rem", background: "#ffc107", color: "#000", border: '2px solid #b58c00' }}
        aria-label="Snooze reminder"
        aria-busy={loadingSnooze}
        disabled={loadingSnooze}
      >
        {loadingSnooze ? "Odgoda..." : "Odgodi"}
      </button>
      <button
        onClick={() => handle(onDontRemind, setLoadingDontRemind)}
        style={{ fontSize: "1rem", padding: "0.5rem", margin: "0.5rem", background: "#dc3545", color: "#fff", border: '2px solid #a71d2a' }}
        aria-label="Don't remind me today"
        aria-busy={loadingDontRemind}
        disabled={loadingDontRemind}
      >
        {loadingDontRemind ? "Obrađujem..." : "Nemoj me podsjećati danas"}
      </button>
    </div>
  );
};

export default MedicationAction;
