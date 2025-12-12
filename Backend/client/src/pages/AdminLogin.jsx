import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAPI, setToken } from "../api.js";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@org.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const r = await AdminAPI.login(email, password);
      setToken(r.token);
      nav("/portal-admin-9xK72/panel");
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="card">
      <div className="p">
        <div className="h1">Admin Login</div>
        <div className="muted">Credenciales vienen del archivo <b>server/.env</b>.</div>

        <hr />
        {err && <div className="badge" style={{borderColor:"#7f1d1d"}}>Error: {err}</div>}

        <form onSubmit={submit} style={{marginTop:10}}>
          <div>
            <label>Email</label>
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{marginTop:10}}>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div style={{marginTop:12}}>
            <button className="btn" type="submit">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
