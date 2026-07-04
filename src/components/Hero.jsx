import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero">
      <h1>Style & Performance</h1>
      <p>L'élégance et le confort conçus spécialement pour vous.</p>
      <Link to="/boutique" className="btn-primary">
        Découvrir la Boutique <ArrowRight size={20} />
      </Link>
    </section>
  );
}