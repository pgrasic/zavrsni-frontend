import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Medication from "./pages/Medication";
import MedicationActionPage from "./pages/MedicationAction";
import Reminders from "./pages/Reminders";
import Header from './components/Layout/Header';
import IconPreview from './pages/IconPreview';

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
            <Route path="/admin" element={<Admin />} />
            <Route path="/icon-preview" element={<IconPreview />} />
            <Route path="/medication" element={<Medication />} />
            <Route path="/reminders" element={<Reminders />} />
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
