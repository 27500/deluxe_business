import React, { useState } from 'react';
import { PlusCircle, Trash2, ShieldAlert, KeyRound, Mail, ArrowRight, Shirt, Scissors } from 'lucide-react';
import { useShop } from '../context/ShopContext';

// --- ICÔNES SVG PERSONNALISÉES POUR LE LOOK ATELIER DE MODE ---
const PantsIcon = ({ className, size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
    <path d="M6 2h12v5l-1.5 15h-4.5v-9h-2v9H5.5L4 7V2h2z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DressIcon = ({ className, size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
    <path d="M9 2h6l3 4-2.5 5 4 11H4.5l4-11L6 6l3-2z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Admin() {
  const { products, addProduct, deleteProduct } = useShop();

  // --- ÉTATS D'AUTHENTIFICATION ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [isLampOn, setIsLampOn] = useState(false); // Éteint par défaut (Noir total)
  const [authError, setAuthError] = useState('');

  // --- ÉTATS DU FORMULAIRE PRODUIT ---
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('homme');
  const [desc, setDesc] = useState('');
  const [sizes, setSizes] = useState('');
  const [colors, setColors] = useState('');
  const [imageType, setImageType] = useState('url'); 
  const [imageUrl, setImageUrl] = useState('');
  const [imageFileString, setImageFileString] = useState('');

  // --- LOGIQUE OTP ---
  const handleRequestOtp = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setAuthError("Veuillez entrer un e-mail valide.");
      return;
    }
    setAuthError('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (userOtpInput === generatedOtp) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError("Code OTP incorrect.");
    }
  };

  // --- LOGIQUE PRODUITS ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageFileString(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !desc) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }
    const finalImage = imageType === 'url' ? imageUrl : imageFileString;
    if (!finalImage) {
      alert("Veuillez ajouter une photo.");
      return;
    }

    const newClothes = {
      id: Date.now(),
      name,
      price: `${Number(price).toLocaleString()} FC`,
      numericPrice: Number(price),
      category,
      image: finalImage,
      desc,
      sizes: sizes ? sizes.split(',').map(s => s.trim().toUpperCase()) : ['Unique'],
      colors: colors ? colors.split(',').map(c => c.trim()) : ['Multicolore']
    };

    addProduct(newClothes);
    setName(''); setPrice(''); setDesc(''); setSizes(''); setColors(''); setImageUrl(''); setImageFileString('');
    alert("Vêtement ajouté au catalogue !");
  };

  // ==========================================
  // RENDER 1 : LE CONCEPT "CUTE LAMP LOGIN" INSTAGRAM
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        background: '#070708', // Fond ultra noir (ambiance nuit)
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        overflow: 'hidden',
        fontFamily: 'sans-serif'
      }}>
        
        {/* --- STYLES CSS POUR LES ANIMATIONS ET LA LAMPE --- */}
        <style>{`
          @keyframes floatFashion {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0.02; }
            50% { transform: translateY(-20px) rotate(6deg); opacity: 0.06; }
            100% { transform: translateY(0px) rotate(0deg); opacity: 0.02; }
          }
          .floating-clothing { position: absolute; color: #ffffff; pointer-events: none; animation: floatFashion 6s ease-in-out infinite; }

          /* Conteneur principal Scène Lampe + Formulaire */
          .auth-scene-container {
            display: flex; align-items: center; justify-content: center; gap: 5rem;
            max-width: 900px; width: 100%; z-index: 10;
          }

          /* --- REPRODUCTION DE LA CUTE DESK LAMP --- */
          .desk-lamp-wrapper { display: flex; flex-direction: column; align-items: center; cursor: pointer; position: relative; }
          
          /* Tête / Abat-jour de la lampe */
          .cute-shade {
            width: 110px; height: 95px; 
            background: ${isLampOn ? '#a7f3d0' : '#2d3748'}; 
            border-radius: 50px 50px 15px 15px;
            position: relative; transition: background 0.3s ease, box-shadow 0.3s ease;
            box-shadow: ${isLampOn ? '0 0 30px rgba(167, 243, 208, 0.6)' : 'none'};
            display: flex; align-items: center; justify-content: center;
          }

          /* Le petit visage mignon sur la lampe */
          .lamp-face { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 15px; }
          .lamp-eyes { display: flex; gap: 30px; }
          .lamp-eye { width: 8px; height: 8px; background: #1a202c; border-radius: 50%; }
          .lamp-mouth { width: 14px; height: 8px; border: 2.5px solid #1a202c; border-top: none; border-radius: 0 0 10px 10px; }

          /* Pied / Tige de la lampe */
          .cute-rod { width: 6px; height: 100px; background: ${isLampOn ? '#cbd5e1' : '#4a5568'}; transition: background 0.3s; }
          
          /* Socle de la lampe */
          .cute-base { width: 90px; height: 14px; background: ${isLampOn ? '#cbd5e1' : '#4a5568'}; border-radius: 10px; transition: background 0.3s; }

          /* Faisceau lumineux directionnel de la petite lampe */
          .desk-light-beam {
            position: absolute; top: 90px; left: 55px; width: 450px; height: 320px;
            background: linear-gradient(135deg, rgba(167, 243, 208, 0.12), rgba(167, 243, 208, 0));
            clip-path: polygon(0 0, 100% 30%, 100% 100%, 0 80%);
            opacity: ${isLampOn ? 1 : 0}; transition: opacity 0.4s ease; pointer-events: none; z-index: 1;
          }

          /* --- CARTE DE CONNEXION SOMBRE LOOK INSTAGRAM --- */
          .instagram-dark-card {
            background: #121214; width: 100%; max-width: 370px; padding: 2.5rem;
            border-radius: 16px; border: 1px solid ${isLampOn ? 'rgba(74, 222, 128, 0.4)' : '#1f1f23'};
            
            /* Cache complètement ou révèle la carte selon la lumière */
            opacity: ${isLampOn ? 1 : 0};
            visibility: ${isLampOn ? 'visible' : 'hidden'};
            transform: ${isLampOn ? 'translateX(0px)' : 'translateX(40px)'};
            box-shadow: ${isLampOn ? '0 0 40px rgba(74, 222, 128, 0.15)' : 'none'};
            pointer-events: ${isLampOn ? 'auto' : 'none'};
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .insta-input-box {
            width: 100%; padding: 0.8rem 0.8rem 0.8rem 2.5rem; background: #1a1a1e;
            border: 1px solid #2a2a32; color: #ffffff; border-radius: 8px; outline: none; transition: border-color 0.3s;
          }
          .insta-input-box:focus { border-color: #22c55e; }

          .btn-insta-green {
            width: 100%; padding: 0.85rem; background: #22c55e; color: #ffffff;
            border: none; border-radius: 8px; font-weight: bold; cursor: pointer;
            transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          }
          .btn-insta-green:hover { background: #16a34a; }
        `}</style>

        {/* --- HABITS EN ARRIÈRE-PLAN --- */}
        <Shirt className="floating-clothing" size={100} style={{ top: '10%', left: '12%', animationDelay: '0s' }} />
        <PantsIcon className="floating-clothing" size={85} style={{ bottom: '15%', left: '20%', animationDelay: '1.5s' }} />
        <DressIcon className="floating-clothing" size={95} style={{ top: '15%', right: '15%', animationDelay: '3s' }} />
        <Scissors className="floating-clothing" size={60} style={{ bottom: '20%', right: '25%', animationDelay: '4.5s' }} />

        {/* --- ESPACE INTERACTIF : LAMPE À GAUCHE, FORMULAIRE À DROITE --- */}
        <div className="auth-scene-container">
          
          {/* LA PETITE LAMPE DE BUREAU */}
          <div className="desk-lamp-wrapper" onClick={() => setIsLampOn(!isLampOn)} title="Clique sur la lampe pour allumer">
            <div className="cute-shade">
              <div className="lamp-face">
                <div className="lamp-eyes">
                  <div className="lamp-eye"></div>
                  <div className="lamp-eye"></div>
                </div>
                <div className="lamp-mouth"></div>
              </div>
            </div>
            <div className="cute-rod"></div>
            <div className="cute-base"></div>
            
            {/* RAYON LUMINEUX VERS LA DROITE */}
            <div className="desk-light-beam"></div>
          </div>

          {/* LE FORMULAIRE STYLE GLOW NEON (RÉVÉLÉ UNIQUEMENT PAR LA LAMPE) */}
          <div className="instagram-dark-card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 'bold', m: 0 }}>Welcome Back</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.4rem' }}>Connectez-vous pour gérer les collections</p>
            </div>

            {authError && (
              <div style={{ padding: '0.6rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1.2rem', textAlign: 'center' }}>
                {authError}
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Username or Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#4b5563" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@milungu.com" 
                      className="insta-input-box"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-insta-green">
                  Login <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '0.8rem', borderRadius: '6px', color: '#4ade80', fontSize: '0.8rem', textAlign: 'center' }}>
                  🔑 Code OTP généré pour la session : <br />
                  <span style={{ fontFamily: 'monospace', fontWeight: '900', fontSize: '1.1rem', color: '#ffffff' }}>{generatedOtp}</span>
                </div>

                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Password / OTP Code</label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} color="#4b5563" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      maxLength="6"
                      required
                      value={userOtpInput}
                      onChange={(e) => setUserOtpInput(e.target.value)}
                      placeholder="------" 
                      className="insta-input-box"
                      style={{ letterSpacing: '4px', textAlign: 'center', fontWeight: 'bold' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-insta-green">
                  Vérifier et Entrer
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 2 : LE TABLEAU DE BORD (ACCESSIBLE APRÈS CONNEXION)
  // ==========================================
  return (
    <div className="section" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ background: '#fff3f5', border: '1px solid #fecdd3', padding: '1rem', borderRadius: '8px', display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '2rem', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <ShieldAlert color="#e11d48" />
          <span style={{ fontSize: '0.9rem', color: '#9f1239', fontWeight: '600' }}>
            Session Administrateur Active — {email}
          </span>
        </div>
        <button 
          onClick={() => { setIsAuthenticated(false); setOtpSent(false); setUserOtpInput(''); setIsLampOn(false); }}
          style={{ background: '#e11d48', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Déconnexion
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* FORMULAIRE D'AJOUT VÊTEMENTS */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e293b' }}>Ajouter un Vêtement</h3>
          
          <form onSubmit={handleSubmitProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' }}>Nom du modèle</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Robe Soie Émeraude" style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' }}>Prix (en FC)</label>
                <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 95000" style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' }}>Rayon</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white' }}>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' }}>Description textile complète</label>
              <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Détails du tissu, coupe..." rows="3" style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'none' }}></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' }}>Tailles (Ex: S, M, L)</label>
                <input type="text" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="Séparées par des virgules" style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' }}>Couleurs (Ex: Bleu, Vert)</label>
                <input type="text" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Séparées par des virgules" style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '6px', background: '#f8fafc' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Image de la tenue</label>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" checked={imageType === 'url'} onChange={() => setImageType('url')} /> URL Web
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="radio" checked={imageType === 'file'} onChange={() => setImageType('file')} /> Charger le fichier
                </label>
              </div>

              {imageType === 'url' ? (
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://lien-image.com" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ fontSize: '0.85rem' }} />
                  {imageFileString && <span style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: '600' }}>✓ Prêt</span>}
                </div>
              )}
            </div>

            <button type="submit" className="btn-red" style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
              <PlusCircle size={18} /> Publier le modèle
            </button>
          </form>
        </div>

        {/* LISTE DES ARTICLES EN DIRECT */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e293b' }}>Articles en vitrine ({products.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '560px', overflowY: 'auto' }}>
            {products.map(product => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <img src={product.image} alt="" style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>{product.name}</div>
                    <span style={{ fontSize: '0.7rem', background: '#cbd5e1', padding: '2px 6px', borderRadius: '3px', marginRight: '6px', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
                    <span style={{ fontSize: '0.85rem', color: '#e11d48', fontWeight: '700' }}>{product.price}</span>
                  </div>
                </div>
                <button onClick={() => deleteProduct(product.id)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = '#e11d48'} onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}