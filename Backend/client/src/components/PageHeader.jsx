export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ 
      textAlign: 'center', 
      marginBottom: '48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div>
        <div className="h1">{title}</div>
        {subtitle && (
          <p className="muted" style={{ 
            fontSize: '17px', 
            maxWidth: '600px', 
            margin: '12px auto 0' 
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  );
}