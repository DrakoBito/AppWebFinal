import { useEffect, useState } from "react";
import { PublicAPI } from "../api";
import PageHeader from "../components/PageHeader";
import PetCard from "../components/PetCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    PublicAPI.listAvailablePets()
      .then((data) => {
        setPets(data);
        setFilteredPets(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredPets(pets);
      return;
    }

    const filtered = pets.filter(pet =>
      pet.name.toLowerCase().includes(term.toLowerCase()) ||
      pet.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPets(filtered);
  };

  if (loading) {
    return <Loading message="Cargando mascotas disponibles..." />;
  }

  return (
    <>
      <PageHeader
        title="Mascotas en adopción"
        subtitle="Conoce a nuestros amiguitos que buscan un hogar responsable y lleno de amor"
      />

      <div style={{ marginBottom: '32px' }}>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Buscar por nombre o descripción..."
        />
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon="🐕"
          title="No hay mascotas disponibles"
          description="Vuelve pronto para conocer nuevos amiguitos"
        />
      ) : filteredPets.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No se encontraron resultados"
          description={`No hay mascotas que coincidan con "${searchTerm}"`}
        />
      ) : (
        <>
          {searchTerm && (
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '24px',
              color: 'var(--text-muted)',
              fontSize: '15px'
            }}>
              Mostrando <strong style={{ color: 'var(--text-primary)' }}>{filteredPets.length}</strong> {filteredPets.length === 1 ? 'resultado' : 'resultados'}
            </div>
          )}
          <div className="grid">
            {filteredPets.map(p => (
              <PetCard key={p.id} pet={p} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
