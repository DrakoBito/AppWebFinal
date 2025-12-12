export default function Button({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  onClick, 
  disabled = false,
  fullWidth = false,
  ...props 
}) {
  const variantClass = {
    primary: 'btn',
    secondary: 'btn secondary',
    danger: 'btn danger'
  }[variant] || 'btn';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={variantClass}
      style={{ width: fullWidth ? '100%' : 'auto' }}
      {...props}
    >
      {children}
    </button>
  );
}