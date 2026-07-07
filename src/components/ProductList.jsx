import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Star, Shirt, Eye, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

// Liste fixe des vêtements les mieux notés pour la barre latérale
const TOP_RATED_CLOTHES = [
  { id: 101, name: 'Chemise Oxford Bleue', price: '75.000 FC', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ce3?w=500' },
  { id: 102, name: 'Blouse en Soie Légère', price: '85.000 FC', image: 'https://images.unsplash.com/photo-1548624149-f7b31662df4b?w=500' }
];

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('recherche') || '';
  const categoryFilter = searchParams.get('categorie') || 'tous';
  
  // Récupération des produits et de l'action d'ajout au panier depuis le contexte global
  const { products, addToCart } = useShop();
  
  // États pour le filtrage, le tri et la modale de détails
  const [priceLimit, setPriceLimit] = useState(300000); // Limite maximale par défaut à 300.000 FC
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- LOGIQUE DE FILTRAGE EN TEMPS RÉEL ---
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'tous' || product.category === categoryFilter;
    const matchesPrice = product.numericPrice <= priceLimit;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // --- LOGIQUE DE TRI ---
  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.numericPrice - b.numericPrice);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.numericPrice - a.numericPrice);
  }

  return (
    <section className="shop-layout" style={{ position: 'relative' }}>
      
      {/* ZONE PRINCIPALE : GRILLE DES VÊTEMENTS (GAUCHE) */}
      <div className="shop-main">
        <div className="shop-header">
          <div className="shop-header-title">
            Rayon : <span style={{ fontWeight: 'bold', color: '#e11d48', textTransform: 'uppercase' }}>{categoryFilter === 'tous' ? 'Sélection Globale' : categoryFilter}</span> 
            {filteredProducts.length > 0 && ` (${filteredProducts.length} articles trouvés)`}
          </div>
          
          <div className="shop-sort">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Tri par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <Shirt size={48} style={{ marginBottom: '1rem', color: '#cbd5e1' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Aucun vêtement ne correspond à vos critères ou à ce budget.</p>
          </div>
        ) : (
          <div className="grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <img src={product.image} alt={product.name} style={{ height: '280px', objectFit: 'cover', width: '100%' }} />
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="card-title" style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>{product.name}</div>
                    <div className="card-price" style={{ color: '#e11d48', fontWeight: '800', fontSize: '1.1rem', marginBottom: '1rem' }}>{product.price}</div>
                  </div>
                  
                  {/* Actions de la carte */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setSelectedProduct(product)} 
                      style={{ flex: 1, background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '0.6rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: '600', fontSize: '0.85rem' }}
                    >
                      <Eye size={14} /> Détails
                    </button>
                    <button 
                      onClick={() => addToCart(product)} 
                      className="btn-red" 
                      style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Ajouter au panier"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BARRE LATÉRALE : FILTRES & RECOMMANDATIONS (DROITE) */}
      <aside className="sidebar">
        
        {/* Filtre Curseur de Budget Dynamique */}
        <div className="sidebar-widget" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div className="sidebar-title" style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Budget Maximum</div>
          <input 
            type="range" 
            min="40000" 
            max="500000" 
            step="5000"
            value={priceLimit} 
            onChange={(e) => setPriceLimit(Number(e.target.value))}
            style={{ width: '100%', marginTop: '1rem', cursor: 'pointer' }}
          />
          <div style={{ marginTop: '0.7rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: '#64748b' }}>Limite :</span>
            <span style={{ fontWeight: '800', color: '#e11d48' }}>{priceLimit.toLocaleString()} FC</span>
          </div>
        </div>

        {/* Liste des articles les mieux notés */}
        <div className="sidebar-widget" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div className="sidebar-title" style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Les Mieux Notés</div>
          <div className="top-rated-list" style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {TOP_RATED_CLOTHES.map(product => (
              <div key={product.id} className="mini-product" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <img src={product.image} alt={product.name} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                <div className="mini-product-info">
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', margin: 0, color: '#1e293b' }}>{product.name}</h4>
                  <div className="stars" style={{ display: 'flex', gap: '1px', margin: '2px 0' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#fbbf24" stroke="none" />)}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#e11d48' }}>{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* --- FENÊTRE MODALE : DÉTAILS COMPLETS DU VÊTEMENT --- */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: '1rem' }}>
          <div style={{ background: 'white', maxWidth: '650px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            {/* Bouton Fermer */}
            <button 
              onClick={() => setSelectedProduct(null)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10 }}
            >
              <X size={20} color="#1e293b" />
            </button>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {/* Image descriptive */}
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', maxWidth: '260px', height: '360px', objectFit: 'cover' }} />
              
              {/* Métadonnées et spécifications textuelles */}
              <div style={{ padding: '2rem', flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '1px' }}>Rayon {selectedProduct.category}</span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginTop: '0.2rem', marginBottom: '0.4rem' }}>{selectedProduct.name}</h2>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#e11d48', marginBottom: '1.2rem' }}>{selectedProduct.price}</div>
                  
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{selectedProduct.desc}</p>
                  
                  {/* Alignement des tailles fournies par l'admin */}
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Tailles disponibles :</span>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                      {selectedProduct.sizes && selectedProduct.sizes.map(size => (
                        <span key={size} style={{ border: '1px solid #cbd5e1', padding: '3px 10px', fontSize: '0.8rem', borderRadius: '4px', background: '#f8fafc', fontWeight: '700', color: '#334155' }}>
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Liste des déclinaisons de couleurs */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Option(s) Couleur :</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '0.5rem' }}>
                      {selectedProduct.colors ? selectedProduct.colors.join(', ') : 'Unique'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} 
                  className="btn-red" 
                  style={{ width: '100%', padding: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', fontWeight: 'bold', fontSize: '0.95rem' }}
                >
                  <ShoppingCart size={18} /> Ajouter au Panier
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}