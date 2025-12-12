export default function Loading({ message = 'Cargando...' }) {
  return (
    <div className="loading">
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '40px', 
          marginBottom: '16px',
          animation: 'spin 2s linear infinite'
        }}>
          🐾
        </div>
        <p className="muted">{message}</p>
      </div>
    </div>
  );
}