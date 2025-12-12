import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PublicAPI } from "../api";

export default function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    homeType: "Casa",
    hasYard: false,
    notes: ""
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    PublicAPI.getPet(id).then(setPet);
  }, [id]);

  if (!pet) return (
    <div className="loading">
      <p className="muted">Cargando información...</p>
    </div>
  );

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await PublicAPI.reserve(id, form);
      setMsg(r.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Link to="/" className="btn secondary" style={{ marginBottom: '24px', display: 'inline-flex' }}>
        ← Volver al inicio
      </Link>

      <div style={{ marginBottom: '24px' }}>
        <div className="h1">{pet.name}</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
          <span className="badge success">{pet.status}</span>
          <span className="muted">Disponible para adopción</span>
        </div>
      </div>

      <div className="gallery">
        {pet.photos.map((url, i) => (
          <img key={i} src={url} alt={`${pet.name} foto ${i + 1}`} />
        ))}
      </div>

      <div className="card" style={{ marginTop: '32px' }}>
        <div className="card-body">
          <div className="h2">📋 Sobre mí</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8' }}>
            {pet.description}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-body">
          <div className="h2">💙 Solicitar adopción</div>
          <p className="muted" style={{ marginBottom: '24px' }}>
            Completa el formulario y nos pondremos en contacto contigo. 
            La organización revisará tu información antes de aprobar la adopción.
          </p>

          {msg && (
            <div className="badge success" style={{ display: 'block', padding: '16px', marginBottom: '24px', fontSize: '14px' }}>
              ✓ {msg}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="row">
              <div>
                <label>Email *</label>
                <input 
                  className="input" 
                  type="email"
                  placeholder="tu@email.com"
                  required
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label>Nombre completo *</label>
                <input 
                  className="input" 
                  placeholder="Juan Pérez"
                  required
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="row">
              <div>
                <label>Teléfono *</label>
                <input 
                  className="input" 
                  type="tel"
                  placeholder="+52 123 456 7890"
                  required
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label>Tipo de vivienda *</label>
                <select 
                  className="input"
                  onChange={e => setForm({ ...form, homeType: e.target.value })}
                >
                  <option>Casa</option>
                  <option>Departamento</option>
                </select>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '16px' }}>
              <input
                type="checkbox"
                onChange={e => setForm({ ...form, hasYard: e.target.checked })}
              />
              <span>Tengo patio o espacio al aire libre</span>
            </label>

            <div style={{ marginTop: '20px' }}>
              <label>Notas adicionales (opcional)</label>
              <textarea 
                className="input"
                rows="4"
                placeholder="Cuéntanos sobre tu experiencia con mascotas, estilo de vida, etc."
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <button className="btn" type="submit" disabled={loading} style={{ width: '100%', marginTop: '24px', padding: '14px' }}>
              {loading ? 'Enviando...' : 'Enviar solicitud de adopción'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
