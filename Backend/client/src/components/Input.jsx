export default function Input({ 
  label, 
  error, 
  type = 'text', 
  required = false,
  value,
  onChange,
  ...props 
}) {
  return (
    <div>
      {label && (
        <label>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <input 
        type={type}
        className="input"
        required={required}
        value={value || ''}
        onChange={onChange}
        {...props}
      />
      {error && (
        <span style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export function Textarea({ label, error, required = false, value, onChange, ...props }) {
  return (
    <div>
      {label && (
        <label>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <textarea 
        className="input"
        required={required}
        value={value || ''}
        onChange={onChange}
        {...props}
      />
      {error && (
        <span style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export function Select({ label, error, required = false, value, onChange, children, ...props }) {
  return (
    <div>
      {label && (
        <label>
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <select 
        className="input"
        required={required}
        value={value || ''}
        onChange={onChange}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}