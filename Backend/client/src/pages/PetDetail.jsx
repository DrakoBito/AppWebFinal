import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PublicAPI } from "../api";
import Button from "../components/Button";
import Card, { CardBody } from "../components/Card";
import Badge from "../components/Badge";
import Input, { Textarea, Select } from "../components/Input";
import Loading from "../components/Loading";

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

  if (!pet) {
    return <Loading message="Cargando información..." />;
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await PublicAPI.reserve(id, form);
      setMsg(r.message);
      setForm({
        email: "",
        fullName: "",
        phone: "",
        homeType: "Casa",
        hasYard: false,
        notes: ""
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Link to="/">
        <Button variant="secondary" style={{ marginBottom: '24px' }}>
          ← Volver al inicio
        </Button>
      </Link>

      <div style={{ marginBottom: '24px' }}>
        <div className="h1">{pet.name}</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
          <Badge variant="success">{pet.status}</Badge>
          <span className="muted">Disponible para adopción</span>
        </div>
      </div>

      <div className="gallery">
        {pet.photos.map((url, i) => (
          <img key={i} src={url} alt={`${pet.name} foto ${i + 1}`} />
        ))}
      </div>

      <Card style={{ marginTop: '32px' }}>
        <CardBody>
          <div className="h2">📋 Sobre mí</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8' }}>
            {pet.description}
          </p>
        </CardBody>
      </Card>

      <Card style={{ marginTop: '24px' }}>
        <CardBody>
          <div className="h2">💙 Solicitar adopción</div>
          <p className="muted" style={{ marginBottom: '24px' }}>
            Completa el formulario y nos pondremos en contacto contigo. 
            La organización revisará tu información antes de aprobar la adopción.
          </p>

          {msg && (
            <Badge variant="success" style={{ display: 'block', padding: '16px', marginBottom: '24px', fontSize: '14px' }}>
              ✓ {msg}
            </Badge>
          )}

          <form onSubmit={submit}>
            <div className="row">
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Nombre completo"
                placeholder="Juan Pérez"
                required
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div className="row">
              <Input
                label="Teléfono"
                type="tel"
                placeholder="+52 123 456 7890"
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
              <Select
                label="Tipo de vivienda"
                required
                value={form.homeType}
                onChange={e => setForm({ ...form, homeType: e.target.value })}
              >
                <option>Casa</option>
                <option>Departamento</option>
              </Select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '16px' }}>
              <input
                type="checkbox"
                checked={form.hasYard}
                onChange={e => setForm({ ...form, hasYard: e.target.checked })}
              />
              <span>Tengo patio o espacio al aire libre</span>
            </label>

            <div style={{ marginTop: '20px' }}>
              <Textarea
                label="Notas adicionales (opcional)"
                rows="4"
                placeholder="Cuéntanos sobre tu experiencia con mascotas, estilo de vida, etc."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              fullWidth 
              style={{ marginTop: '24px', padding: '14px' }}
            >
              {loading ? 'Enviando...' : 'Enviar solicitud de adopción'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
