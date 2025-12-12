export default function Badge({ children, variant = 'default' }) {
  const variantClass = {
    default: 'badge',
    success: 'badge success',
    warning: 'badge warning',
    danger: 'badge danger'
  }[variant] || 'badge';

  return (
    <span className={variantClass}>
      {children}
    </span>
  );
}