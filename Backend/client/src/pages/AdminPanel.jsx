import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAPI, getToken, clearToken } from "../api.js";
import Button from "../components/Button";
import Card, { CardBody } from "../components/Card";
import Badge from "../components/Badge";
import Input, { Textarea } from "../components/Input";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";

export default function AdminPanel() {
  const nav = useNavigate();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [selectedAdoptionId, setSelectedAdoptionId] = useState(null);
  const [followupNotes, setFollowupNotes] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [newPet, setNewPet] = useState({
    name: "",
    description: "",
    status: "AVAILABLE",
    photosText: ""
  });

  async function refreshAll() {
    try {
      const [p, r, a] = await Promise.all([
        AdminAPI.listPets(),
        AdminAPI.listRequests(),
        AdminAPI.listAdoptions()
      ]);
      setPets(p);
      setFilteredPets(p);
      setRequests(r);
      setAdoptions(a);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getToken()) {
      nav("/portal-admin-9xK72");
      return;
    }
    refreshAll();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredPets(pets);
      return;
    }

    const filtered = pets.filter(pet =>
      pet.name.toLowerCase().includes(term.toLowerCase()) ||
      pet.description.toLowerCase().includes(term.toLowerCase()) ||
      pet.status.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPets(filtered);
  };

  async function createPet(e) {
    e.preventDefault();
    try {
      const photos = newPet.photosText.split("\n").filter(l => l.trim());
      await AdminAPI.createPet({ ...newPet, photos });
      setNewPet({ name: "", description: "", status: "AVAILABLE", photosText: "" });
      setShowCreateModal(false);
      refreshAll();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function deletePet(id) {
    if (!confirm("¿Eliminar mascota?")) return;
    try {
      await AdminAPI.deletePet(id);
      refreshAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function setStatus(id, status) {
    try {
      await AdminAPI.patchPetStatus(id, status);
      refreshAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function approveReq(id) {
    try {
      await AdminAPI.approveRequest(id);
      refreshAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function rejectReq(id) {
    try {
      await AdminAPI.rejectRequest(id);
      refreshAll();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function loadFollowups(adoptionId) {
    try {
      const f = await AdminAPI.listFollowups(adoptionId);
      setFollowups(f);
      setSelectedAdoptionId(adoptionId);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function addFollowup() {
    if (!followupNotes.trim()) return;
    try {
      await AdminAPI.addFollowup(selectedAdoptionId, followupNotes);
      setFollowupNotes("");
      loadFollowups(selectedAdoptionId);
    } catch (e) {
      setErr(e.message);
    }
  }

  function logout() {
    clearToken();
    nav("/portal-admin-9xK72");
  }

  if (loading) {
    return <Loading message="Cargando panel de administración..." />;
  }

  return (
    <>
      <PageHeader
        title="🔐 Panel de Administración"
        subtitle="Gestiona mascotas, solicitudes y adopciones"
        actions={[
          <Button key="create" onClick={() => setShowCreateModal(true)}>
            ➕ Nueva Mascota
          </Button>,
          <Button key="logout" variant="danger" onClick={logout}>
            🚪 Cerrar Sesión
          </Button>
        ]}
      />

      {err && (
        <Badge variant="danger" style={{ display: 'block', padding: '16px', marginBottom: '24px' }}>
          Error: {err}
        </Badge>
      )}

      {/* MASCOTAS */}
      <Card style={{ marginBottom: '32px' }}>
        <CardBody>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 className="h2" style={{ margin: 0 }}>
              🐾 Mascotas ({filteredPets.length}{searchTerm && ` de ${pets.length}`})
            </h2>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Buscar mascotas por nombre, descripción o estado..."
            />
          </div>

          {filteredPets.length === 0 && searchTerm ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 24px',
              color: 'var(--text-muted)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p>No se encontraron mascotas que coincidan con "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid">
              {filteredPets.map(p => (
                <Card key={p.id}>
                  <img src={p.photos[0]} alt={p.name} style={{ height: '200px' }} />
                  <CardBody padding="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <strong>{p.name}</strong>
                      <Badge variant={p.status === 'AVAILABLE' ? 'success' : 'warning'}>
                        {p.status}
                      </Badge>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {p.status === 'AVAILABLE' && (
                        <Button onClick={() => setStatus(p.id, 'RESERVED')} style={{ flex: 1, fontSize: '13px', padding: '8px' }}>
                          Reservar
                        </Button>
                      )}
                      {p.status === 'RESERVED' && (
                        <Button onClick={() => setStatus(p.id, 'AVAILABLE')} style={{ flex: 1, fontSize: '13px', padding: '8px' }}>
                          Disponible
                        </Button>
                      )}
                      <Button variant="danger" onClick={() => deletePet(p.id)} style={{ flex: 1, fontSize: '13px', padding: '8px' }}>
                        Eliminar
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* SOLICITUDES */}
      <Card style={{ marginBottom: '32px' }}>
        <CardBody>
          <h2 className="h2">📋 Solicitudes Pendientes ({requests.filter(r => r.status === 'PENDING').length})</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {requests.filter(r => r.status === 'PENDING').map(r => (
              <Card key={r.id}>
                <CardBody padding="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <strong>{r.fullName}</strong> - {r.email}
                      <div className="muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                        {r.phone} • {r.homeType} • {r.hasYard ? '🏡 Con patio' : '🏢 Sin patio'}
                      </div>
                      {r.notes && <p className="muted" style={{ marginTop: '8px', fontSize: '14px' }}>{r.notes}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button onClick={() => approveReq(r.id)}>
                        ✓ Aprobar
                      </Button>
                      <Button variant="danger" onClick={() => rejectReq(r.id)}>
                        ✕ Rechazar
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* ADOPCIONES */}
      <Card>
        <CardBody>
          <h2 className="h2">💚 Adopciones ({adoptions.length})</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {adoptions.map(a => (
              <Card key={a.id}>
                <CardBody padding="small">
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Mascota:</strong> {a.pet?.name || 'N/A'}<br />
                    <strong>Adoptante:</strong> {a.request?.fullName || 'N/A'}<br />
                    <span className="muted">
                      Adoptado: {new Date(a.adoptedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={() => loadFollowups(a.id)}
                    style={{ fontSize: '13px' }}
                  >
                    📝 Ver Seguimientos
                  </Button>

                  {selectedAdoptionId === a.id && (
                    <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                      <strong style={{ display: 'block', marginBottom: '12px' }}>Seguimientos:</strong>
                      {followups.map(f => (
                        <div key={f.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                          <p style={{ margin: 0, fontSize: '14px' }}>{f.notes}</p>
                          <span className="muted" style={{ fontSize: '12px' }}>
                            {new Date(f.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div style={{ marginTop: '16px' }}>
                        <Textarea
                          placeholder="Agregar nuevo seguimiento..."
                          rows="3"
                          value={followupNotes}
                          onChange={e => setFollowupNotes(e.target.value)}
                        />
                        <Button onClick={addFollowup} style={{ marginTop: '8px' }}>
                          Agregar Seguimiento
                        </Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* MODAL CREAR MASCOTA */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="➕ Crear Nueva Mascota"
      >
        <form onSubmit={createPet}>
          <Input
            label="Nombre"
            required
            value={newPet.name}
            onChange={e => setNewPet({ ...newPet, name: e.target.value })}
            placeholder="Ej: Luna"
          />
          <div style={{ marginTop: '16px' }}>
            <Textarea
              label="Descripción"
              required
              rows="4"
              value={newPet.description}
              onChange={e => setNewPet({ ...newPet, description: e.target.value })}
              placeholder="Describe a la mascota..."
            />
          </div>
          <div style={{ marginTop: '16px' }}>
            <Textarea
              label="URLs de fotos (una por línea)"
              required
              rows="4"
              placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"
              value={newPet.photosText}
              onChange={e => setNewPet({ ...newPet, photosText: e.target.value })}
            />
          </div>
          <Button type="submit" fullWidth style={{ marginTop: '24px' }}>
            Crear Mascota
          </Button>
        </form>
      </Modal>
    </>
  );
}
