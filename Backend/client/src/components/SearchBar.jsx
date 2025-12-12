import { useState } from 'react';
import Input from './Input';

export default function SearchBar({ onSearch, placeholder = "Buscar..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          style={{
            paddingLeft: '44px',
            paddingRight: searchTerm ? '44px' : '16px'
          }}
        />
        <span style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '18px',
          pointerEvents: 'none'
        }}>
          🔍
        </span>
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            ✕
          </button>
        )}
      </div>
      {searchTerm && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          marginTop: '8px',
          padding: '8px 12px',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          color: 'var(--text-muted)',
          border: '1px solid var(--border-subtle)'
        }}>
          Buscando: <strong style={{ color: 'var(--text-primary)' }}>"{searchTerm}"</strong>
        </div>
      )}
    </div>
  );
}