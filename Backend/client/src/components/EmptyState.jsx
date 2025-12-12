export default function EmptyState({ 
  icon = '🐕', 
  title, 
  description,
  action
}) {
  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
        <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="muted">{description}</p>
        {action && (
          <div style={{ marginTop: '24px' }}>
            {action}
          </div>
        )}
      </div>
    </div>
  );
}