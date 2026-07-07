import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

// Catalogue de base initialisé au démarrage de Deluxe Boutique
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Veste Bomber Anthracite', price: '120.000 FC', numericPrice: 120000, category: 'homme', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', sizes: ['M', 'L', 'XL'], colors: ['Anthracite'], desc: 'Un bomber léger au tissu respirant, parfait pour rester élégant lors des soirées kinoises.' },
  { id: 2, name: 'Chemise Slim Fit Blanche', price: '65.000 FC', numericPrice: 65000, category: 'homme', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', sizes: ['S', 'M', 'L'], colors: ['Blanc Pur'], desc: '100% coton de qualité supérieure. Idéal pour le bureau ou pour les grandes occasions à la Gombe.' },
  { id: 3, name: 'Robe Fluide Fleurie', price: '95.000 FC', numericPrice: 95000, category: 'femme', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', sizes: ['M', 'L', 'XL'], colors: ['Motif Floral'], desc: 'Robe fluide et légère, très agréable à porter au quotidien sous le climat de Kinshasa.' }
];

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
  const clearCart = () => setCart([]);

  // Actions de l'administrateur connectées en direct
  const addProduct = (newProduct) => setProducts([newProduct, ...products]);
  const deleteProduct = (id) => setProducts(products.filter(p => p.id !== id));

  return (
    <ShopContext.Provider value={{ products, cart, addToCart, removeFromCart, clearCart, addProduct, deleteProduct }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);