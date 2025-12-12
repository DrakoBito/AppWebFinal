import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PublicAPI } from "../api";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    PublicAPI.listAvailablePets()
      .then(setPets)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="h1">Mascotas en adopción</div>
        <p className="muted" style={{ fontSize: '17px', maxWidth: '600px', margin: '12px auto 0' }}>
          Conoce a nuestros amiguitos que buscan un hogar responsable y lleno de amor
        </p>
      </div>

      {loading && (
        <div className="loading">
          <p className="muted">Cargando mascotas disponibles...</p>
        </div>
      )}

      {!loading && pets.length === 0 && (
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐕</div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-primary)' }}>
              No hay mascotas disponibles
            </h3>
            <p className="muted">Vuelve pronto para conocer nuevos amiguitos</p>
          </div>
        </div>
      )}

      <div className="grid">
        {pets.map(p => (
          <div className="card" key={p.id}>
            <img src={p.photos[0]} alt={p.name} />
            <div className="card-body">
              <div className="pet-card-header">
                <h3 className="pet-card-title">{p.name}</h3>
                <span className="badge success">{p.status}</span>
              </div>
              <p className="pet-card-description">
                {p.description.length > 100
                  ? p.description.slice(0, 100) + "…"
                  : p.description}
              </p>
              <Link className="btn" to={`/pets/${p.id}`} style={{ width: '100%', marginTop: '12px' }}>
                Ver detalles →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
