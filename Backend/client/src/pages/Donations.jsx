import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Card, { CardBody } from '../components/Card';
import Button from '../components/Button';
import Input, { Select, Textarea } from '../components/Input';
import Badge from '../components/Badge';

export default function Donations() {
  const [donationType, setDonationType] = useState('monetary');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [inKindInfo, setInKindInfo] = useState({
    itemType: 'Alimento',
    description: '',
    quantity: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [50, 100, 250, 500, 1000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simular envío (aquí iría la integración con pasarela de pago)
    setTimeout(() => {
      setShowSuccess(true);
      setLoading(false);
      
      // Reset form
      setAmount('');
      setCustomAmount('');
      setDonorInfo({ name: '', email: '', phone: '', message: '' });
      setInKindInfo({ itemType: 'Alimento', description: '', quantity: '' });

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  return (
    <>
      <PageHeader
        title="💝 Donaciones"
        subtitle="Tu apoyo hace la diferencia. Ayúdanos a seguir rescatando y cuidando mascotas"
      />

      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          maxWidth: '500px',
          width: '90%'
        }}>
          <Card style={{ border: '2px solid var(--success)' }}>
            <CardBody>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ color: 'var(--success)', marginBottom: '8px' }}>
                  ¡Gracias por tu donación!
                </h3>
                <p className="muted">
                  Tu generosidad nos ayuda a continuar nuestra misión de rescate y cuidado
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <div style={{ display: 'grid', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Selector de tipo de donación */}
        <Card>
          <CardBody>
            <h2 className="h2" style={{ marginBottom: '16px' }}>¿Cómo quieres ayudar?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <button
                type="button"
                onClick={() => setDonationType('monetary')}
                style={{
                  padding: '24px',
                  background: donationType === 'monetary' ? 'var(--primary-600)' : 'var(--bg-elevated)',
                  border: `2px solid ${donationType === 'monetary' ? 'var(--primary-500)' : 'var(--border-primary)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: 'var(--text-primary)'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
                <strong>Donación Monetaria</strong>
                <p className="muted" style={{ fontSize: '13px', marginTop: '8px' }}>
                  Contribuye con dinero
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDonationType('inKind')}
                style={{
                  padding: '24px',
                  background: donationType === 'inKind' ? 'var(--primary-600)' : 'var(--bg-elevated)',
                  border: `2px solid ${donationType === 'inKind' ? 'var(--primary-500)' : 'var(--border-primary)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: 'var(--text-primary)'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎁</div>
                <strong>Donación en Especie</strong>
                <p className="muted" style={{ fontSize: '13px', marginTop: '8px' }}>
                  Alimento, medicina, accesorios
                </p>
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Formulario de donación monetaria */}
        {donationType === 'monetary' && (
          <Card>
            <CardBody>
              <h2 className="h2" style={{ marginBottom: '24px' }}>💰 Donación Monetaria</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Montos predefinidos */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ marginBottom: '12px', display: 'block' }}>
                    Selecciona un monto o ingresa uno personalizado
                  </label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    {predefinedAmounts.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmount(amt);
                          setCustomAmount('');
                        }}
                        style={{
                          padding: '16px',
                          background: amount === amt ? 'var(--primary-600)' : 'var(--bg-elevated)',
                          border: `2px solid ${amount === amt ? 'var(--primary-500)' : 'var(--border-primary)'}`,
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '18px',
                          color: 'var(--text-primary)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  <Input
                    type="number"
                    placeholder="Otro monto (MXN)"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount('');
                    }}
                    min="10"
                  />
                </div>

                {/* Información del donante */}
                <div className="row">
                  <Input
                    label="Nombre completo"
                    required
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    placeholder="tu@email.com"
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Input
                    label="Teléfono (opcional)"
                    type="tel"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    placeholder="+52 123 456 7890"
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Textarea
                    label="Mensaje (opcional)"
                    rows="3"
                    value={donorInfo.message}
                    onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                    placeholder="¿Quieres dedicar esta donación a alguien?"
                  />
                </div>

                {/* Resumen */}
                {(amount || customAmount) && (
                  <div style={{
                    marginTop: '24px',
                    padding: '20px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span>Monto a donar:</span>
                      <strong style={{ fontSize: '24px', color: 'var(--primary-500)' }}>
                        ${customAmount || amount} MXN
                      </strong>
                    </div>
                    <p className="muted" style={{ fontSize: '13px' }}>
                      💡 Tu donación es deducible de impuestos
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={loading || (!amount && !customAmount)}
                  style={{ marginTop: '24px', padding: '16px', fontSize: '16px' }}
                >
                  {loading ? '⏳ Procesando...' : '💝 Donar Ahora'}
                </Button>

                <p className="muted" style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
                  🔒 Pago seguro • Aceptamos todas las tarjetas
                </p>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Formulario de donación en especie */}
        {donationType === 'inKind' && (
          <Card>
            <CardBody>
              <h2 className="h2" style={{ marginBottom: '24px' }}>🎁 Donación en Especie</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <Select
                    label="Tipo de artículo"
                    required
                    value={inKindInfo.itemType}
                    onChange={(e) => setInKindInfo({ ...inKindInfo, itemType: e.target.value })}
                  >
                    <option>Alimento</option>
                    <option>Medicina</option>
                    <option>Accesorios</option>
                    <option>Juguetes</option>
                    <option>Camas/Mantas</option>
                    <option>Material de limpieza</option>
                    <option>Otro</option>
                  </Select>

                  <Input
                    label="Cantidad/Peso"
                    required
                    value={inKindInfo.quantity}
                    onChange={(e) => setInKindInfo({ ...inKindInfo, quantity: e.target.value })}
                    placeholder="Ej: 10kg, 5 unidades"
                  />
                </div>

                <div style={{ marginTop: '16px' }}>
                  <Textarea
                    label="Descripción detallada"
                    required
                    rows="4"
                    value={inKindInfo.description}
                    onChange={(e) => setInKindInfo({ ...inKindInfo, description: e.target.value })}
                    placeholder="Describe los artículos que deseas donar..."
                  />
                </div>

                {/* Información del donante */}
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Información de contacto</h3>
                  <div className="row">
                    <Input
                      label="Nombre completo"
                      required
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                      placeholder="Juan Pérez"
                    />
                    <Input
                      label="Email"
                      type="email"
                      required
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <Input
                      label="Teléfono"
                      type="tel"
                      required
                      value={donorInfo.phone}
                      onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                      placeholder="+52 123 456 7890"
                    />
                  </div>
                </div>

                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <p className="muted" style={{ fontSize: '14px', margin: 0 }}>
                    📍 <strong>Punto de recolección:</strong><br />
                    Calle Principal #123, Col. Centro, Ciudad de México<br />
                    Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                    Sábados: 10:00 AM - 2:00 PM
                  </p>
                </div>

                <Button 
                  type="submit" 
                  fullWidth 
                  disabled={loading}
                  style={{ marginTop: '24px', padding: '16px', fontSize: '16px' }}
                >
                  {loading ? '⏳ Procesando...' : '📦 Registrar Donación'}
                </Button>

                <p className="muted" style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
                  Nos pondremos en contacto contigo para coordinar la entrega
                </p>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Información adicional */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <Card>
            <CardBody padding="small">
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏥</div>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Atención Veterinaria</strong>
              <p className="muted" style={{ fontSize: '14px' }}>
                Tus donaciones ayudan a cubrir vacunas, esterilizaciones y tratamientos médicos
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody padding="small">
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🍖</div>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Alimentación</strong>
              <p className="muted" style={{ fontSize: '14px' }}>
                Aseguramos que todas nuestras mascotas tengan alimento de calidad
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody padding="small">
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏠</div>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Refugio</strong>
              <p className="muted" style={{ fontSize: '14px' }}>
                Mantenemos instalaciones seguras y cómodas para los animales
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Estadísticas de impacto */}
        <Card>
          <CardBody>
            <h2 className="h2" style={{ marginBottom: '24px', textAlign: 'center' }}>
              📊 Nuestro Impacto en 2024
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '24px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary-500)' }}>
                  156
                </div>
                <p className="muted">Mascotas rescatadas</p>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--success)' }}>
                  124
                </div>
                <p className="muted">Adopciones exitosas</p>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--warning)' }}>
                  89
                </div>
                <p className="muted">Esterilizaciones</p>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary-500)' }}>
                  32
                </div>
                <p className="muted">Mascotas en refugio</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}