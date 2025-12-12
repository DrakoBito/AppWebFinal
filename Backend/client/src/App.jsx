import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PetDetail from "./pages/PetDetail.jsx";
import Donations from "./pages/Donations.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import NotFound from "./pages/NotFound.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";

export default function App() {
  return (
    <>
      <div className="nav">
        <div className="nav-inner">
          <div className="brand">
            <Link to="/">🐾 PetAdopt</Link>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/donaciones" style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '14px',
              fontWeight: '600',
              transition: 'color 0.2s ease'
            }}>
              💝 Donar
            </Link>
            <ThemeToggle />
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'none' }}>
              Encuentra tu mejor amigo
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets/:id" element={<PetDetail />} />
          <Route path="/donaciones" element={<Donations />} />
          <Route path="/portal-admin-9xK72" element={<AdminLogin />} />
          <Route path="/portal-admin-9xK72/panel" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
