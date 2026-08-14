import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, ShieldAlert, KeyRound, Mail, ArrowRight, ShoppingBag, LogOut, Loader2, Sparkles, Eye, X, ChevronLeft, ChevronRight, Plus, Minus, FileImage } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Admin() {
  const { products, addProduct, deleteProduct } = useShop();
  const navigate = useNavigate();

  // ÉTATS D'AUTHENTIFICATION PERSISTANTS (via localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('deluxe_admin_auth') === 'true';
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('deluxe_admin_email') || '';
  });

  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // États du formulaire catalogue
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('homme');
  const [desc, setDesc] = useState('');
  const [sizes, setSizes] = useState('');
  const [colors, setColors] = useState('');
  
  // NOUVEAU : États pour la gestion des messages du formulaire (Succès / Erreur)
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Image principale (Fichier local par défaut désormais)
  const [imageFileString, setImageFileString] = useState('');
  
  // Tableau dynamique stockant les chaînes Base64 des fichiers locaux secondaires
  const [secondaryImages, setSecondaryImages] = useState([]);

  // États pour la Modal d'Aperçu Fiche
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Gestion des champs de fichiers locaux dynamiques
  const handleAddPhotoField = () => {
    setSecondaryImages([...secondaryImages, '']); // Ajoute un emplacement vide pour le nouveau fichier
  };

  const handleSecondaryFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedImages = [...secondaryImages];
        updatedImages[index] = reader.result; // Stocke la chaîne Base64 du fichier
        setSecondaryImages(updatedImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhotoField = (index) => {
    const updatedImages = secondaryImages.filter((_, i) => i !== index);
    setSecondaryImages(updatedImages);
  };

  // Demande d'OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    const formattedEmail = email.trim().toLowerCase();
    const allowedAdmins = ['blessingmingenge@gmail.com', 'nathanmilungu@gmail.com'];

    if (!formattedEmail || !formattedEmail.includes('@')) {
      setAuthError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    if (!allowedAdmins.includes(formattedEmail)) {
      setAuthError("Accès refusé. Cette adresse e-mail n'est pas autorisée.");
      return;
    }

    setIsSendingOtp(true);
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formattedEmail, otp: randomOtp }),
      });
      setGeneratedOtp(randomOtp);
      setOtpSent(true);
    } catch (error) {
      console.error("Erreur backend lors de l'envoi de l'OTP, bascule en mode local simulation :", error);
      setGeneratedOtp(randomOtp);
      setOtpSent(true);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Validation OTP et sauvegarde de la session
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (userOtpInput === generatedOtp) {
      setIsAuthenticated(true);
      setAuthError('');
      // Sauvegarde dans le localStorage pour éviter la déconnexion au rafraîchissement
      localStorage.setItem('deluxe_admin_auth', 'true');
      localStorage.setItem('deluxe_admin_email', email.trim().toLowerCase());
    } else {
      setAuthError("Le code OTP entré est incorrect.");
    }
  };

  // Déconnexion manuelle
  const handleLogoutClick = () => {
    setIsAuthenticated(false);
    setOtpSent(false);
    setUserOtpInput('');
    // Nettoyage complet du localStorage
    localStorage.removeItem('deluxe_admin_auth');
    localStorage.removeItem('deluxe_admin_email');
  };

  // Upload image principale
  const handleMainFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageFileString(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Soumission finale de l'article avec sa galerie de fichiers
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      if (!name || !price || !desc) {
        setFormError("⚠️ Veuillez remplir tous les champs obligatoires.");
        return;
      }
      
      if (!imageFileString) {
        setFormError("⚠️ Veuillez ajouter une photo principale.");
        return;
      }

      // Filtrer uniquement les photos secondaires valides
      const cleanSecondaryImages = secondaryImages.filter(imgBase64 => imgBase64 && imgBase64.length > 0);

      const newClothes = {
        name,
        price: `${Number(price).toLocaleString()} FC`,
        price_fc: Number(price),
        category,
        image: imageFileString,
        image_url: imageFileString,
        images: [imageFileString, ...cleanSecondaryImages], // Fusionne la principale et les fichiers secondaires
        desc,
        description: desc,
        sizes: sizes ? sizes.split(',').map(s => s.trim().toUpperCase()) : ['Unique'],
        colors: colors ? colors.split(',').map(c => c.trim()) : ['Multicolore']
      };

      await addProduct(newClothes);
      
      // Réinitialisation des états du formulaire
      setName(''); 
      setPrice(''); 
      setDesc(''); 
      setSizes(''); 
      setColors(''); 
      setImageFileString(''); 
      setSecondaryImages([]);
      
      // Message de succès UI dynamique
      setFormSuccess("🎉 Article et sa galerie de fichiers enregistrés avec succès !");
    } catch (error) {
      setFormError("⚠️ Erreur lors de la publication : " + error.message);
    }
  };

  const labelStyle = { display: 'block', fontSize: '0.72rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' };
  const inputStyle = { width: '100%', padding: '0.75rem 1rem', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.88rem', color: '#0f172a', outline: 'none', transition: 'border-color 0.2s' };

  // ÉCRAN DE CONNEXION (Affiché uniquement si non connecté)
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', backgroundColor: '#f8fafc', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', backgroundColor: '#fff1f2', color: '#e11d48', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShoppingBag size={24} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0' }}>Deluxe Boutique</h2>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', marginBottom: '2rem' }}>Connexion Administration</p>
          
          {authError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '1.25rem', textAlign: 'left' }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{authError}</span>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
              <div>
                <label style={labelStyle}>Adresse Email Admin</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@deluxeboutique.com" style={{ ...inputStyle, paddingLeft: '2.5rem' }} />
                </div>
              </div>
              <button type="submit" disabled={isSendingOtp} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.8rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', backgroundColor: '#e11d48', border: 'none', cursor: 'pointer' }}>
                {isSendingOtp ? <Loader2 size={16} className="animate-spin" /> : <>Recevoir le code <ArrowRight size={16} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
              <div>
                <label style={labelStyle}>Code de validation</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input type="text" maxLength="6" required value={userOtpInput} onChange={(e) => setUserOtpInput(e.target.value)} placeholder="------" style={{ ...inputStyle, paddingLeft: '2.5rem', textAlign: 'center', letterSpacing: '0.2em', fontWeight: '700' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button type="submit" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', backgroundColor: '#16a34a', border: 'none', cursor: 'pointer' }}>
                  Valider l'accès
                </button>
                <button type="button" onClick={() => setOtpSent(false)} style={{ fontSize: '0.75rem', color: '#64748b', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                  Retour
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ÉCRAN PRINCIPAL DE L'ESPACE ADMIN (Persistant)
  return (
    <div style={{ maxWidth: '760px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif', color: '#0f172a' }}>
      
      {/* Barre de Session Connectée */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '0.85rem 1.25rem', borderRadius: '14px', marginBottom: '2rem', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#94a3b8' }}>
            Connecté en tant que : <strong style={{ color: '#ffffff' }}>{email}</strong>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate('/messages-admin')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ffffff', border: 'none', color: '#0f172a', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
            <Mail size={12} /> Messages
          </button>
          <button onClick={handleLogoutClick} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#e11d48', border: 'none', color: '#ffffff', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
            <LogOut size={12} /> Déconnexion
          </button>
        </div>
      </div>

      {/* FORMULAIRE DE PUBLICATION */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <Sparkles size={18} style={{ color: '#e11d48' }} />
          <h2 style={{ fontSize: '1.05rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0' }}>
            Ajouter une pièce au catalogue
          </h2>
        </div>

        {formError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '0.85rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: '500' }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '0.85rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: '600' }}>
            <Sparkles size={16} style={{ flexShrink: 0, color: '#16a34a' }} />
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Nom de l'habit *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Chemise Lin Premium" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Prix en Franc Congolais (FC) *</label>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 85000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Rayon / Catégorie *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="mixte">Mixte</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description détaillée *</label>
            <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Matière, coupe, conseils d'entretien..." rows="3" style={{ ...inputStyle, resize: 'none' }}></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Tailles (Séparées par des virgules)</label>
              <input type="text" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="Ex: S, M, L, XL (Ou laisser vide)" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Couleurs (Séparées par des virgules)</label>
              <input type="text" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Ex: Blanc, Bleu Ciel (Ou laisser vide)" style={inputStyle} />
            </div>
          </div>

          {/* ZONE D'UPLOAD DE FICHIERS DYNAMIQUE */}
          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* 1. Fichier image principale */}
            <div>
              <span style={{ ...labelStyle, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FileImage size={14} style={{ color: '#e11d48' }} /> Photo Principale (Couverture) *
              </span>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.4rem' }}>
                <input type="file" accept="image/*" required={!imageFileString} onChange={handleMainFileUpload} style={{ fontSize: '0.82rem', color: '#475569', flex: 1 }} />
                {imageFileString && (
                  <img src={imageFileString} alt="Aperçu principal" style={{ width: '48px', height: '58px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                )}
              </div>
            </div>

            {/* 2. Liste dynamique d'uploads de fichiers pour les photos secondaires */}
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ ...labelStyle, color: '#0f172a', margin: 0 }}>
                  🖼️ Galerie Photos Secondaires ({secondaryImages.length})
                </span>
                <button 
                  type="button" 
                  onClick={handleAddPhotoField}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.8rem', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  <Plus size={12} style={{ color: '#e11d48' }} /> Ajouter une vue photo
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {secondaryImages.map((imgBase64, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', backgroundColor: '#ffffff', padding: '0.6rem 0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', minWidth: '55px' }}>
                      Vue N°{index + 2}
                    </span>
                    
                    <input 
                      type="file" 
                      accept="image/*"
                      required
                      onChange={(e) => handleSecondaryFileUpload(index, e)} 
                      style={{ fontSize: '0.8rem', color: '#475569', flex: 1 }} 
                    />

                    {imgBase64 && (
                      <img 
                        src={imgBase64} 
                        alt="" 
                        style={{ width: '36px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
                      />
                    )}

                    <button 
                      type="button" 
                      onClick={() => handleRemovePhotoField(index)}
                      style={{ padding: '0.5rem', backgroundColor: '#fee2e2', border: 'none', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '0.9rem', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(15,23,42,0.15)', marginTop: '0.5rem' }}>
            <PlusCircle size={18} style={{ color: '#e11d48' }} /> Publier le produit sur la boutique
          </button>
        </form>
      </div>

      {/* LISTE DE GESTION ET COMPOSANT D'APERÇU DIRECT */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1.25rem 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          Vitrine en Direct ({products?.length || 0})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto' }}>
          {(!products || products.length === 0) ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', padding: '2rem 0' }}>Aucune pièce en ligne.</p>
          ) : (
            products.map(product => (
              <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={product.image} alt="" style={{ width: '44px', height: '54px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <div>
                    <h4 style={{ margin: '0', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{product.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#e11d48', fontWeight: '800' }}>{product.price}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    onClick={() => { setSelectedProduct(product); setActiveImgIndex(0); }}
                    style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer', padding: '0.45rem 0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: '600' }}
                  >
                    <Eye size={14} /> Aperçu Fiche
                  </button>
                  <button onClick={() => deleteProduct(product.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DOCK POPUP APERÇU FICHE */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '640px', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#0f172a', border: 'none', color: '#ffffff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
              <X size={16} />
            </button>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ flex: 1, backgroundColor: '#f8fafc', position: 'relative', minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(() => {
                  const gallery = selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.image];
                  return (
                    <>
                      <img src={gallery[activeImgIndex]} alt="" style={{ width: '100%', height: '100%', minHeight: '340px', maxHeight: '420px', objectFit: 'cover' }} />
                      {gallery.length > 1 && (
                        <>
                          <button onClick={() => setActiveImgIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))} style={{ position: 'absolute', left: '0.75rem', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={18} /></button>
                          <button onClick={() => setActiveImgIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))} style={{ position: 'absolute', right: '0.75rem', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={18} /></button>
                          <span style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: '10px', fontWeight: '700' }}>{activeImgIndex + 1} / {gallery.length}</span>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
              <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '800' }}>Rayon {selectedProduct.category}</span>
                  <h3 style={{ margin: '0.75rem 0 0.25rem 0', fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>{selectedProduct.name}</h3>
                  <div style={{ fontSize: '1.2rem', color: '#e11d48', fontWeight: '900', marginBottom: '1.25rem' }}>{selectedProduct.price}</div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5' }}>{selectedProduct.desc}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}>Fermer l'aperçu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}