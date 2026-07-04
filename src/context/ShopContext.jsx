import React, { createContext, useState, useContext } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // Liste des articles dans le panier
  const [cart, setCart] = useState([]);
  
  // Notifications reçues par l'administrateur
  const [notifications, setNotifications] = useState([]);

  // Ajouter un habit au panier
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Supprimer (abandonner) un article du panier via son index unique
  const removeFromCart = (indexToRemove) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };

  // Enregistrer une commande ou une réservation (pour l'admin)
  const processAction = (clientName, product, actionType) => {
    const newNotif = {
      id: Date.now(),
      clientName: clientName || 'Client Anonyme',
      productName: product.name,
      price: product.price,
      type: actionType, // 'ACHAT' ou 'RESERVATION'
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Vider le panier après achat
  const clearCart = () => setCart([]);

  return (
    <ShopContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      notifications,
      processAction
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);