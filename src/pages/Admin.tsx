import React from "react";
import StatsPanel from "../components/Admin/StatsPanel";
import RequestsPanel from "../components/Admin/RequestsPanel";

const Admin: React.FC = () => (
  <main aria-label="Admin panel">
    <h1>Admin Panel</h1>
    <StatsPanel />
    <RequestsPanel />
  </main>
);

export default Admin;
