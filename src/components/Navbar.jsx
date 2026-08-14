import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Search, Phone, Mail } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // On récupère uniquement setActiveCategory du contexte
  const { cart, setActiveCategory } = useShop() || { cart: [], setActiveCategory: () => {} };

  const handleSearch = (e) => {
    e.preventDefault();
    let url = '/boutique?';
    if (searchTerm.trim()) {
      url += `recherche=${encodeURIComponent(searchTerm)}`;
    }
    navigate(url);
  };

  return (
    <header>
      {/* 1. TOP BAR - Ton style intact */}
      <div className="top-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span><Phone size={12} style={{ marginRight: '4px' }} /> +243 810 000 000</span>
          <span><Mail size={12} style={{ marginRight: '4px' }} /> contact@deluxeboutique.com</span>
        </div>
      </div>

      {/* 2. MAIN HEADER - Ton style intact */}
      <div className="main-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/" className="logo">
          <ShoppingBag color="#e11d48" size={32} />
          Deluxe <span>Boutique</span>
        </Link>

        <form onSubmit={handleSearch} className="search-bar-classic" style={{ flex: 1, minWidth: '260px', display: 'flex' }}>
          <input
            type="text"
            placeholder="Chercher un vêtement, une chemise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit"><Search size={18} /></button>
        </form>

        <Link to="/panier" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#333', fontWeight: 'bold' }}>
          <div style={{ position: 'relative' }}>
            <ShoppingCart size={26} color="#e11d48" />
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#333', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cart ? cart.length : 0}
            </span>
          </div>
          <span>Panier</span>
        </Link>
      </div>

      {/* 3. NAV BAR - Ton style intact avec la logique ajoutée */}
      <nav className="nav-bar-dark" style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', gap: '1.5rem' }}>
        <Link to="/" onClick={() => setActiveCategory('all')}>Accueil</Link>
        
        {/* Ajout du onClick pour filtrer */}
        <Link to="/boutique" onClick={() => setActiveCategory('homme')}>Collection Hommes</Link>
        <Link to="/boutique" onClick={() => setActiveCategory('femme')}>Collection Femmes</Link>
        
        <Link to="/boutique" onClick={() => setActiveCategory('all')}>Boutique Complète</Link>
        <Link to="/contact">Contact & À Propos</Link>
      </nav>
    </header>
  );
}