import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useShop();

  // Calcul du montant total de la commande
  const totalGeneral = cart ? cart.reduce((sum, item) => sum + item.numericPrice, 0) : 0;

  if (!cart || cart.length === 0) {
    return (
      <div className="section" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <ShoppingBag size={64} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Votre panier est vide</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Découvrez nos vêtements exclusifs hommes et femmes disponibles à Kinshasa.</p>
        <Link to="/boutique" className="btn-red" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem' }}>
          <ArrowLeft size={18} /> Retourner à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="section" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>Votre Panier</h1>
        {/* Lien de retour à la boutique premium */}
        <Link to="/boutique" style={{ textDecoration: 'none', color: '#e11d48', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #e11d48', transition: 'all 0.3s' }}>
          <ArrowLeft size={16} /> Continuer les achats
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* LISTE DES ARTICLES */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          {cart.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: index === cart.length - 1 ? 'none' : '1px solid #f1f5f9', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: '80px', height: '90px', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>{item.name}</h3>
                <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#64748b', textTransform: 'uppercase' }}>{item.category}</span>
                <div style={{ fontWeight: 'bold', color: '#e11d48', marginTop: '0.5rem' }}>{item.price}</div>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)} 
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#e11d48'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                title="Supprimer l'article"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', marginTop: '1rem' }}>
            Vider complètement le panier
          </button>
        </div>

        {/* RÉSUMÉ DE LA COMMANDE & TOTAL */}
        <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0', position: 'sticky', top: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>Résumé de la commande</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#64748b' }}>
            <span>Articles ({cart.length})</span>
            <span>{totalGeneral.toLocaleString()} FC</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: '#64748b' }}>
            <span>Livraison (Kinshasa)</span>
            <span style={{ color: '#16a34a', fontWeight: '600' }}>Gratuite</span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', marginBottom: '1.5rem' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>Total à payer :</span>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#e11d48' }}>{totalGeneral.toLocaleString()} FC</span>
          </div>

          <button style={{ width: '100%', background: '#1e293b', color: 'white', border: 'none', padding: '1rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.7rem', transition: 'background 0.2s' }}>
            <CreditCard size={18} /> Passer la commande via WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
}