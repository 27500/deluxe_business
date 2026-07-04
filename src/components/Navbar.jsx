import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Search } from 'lucide-react';
import { useShop } from '../context/ShopContext'; // <-- Import du Hook

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { cart } = useShop(); // Récupération dynamique du panier

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/boutique?recherche=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/boutique');
    }
  };

  const hasItems = cart.length > 0;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <ShoppingBag color="#2563eb" size={28} />
        Milungu's <span>Business</span>
      </Link>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', flex: '1', maxWidth: '350px', margin: '0 1rem' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="Chercher une veste, chemise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 2.5rem 0.5rem 1rem',
              borderRadius: '50px',
              border: '1px solid #d1d5db',
              outline: 'none'
            }}
          />
          <button type="submit" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <Search size={18} />
          </button>
        </div>
      </form>

      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/boutique">Boutique</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <Link 
        to="/panier" 
        className="cart-btn"
        style={{
          background: hasItems ? '#10b981' : '#eff6ff',
          color: hasItems ? 'white' : '#2563eb',
          transition: 'all 0.3s ease'
        }}
      >
        <ShoppingCart size={20} />
        Panier ({cart.length})
      </Link>
    </nav>
  );
}