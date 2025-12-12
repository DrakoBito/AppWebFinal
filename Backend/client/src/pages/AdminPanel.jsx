import React, { useEffect, useState } from "react";
import { AdminAPI, getToken } from "../api.js";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [selectedAdoptionId, setSelectedAdoptionId] = useState(null);
  const [followupNotes, setFollowupNotes] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [newPet, setNewPet] = useState({
    name: "",
    description: "",
    status: "AVAILABLE",
    photosText: ""
  });

  async function refreshAll() {
    setErr("");
    try {
      const [p, r, a] = await Promise.all([
        AdminAPI.listPets(),
        AdminAPI.listRequests("PENDING"),
        AdminAPI.listAdoptions()
      ]);
      setPets(p);
      setRequests(r);
      setAdoptions(a);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getToken()) return;
    refreshAll();
  }, []);

  async function createPet(e) {
    e.preventDefault();
    setErr("");
    try {
      const photos = newPet.photosText
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);

      await AdminAPI.createPet({
        name: newPet.name,
        description: newPet.description,
        status: newPet.status,
        photos
      });
      setNewPet({ name: "", description: "", status: "AVAILABLE", photosText: "" });
      await refreshAll();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function deletePet(id) {
    if (!confirm("¿Eliminar mascota?")) return;
    setErr("");
    try {
      await AdminAPI.deletePet(id);
      await refreshAll();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function setStatus(id, status) {
    setErr("");
    try {
      await AdminAPI.patchPetStatus(id, status);
      await refreshAll();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function approveReq(id) {
    setErr("");
    try {
      await AdminAPI.approveRequest(id);
      await refreshAll();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function rejectReq(id) {
    setErr("");
    try {
      await AdminAPI.rejectRequest(id);
      await refreshAll();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function loadFollowups(adoptionId) {
    setErr("");
    try {
      setSelectedAdoptionId(adoptionId);
      const rows = await AdminAPI.listFollowups(adoptionId);
      setFollowups(rows);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function addFollowup() {
    if (!selectedAdoptionId) return;
    setErr("");
    try {
      await AdminAPI.addFollowup(selectedAdoptionId, followupNotes);
      setFollowupNotes("");
      await loadFollowups(selectedAdoptionId);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  if (!getToken()) {
    return (
      <div className="card">
        <div className="p">
          <div className="h2">No autenticado</div>
          <div className="muted">Debes iniciar sesión.</div>
          <div style={{marginTop:10}}>
            <Link className="btn" to="/admin/login">Ir a login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="h1">Panel Admin</div>
      <div className="muted">Gestión simple: mascotas, solicitudes y seguimientos.</div>

      <hr />
      {loading && <div className="muted">Cargando...</div>}
      {err && <div className="badge" style={{borderColor:"#7f1d1d"}}>Error: {err}</div>}

      <div className="card" style={{marginTop:14}}>
        <div className="p">
          <div className="h2">Crear mascota</div>
          <form onSubmit={createPet}>
            <div className="row">
              <div>
                <label>Nombre</label>
                <input className="input" value={newPet.name} onChange={e => setNewPet({...newPet, name: e.target.value})} />
              </div>
              <div>
                <label>Estado</label>
                <select className="input" value={newPet.status} onChange={e => setNewPet({...newPet, status: e.target.value})}>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="ADOPTED">ADOPTED</option>
                </select>
              </div>
            </div>

            <div style={{marginTop:10}}>
              <label>Descripción</label>
              <textarea className="input" rows="3" value={newPet.description} onChange={e => setNewPet({...newPet, description: e.target.value})} />
            </div>

            <div style={{marginTop:10}}>
              <label>Fotos (1 URL por línea)</label>
              <textarea className="input" rows="4" value={newPet.photosText} onChange={e => setNewPet({...newPet, photosText: e.target.value})} />
            </div>

            <div style={{marginTop:12}}>
              <button className="btn" type="submit">Crear</button>
            </div>
          </form>
        </div>
      </div>

      <div className="card" style={{marginTop:14}}>
        <div className="p">
          <div className="h2">Mascotas</div>
          <div className="muted">Recuerda: en público solo se ven las AVAILABLE.</div>
          <hr />
          {pets.map(p => (
            <div key={p.id} style={{display:"flex", justifyContent:"space-between", gap:10, alignItems:"center", padding:"10px 0", borderTop:"1px solid #1f2937"}}>
              <div style={{display:"flex", gap:10, alignItems:"center"}}>
                <img src={p.photos?.[0] || "https://via.placeholder.com/120"} style={{width:64, height:48, objectFit:"cover", borderRadius:10}} />
                <div>
                  <b>{p.name}</b>
                  <div className="muted" style={{maxWidth:520}}>
                    {p.description.length > 80 ? p.description.slice(0, 80) + "..." : p.description}
                  </div>
                </div>
              </div>
              <div style={{display:"flex", gap:8, alignItems:"center"}}>
                <span className="badge">{p.status}</span>
                <select className="input" style={{width:170}} value={p.status} onChange={e => setStatus(p.id, e.target.value)}>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="ADOPTED">ADOPTED</option>
                </select>
                <button className="btn danger" onClick={() => deletePet(p.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{marginTop:14}}>
        <div className="p">
          <div className="h2">Solicitudes (PENDING)</div>
          <hr />
          {requests.length === 0 && <div className="muted">No hay solicitudes pendientes.</div>}
          {requests.map(r => (
            <div key={r.id} style={{padding:"10px 0", borderTop:"1px solid #1f2937"}}>
              <div style={{display:"flex", justifyContent:"space-between", gap:10}}>
                <div>
                  <b>#{r.id}</b> — <span className="badge">{r.pet_name}</span>
                  <div className="muted">{r.full_name} — {r.email} — {r.phone}</div>
                  <div className="muted">Vivienda: {r.home_type} | Patio: {r.has_yard ? "Sí" : "No"}</div>
                  {r.notes ? <div className="muted">Notas: {r.notes}</div> : null}
                </div>
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <button className="btn" onClick={() => approveReq(r.id)}>Aprobar</button>
                  <button className="btn danger" onClick={() => rejectReq(r.id)}>Rechazar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{marginTop:14}}>
        <div className="p">
          <div className="h2">Adopciones y seguimiento</div>
          <hr />
          {adoptions.length === 0 && <div className="muted">Aún no hay adopciones aprobadas.</div>}

          {adoptions.map(a => (
            <div key={a.id} style={{padding:"10px 0", borderTop:"1px solid #1f2937", display:"flex", justifyContent:"space-between", gap:10}}>
              <div>
                <b>Adopción #{a.id}</b> — <span className="badge">{a.pet_name}</span>
                <div className="muted">{a.adopter_name} — {a.adopter_email} — {a.adopter_phone}</div>
                <div className="muted">Fecha: {a.adoption_date}</div>
              </div>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <button className="btn secondary" onClick={() => loadFollowups(a.id)}>
                  Ver seguimiento
                </button>
              </div>
            </div>
          ))}

          {selectedAdoptionId && (
            <>
              <hr />
              <div className="h2">Seguimiento de adopción #{selectedAdoptionId}</div>

              <div style={{display:"flex", gap:10, alignItems:"center"}}>
                <input className="input" placeholder="Nota de seguimiento (ej. visita 1: hogar en buen estado)"
                  value={followupNotes} onChange={e => setFollowupNotes(e.target.value)} />
                <button className="btn" onClick={addFollowup}>Agregar</button>
              </div>

              <div style={{marginTop:10}}>
                {followups.length === 0 && <div className="muted">Sin registros todavía.</div>}
                {followups.map(f => (
                  <div key={f.id} className="card" style={{marginTop:10}}>
                    <div className="p">
                      <div className="muted">{f.created_at}</div>
                      <div>{f.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
