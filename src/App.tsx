import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import User from "./pages/User";
import Medication from "./pages/Medication";
import MedicationActionPage from "./pages/MedicationAction";
import Reminders from "./pages/Reminders";
import Header from './components/Layout/Header';
import IconPreview from './pages/IconPreview';
import RequireAuth from './components/Auth/RequireAuth';

const AppInner: React.FC = () => {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
  {/* Header should span full width; Header component centers its inner content */}
  {!hideHeader && <Header />}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '900px', maxWidth: '95%' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/admin"
              element={<RequireAuth><Admin /></RequireAuth>}
            />
            <Route
              path="/user"
              element={<RequireAuth><User /></RequireAuth>}
            />
            <Route
              path="/medication"
              element={<RequireAuth><Medication /></RequireAuth>}
            />
            <Route
              path="/reminders"
              element={<RequireAuth><Reminders /></RequireAuth>}
            />

            <Route path="/icon-preview" element={<IconPreview />} />

            {/* Link targets from emails: medication-action may also be protected depending on token usage */}
            <Route path="/medication-action" element={<MedicationActionPage />} />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppInner />
  </Router>
);

export default App;
