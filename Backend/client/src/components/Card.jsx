export default function Card({ children, hover = false, className = '', ...props }) {
  return (
    <div 
      className={`card ${hover ? 'card-interactive' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, padding = 'normal' }) {
  const paddingStyle = {
    small: { padding: '16px' },
    normal: { padding: '20px' },
    large: { padding: '32px' }
  }[padding];

  return (
    <div className="card-body" style={paddingStyle}>
      {children}
    </div>
  );
}