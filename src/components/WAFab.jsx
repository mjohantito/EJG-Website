import { useMatch } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Icon from './Icon';

export default function WAFab() {
  const { openTrips, glampings, whatsapp } = useData();
  const tripMatch = useMatch('/trips/:id');
  const glampMatch = useMatch('/glamping/:id');

  let message = 'Halo EJG! Mau tanya tentang trip nih.';
  if (tripMatch) {
    const trip = openTrips.find(t => t.id === tripMatch.params.id);
    if (trip) message = `Halo EJG! Mau nanya trip ${trip.dest} nih.`;
  } else if (glampMatch) {
    const g = glampings.find(g => g.id === glampMatch.params.id);
    if (g) message = `Halo EJG! Mau nanya glamping ${g.name} nih.`;
  }

  const href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <a className="wa-fab" href={href} target="_blank" rel="noreferrer" aria-label="Chat WhatsApp">
      <Icon name="wa" className="ic" />
      <span className="fab-label">Chat WA</span>
    </a>
  );
}
