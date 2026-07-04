import React, { useState } from 'react';
import { PlusCircle, Trash2, Package, Lock, Mail, KeyRound, Upload, Link as LinkIcon } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Veste Élégante', price: '4500 fc', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500' },
  { id: 2, name: 'Chemise Slim Fit', price: '25000 fc', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500' },
  { id: 3, name: 'Pantalon Casual', price: '3000 fc', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500' },
];

export default function Admin() {
  // Récupération des notifications en temps réel depuis le ShopContext
  const { notifications } = useShop();

  // --- ÉTATS D'AUTHENTIFICATION OTP ---
  const [authStep, setAuthStep] = useState('LOGIN'); // 'LOGIN' | 'OTP' | 'AUTHENTICATED'
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // --- ÉTATS DU CATALOGUE & FORMULAIRE ---
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageMode, setImageMode] = useState('file'); // 'file' ou 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [imageFilePreview, setImageFilePreview] = useState(null);

  // Simulation : Envoi du code OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Un code de vérification OTP a été envoyé à : ${email}\n(Pour tester immédiatement, tapez : 123456)`);
    setAuthStep('OTP');
  };

  // Simulation : Vérification du code OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode === '123456') {
      setAuthStep('AUTHENTICATED');
    } else {
      alert('Code OTP incorrect. Veuillez réessayer (Code de test : 123456)');
    }
  };

  // Gestion de la sélection d'une image locale (téléphone / PC)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFilePreview(URL.createObjectURL(file));
    }
  };

  // Ajout d'un nouveau produit
  const handleAddProduct = (e) => {
    e.preventDefault();
    const finalImage = imageMode === 'file' ? imageFilePreview : imageUrl;
    
    if (!name || !price || !finalImage) {
      alert('Veuillez remplir tous les champs et fournir une image.');
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: price.includes('DH') ? price : `${price} DH`,
      image: finalImage
    };

    setProducts([newProduct, ...products]);
    setName('');
    setPrice('');
    setImageUrl('');
    setImageFilePreview(null);
  };

  // Suppression d'un produit
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // ==========================================
  // ÉCRAN 1 : SAISIE DE L'EMAIL
  // ==========================================
  if (authStep === 'LOGIN') {
    return (
      <div className="section" style={{ maxWidth: '450px', margin: '4rem auto' }}>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <Lock size={40} color="#2563eb" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Accès Sécurisé</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Veuillez entrer votre email administrateur pour recevoir votre code OTP à usage unique.
          </p>
          <form onSubmit={handleSendOtp} style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label><Mail size={16} /> Email Administrateur</label>
              <input 
                type="email" 
                placeholder="admin@milungubusiness.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Recevoir le code OTP
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // ÉCRAN 2 : SAISIE DU CODE OTP
  // ==========================================
  if (authStep === 'OTP') {
    return (
      <div className="section" style={{ maxWidth: '450px', margin: '4rem auto' }}>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <KeyRound size={40} color="#2563eb" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Vérification OTP</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Code envoyé à <strong>{email}</strong>.
          </p>
          <form onSubmit={handleVerifyOtp} style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label>Code à 6 chiffres</label>
              <input 
                type="text" 
                placeholder="123456" 
                maxLength="6"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}
                required 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Valider et Entrer
            </button>
            <button 
              type="button" 
              onClick={() => setAuthStep('LOGIN')} 
              style={{ width: '100%', background: 'none', border: 'none', color: '#6b7280', marginTop: '1rem', cursor: 'pointer' }}
            >
              Changer d'email
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // ÉCRAN 3 : TABLEAU DE BORD (AUTHENTIFIÉ)
  // ==========================================
  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Panneau d'Administration</h1>
          <p style={{ color: '#6b7280' }}>Connecté en tant que : <strong>{email}</strong></p>
        </div>
        <button 
          onClick={() => { setAuthStep('LOGIN'); setEmail(''); setOtpCode(''); }}
          style={{ padding: '0.5rem 1rem', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Déconnexion
        </button>
      </div>

      {/* --- CENTRE DE NOTIFICATIONS EN DIRECT --- */}
      {notifications && notifications.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '1.2rem', borderRadius: '10px', marginBottom: '2rem' }}>
          <h3 style={{ color: '#92400e', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔔 Notifications de la boutique ({notifications.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                style={{ 
                  background: 'white', 
                  padding: '0.8rem 1rem', 
                  borderRadius: '6px', 
                  borderLeft: notif.type === 'ACHAT' ? '4px solid #10b981' : '4px solid #f59e0b', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <strong style={{ color: '#1f2937' }}>{notif.clientName}</strong> a {notif.type === 'ACHAT' ? 'acheté' : 'réservé'} :{' '}
                  <span style={{ fontWeight: '600', color: '#2563eb' }}>{notif.productName}</span> ({notif.price})
                </div>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>à {notif.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-grid">
        {/* COLONNE GAUCHE : Formulaire d'ajout */}
        <div className="admin-card">
          <h3><PlusCircle size={20} color="#2563eb" /> Ajouter un habit</h3>
          <form onSubmit={handleAddProduct}>
            <div className="form-group">
              <label>Nom de l'habit</label>
              <input 
                type="text" 
                placeholder="ex: Veste en Cuir" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Prix</label>
              <input 
                type="text" 
                placeholder="ex: 10000fc" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required 
              />
            </div>

            {/* SÉLECTEUR DE SOURCE D'IMAGE */}
            <div className="form-group">
              <label>Source de l'image</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', border: '1px solid #d1d5db',
                    background: imageMode === 'file' ? '#eff6ff' : 'white',
                    color: imageMode === 'file' ? '#2563eb' : '#4b5563',
                    fontWeight: imageMode === 'file' ? 'bold' : 'normal',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                  }}
                >
                  <Upload size={16} /> Fichier (Téléphone/PC)
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', border: '1px solid #d1d5db',
                    background: imageMode === 'url' ? '#eff6ff' : 'white',
                    color: imageMode === 'url' ? '#2563eb' : '#4b5563',
                    fontWeight: imageMode === 'url' ? 'bold' : 'normal',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                  }}
                >
                  <LinkIcon size={16} /> Lien en ligne
                </button>
              </div>

              {/* INPUT SI MODE FICHIER */}
              {imageMode === 'file' ? (
                <div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ padding: '0.5rem 0' }}
                  />
                  {imageFilePreview && (
                    <img src={imageFilePreview} alt="Aperçu" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px', marginTop: '0.5rem', border: '1px solid #e5e7eb' }} />
                  )}
                </div>
              ) : (
                /* INPUT SI MODE LIEN EN LIGNE */
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/..." 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              )}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              Publier l'article
            </button>
          </form>
        </div>

        {/* COLONNE DROITE : Catalogue */}
        <div className="admin-card">
          <h3><Package size={20} color="#2563eb" /> Catalogue actuel ({products.length})</h3>
          
          {products.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>Aucun produit dans la boutique.</p>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img src={product.image} alt={product.name} className="admin-item-img" />
                      </td>
                      <td style={{ fontWeight: '600' }}>{product.name}</td>
                      <td style={{ color: '#2563eb', fontWeight: 'bold' }}>{product.price}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="btn-delete"
                        >
                          <Trash2 size={16} /> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}