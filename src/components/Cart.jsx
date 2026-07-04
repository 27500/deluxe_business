import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Cart() {
  const { cart, removeFromCart, processAction } = useShop();
  const [clientName, setClientName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAction = (index, item, type) => {
    if (!clientName.trim()) {
      alert('Veuillez entrer votre nom ou numéro de téléphone avant de confirmer !');
      return;
    }

    processAction(clientName, item, type);
    removeFromCart(index);

    const actionText = type === 'ACHAT' ? 'acheté' : 'réservé';
    setSuccessMessage(`Félicitations ! Vous avez ${actionText} l'article : ${item.name}. L'administrateur a été notifié !`);
    
    setTimeout(() => setSuccessMessage(''), 6000);
  };

  return (
    <section className="section" style={{ minHeight: '60vh' }}>
      <h2 className="section-title">Votre Panier</h2>

      {/* Message de confirmation */}
      {successMessage && (
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          {successMessage}
        </div>
      )}

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          <ShoppingBag size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Votre panier est actuellement vide</h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Découvrez nos dernières créations et ajoutez des articles à votre panier.</p>
          <Link to="/boutique" className="btn-primary">
            <ArrowLeft size={18} /> Retourner à la boutique
          </Link>
        </div>
      ) : (
        <div>
          {/* Champ d'identification rapide du client */}
          <div style={{ background: '#eff6ff', padding: '1.2rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #bfdbfe' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a8a' }}>
              Pour acheter ou réserver, veuillez entrer votre nom ou numéro de téléphone :
            </label>
            <input 
              type="text"
              placeholder="ex: Blessing ou 0600000000"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #93c5fd', fontSize: '1rem' }}
            />
          </div>

          {/* Liste des articles dans le panier */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cart.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{item.name}</h4>
                    <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{item.price}</span>
                  </div>
                </div>

                {/* Actions du client */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handleAction(index, item, 'ACHAT')}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <CheckCircle size={16} /> Acheter
                  </button>

                  <button 
                    onClick={() => handleAction(index, item, 'RESERVATION')}
                    style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Clock size={16} /> Réserver
                  </button>

                  <button 
                    onClick={() => removeFromCart(index)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    title="Abandonner l'habit"
                  >
                    <Trash2 size={16} /> Abandonner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}