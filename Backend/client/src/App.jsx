import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PetDetail from "./pages/PetDetail.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

export default function App() {
  return (
    <>
      <div className="nav">
        <div className="nav-inner">
          <div className="brand">
            <Link to="/">🐾 PetAdopt</Link>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Encuentra tu mejor amigo
          </div>
        </div>
      </div>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets/:id" element={<PetDetail />} />
          <Route path="/portal-admin-9xK72" element={<AdminLogin />} />
          <Route path="/portal-admin-9xK72/panel" element={<AdminPanel />} />
        </Routes>
      </div>
    </>
  );
}
