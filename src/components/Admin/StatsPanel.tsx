import React, { useEffect, useState } from "react";
import { getStats } from "../../utils/api";
import { Stats } from "../../types/stats";

const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError("Failed to load stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div role="alert" aria-live="assertive">{error}</div>;
  if (!stats) return null;

  return (
    <section aria-label="Admin statistics panel">
      <h2>Statistics</h2>
      <table role="table" style={{ fontSize: "1.2rem", width: "100%" }}>
        <thead>
          <tr>
            <th scope="col">Stat</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default StatsPanel;
