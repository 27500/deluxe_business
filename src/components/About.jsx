import React from 'react';
import { Award, ShieldCheck, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="section">
      <div className="about-hero" style={{ padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Qui Sommes-Nous ?</h1>
      </div>

      {/* VOTRE TEXTE PERSONNALISÉ INTÉGRÉ ICI */}
      <div className="about-card" style={{ marginBottom: '3rem', borderLeft: '5px solid #e11d48' }}>
        <p style={{ color: '#1e293b', fontSize: '1.2rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
          <strong>Deluxe Boutique ✨</strong> {"\n"}
          Votre destination mode pour des vêtements tendance, élégants et de qualité. Découvrez une sélection unique de tenues pour hommes et femmes, ainsi que des accessoires qui sublimeront votre style. Chez Deluxe Boutique, l'élégance, la qualité et la satisfaction de nos clients sont au cœur de nos priorités. Habillez-vous avec classe, affirmez votre personnalité.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#e11d48' }}>Élégance</h4>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Des designs pensés pour vous faire briller en toutes circonstances.</p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#e11d48' }}>Qualité</h4>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Des textiles rigoureusement sélectionnés pour leur durabilité.</p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#e11d48' }}>Satisfaction</h4>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Un accueil et un service client irréprochables.</p>
        </div>
      </div>
    </div>
  );
}