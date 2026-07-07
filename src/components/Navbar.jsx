import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Search, Phone, Mail } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const navigate = useNavigate();
  const { cart } = useShop();

  const handleSearch = (e) => {
    e.preventDefault();
    let url = '/boutique?';
    if (searchTerm.trim()) url += `recherche=${encodeURIComponent(searchTerm)}&`;
    if (selectedCategory !== 'tous') url += `categorie=${selectedCategory}`;
    navigate(url);
  };

  return (
    <header>
      {/* 1. TOP BAR */}
      <div className="top-bar">
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span><Phone size={12} style={{ marginRight: '4px' }} /> +243 810 000 000</span>
          <span><Mail size={12} style={{ marginRight: '4px' }} /> contact@deluxeboutique.com</span>
        </div>
        {/* L'espace Connexion/Inscription a été totalement retiré d'ici */}
      </div>

      {/* 2. MAIN HEADER */}
      <div className="main-header">
        <Link to="/" className="logo">
          <ShoppingBag color="#e11d48" size={32} />
          Deluxe <span>Boutique</span>
        </Link>

        <form onSubmit={handleSearch} className="search-bar-classic">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="tous">Toutes catégories</option>
            <option value="homme">Hommes</option>
            <option value="femme">Femmes</option>
          </select>
          <input
            type="text"
            placeholder="Chercher un vêtement, une chemise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* 3. NAV BAR */}
      <nav className="nav-bar-dark">
        <Link to="/">Accueil</Link>
        <Link to="/boutique?categorie=homme">Collection Hommes</Link>
        <Link to="/boutique?categorie=femme">Collection Femmes</Link>
        <Link to="/boutique">Boutique Complète</Link>
        <Link to="/contact">Contact & À Propos</Link>
      </nav>
    </header>
  );
}