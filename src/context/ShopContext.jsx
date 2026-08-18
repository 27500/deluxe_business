import React, { createContext, useState, useContext, useEffect } from 'react';

const ShopContext = createContext();

export function ShopContextProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [messages, setMessages] = useState([]); // ✅ État pour stocker les messages de l'admin
  const [activeCategory, setActiveCategory] = useState('all');

  // ==========================================
  // 1. CHARGEMENT INITIAL (PRODUITS & MESSAGES)
  // ==========================================
  useEffect(() => {
    const loadProductsFromBackend = async () => {
      try {
        const response = await fetch('${API_URL}/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Impossible de récupérer les habits depuis le backend :", error);
      }
    };

    const loadMessagesFromBackend = async () => {
      try {
        const response = await fetch('${API_URL}/api/messages');
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Impossible de récupérer les messages depuis le backend :", error);
      }
    };

    loadProductsFromBackend();
    loadMessagesFromBackend(); // ✅ Chargement des messages au démarrage

    // Récupération sécurisée du panier au démarrage
    try {
      const savedCart = localStorage.getItem('deluxe_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error("Impossible de charger le panier local :", e);
    }
  }, []);

  // ==========================================
  // 2. SAUVEGARDE AUTOMATIQUE DU PANIER LOCAL
  // ==========================================
  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem('deluxe_cart');
      return;
    }
    try {
      localStorage.setItem('deluxe_cart', JSON.stringify(cart));
    } catch (error) {
      console.warn("⚠️ Panier : Image trop lourde pour le localStorage.");
    }
  }, [cart]);

  // ==========================================
  // 3. ENREGISTRER UN HABIT DANS LA BASE DE DONNÉES (POST)
  // ==========================================
  const addProduct = async (newProduct) => {
    try {
      const response = await fetch('${API_URL}/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        const savedProduct = await response.json();
        setProducts((prevProducts) => [savedProduct, ...prevProducts]);
        alert("🎉 Le vêtement a été enregistré avec succès dans la base de données !");
      } else {
        const errorData = await response.json();
        alert(`❌ Le serveur a refusé l'enregistrement : ${errorData.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du produit au backend :", error);
    }
  };

  // ==========================================
  // 4. SUPPRIMER UN HABIT DE LA BASE DE DONNÉES (DELETE)
  // ==========================================
  const deleteProduct = async (id) => {
    if (window.confirm("Voulez-vous vraiment retirer cet article du catalogue ?")) {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setProducts((prevProducts) => prevProducts.filter(p => p.id !== id));
          alert("🗑️ Vêtement supprimé définitivement.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression backend :", error);
      }
    }
  };

  // ==========================================
  // 5. GESTION DES MESSAGES DE CONTACT
  // ==========================================
  const sendMessage = async (messageData) => {
    try {
      const response = await fetch('${API_URL}/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const savedMessage = await response.json();
        setMessages((prevMessages) => [savedMessage, ...prevMessages]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de l'envoi du message au backend :", error);
      return false;
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce message définitivement ?")) {
      try {
        const response = await fetch(`${API_URL}/api/messages/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setMessages((prevMessages) => prevMessages.filter(m => m.id !== id && m._id !== id));
          alert("🗑️ Message supprimé.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du message :", error);
      }
    }
  };

  // ==========================================
  // 6. GESTION DU PANIER
  // ==========================================
  const addToCart = (product) => {
    setCart((prevCart) => {
      const exist = prevCart.find(item => item.id === product.id);
      if (exist) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    alert(`🛒 ${product.name} a été ajouté au panier !`);
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const cleanPrice = String(item.price || 0).replace(/[^0-9]/g, '');
      const priceNum = Number(cleanPrice) || 0;
      return total + (priceNum * (item.quantity || 1));
    }, 0);
  };

  return (
    <ShopContext.Provider value={{ 
      products, 
      cart,
      messages,       // ✅ Exportation globale des messages
      sendMessage,    // ✅ Fonction d'envoi
      deleteMessage,  // ✅ Fonction de suppression
      activeCategory, 
      setActiveCategory,
      addProduct, 
      deleteProduct, 
      addToCart,
      removeFromCart, 
      getCartCount,
      getCartTotal
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop doit obligatoirement être utilisé à l'intérieur d'un <ShopContextProvider />");
  }
  return context;
};