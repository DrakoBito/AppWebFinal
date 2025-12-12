import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: 'calc(100vh - 200px)',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '500px' }}>
        <div style={{ 
          fontSize: '120px', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, var(--primary-500), #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          marginBottom: '24px'
        }}>
          404
        </div>
        
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          🐾
        </div>

        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '12px'
        }}>
          Página no encontrada
        </h1>

        <p className="muted" style={{ 
          fontSize: '17px',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Parece que esta mascota se escapó. No pudimos encontrar la página que buscas.
        </p>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/">
            <Button>
              🏠 Ir al inicio
            </Button>
          </Link>
          <Link to="/portal-admin-9xK72">
            <Button variant="secondary">
              🔐 Panel Admin
            </Button>
          </Link>
        </div>

        <div style={{ 
          marginTop: '48px',
          padding: '24px',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <p className="muted" style={{ fontSize: '14px', margin: 0 }}>
            💡 <strong>Tip:</strong> Si llegaste aquí por error, verifica la URL o usa el menú de navegación.
          </p>
        </div>
      </div>
    </div>
  );
}