import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="section" style={{ paddingBottom: '0' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1e293b' }}>
          L'Élégance à Votre Portée
        </h1>
        <p style={{ color: '#64748b' }}>Affirmez votre personnalité avec nos collections exclusives à Kinshasa.</p>
      </div>

      {/* BANDE DÉFILANTE ENTRE LES COLLECTIONS */}
      <div className="bande-defilante">
        <div className="marquee-content">
          🔥 NOUVEAUTÉS DISPONIBLES EN BOUTIQUE • COLLECTION HOMME RAFFINÉE • STYLE FEMME CHIC & ÉLÉGANT • LIVRAISON PARTOUT À KINSHASA • HABILLEZ-VOUS AVEC CLASSE 🔥
        </div>
      </div>

      <div className="hero-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        
        {/* BLOC STYLE HOMME */}
        <div className="hero-banner-main" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '400px', width: '100%' }}>
          <div style={{ background: 'rgba(255,255,255,0.9)', padding: '2rem', borderRadius: '4px', width: '100%', maxWidth: '320px', margin: 'auto 0 0 0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#e11d48' }}>SÉLECTION PREMIUM</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>Style Homme</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>Vestes, chemises de luxe et pantalons ajustés.</p>
            <Link to="/boutique?categorie=homme" className="btn-red">Voir la collection</Link>
          </div>
        </div>

        {/* BLOC STYLE FEMME */}
        <div className="hero-banner-main" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '400px', width: '100%' }}>
          <div style={{ background: 'rgba(255,255,255,0.9)', padding: '2rem', borderRadius: '4px', width: '100%', maxWidth: '320px', margin: 'auto 0 0 0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#e11d48' }}>TENDANCES MODERNES</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>Style Femme</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>Robes fluides, jupes stylisées et blazers légers.</p>
            <Link to="/boutique?categorie=femme" className="btn-red">Voir la collection</Link>
          </div>
        </div>

      </div>
    </div>
  );
}