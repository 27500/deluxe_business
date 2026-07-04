import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlusCircle, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext'; // <-- Import du Hook

const MOCK_PRODUCTS = [
  { id: 1, name: 'Veste Élégante', price: '4500 fc', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500' },
  { id: 2, name: 'Chemise Slim Fit', price: '25000 fc', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500' },
  { id: 3, name: 'Pantalon Casual', price: '3000 fc', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500' },
];

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('recherche') || '';
  const { addToCart } = useShop(); // Fonction d'ajout au panier

  const filteredProducts = MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="section">
      <h2 className="section-title">
        {query ? `Résultats pour "${query}"` : 'Nos Habits'}
      </h2>
      
      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>Aucun habit trouvé pour cette recherche.</p>
      ) : (
        <div className="grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card">
              <img src={product.image} alt={product.name} />
              <div className="card-body">
                <div>
                  <div className="card-title">{product.name}</div>
                  <div className="card-price">{product.price}</div>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="btn-add"
                >
                  <PlusCircle size={18} /> Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}