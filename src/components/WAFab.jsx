import { useMatch } from 'react-router-dom';
import { WHATSAPP, UPCOMING_OPEN_TRIPS, GLAMPINGS } from '../data';
import Icon from './Icon';

export default function WAFab() {
  const tripMatch = useMatch('/trips/:id');
  const glampMatch = useMatch('/glamping/:id');

  let message = 'Halo EJG! Mau tanya tentang trip nih.';
  if (tripMatch) {
    const trip = UPCOMING_OPEN_TRIPS.find(t => t.id === tripMatch.params.id);
    if (trip) message = `Halo EJG! Mau nanya trip ${trip.dest} nih.`;
  } else if (glampMatch) {
    const g = GLAMPINGS.find(g => g.id === glampMatch.params.id);
    if (g) message = `Halo EJG! Mau nanya glamping ${g.name} nih.`;
  }

  const href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

  return (
    <a className="wa-fab" href={href} target="_blank" rel="noreferrer" aria-label="Chat WhatsApp">
      <Icon name="wa" className="ic" />
      <span className="fab-label">Chat WA</span>
    </a>
  );
}
