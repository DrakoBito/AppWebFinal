import { Link } from 'react-router-dom';
import Card, { CardBody } from './Card';
import Badge from './Badge';
import Button from './Button';

export default function PetCard({ pet }) {
  return (
    <Card hover>
      <img src={pet.photos[0]} alt={pet.name} />
      <CardBody>
        <div className="pet-card-header">
          <h3 className="pet-card-title">{pet.name}</h3>
          <Badge variant="success">{pet.status}</Badge>
        </div>
        <p className="pet-card-description">
          {pet.description.length > 100
            ? pet.description.slice(0, 100) + "…"
            : pet.description}
        </p>
        <Link to={`/pets/${pet.id}`}>
          <Button fullWidth style={{ marginTop: '12px' }}>
            Ver detalles →
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
}