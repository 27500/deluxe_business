import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-dark">
      <div className="footer-grid">
        <div className="footer-col">
          <h4 style={{ color: 'white' }}>Deluxe Boutique</h4>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            L'élégance, la qualité et la satisfaction de nos clients sont au cœur de nos priorités à Kinshasa.
          </p>
        </div>

        <div className="footer-col">
          <h4>Liens Utiles</h4>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/boutique">Boutique</Link></li>
            <li><Link to="/contact">Contact & À Propos</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Kinshasa - RDC</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <MapPin size={16} color="#e11d48" /> Boulevard du 30 Juin, Gombe, Kinshasa
            </li>
            <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Phone size={16} color="#e11d48" /> +243 810 000 000
            </li>
            <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Mail size={16} color="#e11d48" /> contact@deluxeboutique.com
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Deluxe Boutique. Tous droits réservés.</p>
        <Link to="/admin" style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Lock size={12} /> <span style={{ fontSize: '0.75rem' }}>Espace Privé</span>
        </Link>
      </div>
    </footer>
  );
}