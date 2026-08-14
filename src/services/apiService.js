// Récupération de l'URL du backend définie dans le fichier .env (avec fallback sur Render)
const API_URL = import.meta.env.VITE_API_URL || 'https://deluxe-boutique.onrender.com';

export const apiService = {
  
  // ==========================================
  // 1. AUTHENTIFICATION (Espace Admin)
  // ==========================================
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Identifiants invalides');
      }

      return await response.json(); // Retournera le token JWT et les infos admin
    } catch (error) {
      console.error("Erreur d'authentification:", error.message);
      throw error;
    }
  },

  // ==========================================
  // 2. GESTION DES PRODUITS (CRUD)
  // ==========================================
  
  // Récupérer tous les produits (pour la vitrine et l'admin)
  getProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Impossible de charger les produits');
      return await response.json();
    } catch (error) {
      console.error("Erreur récupération produits:", error.message);
      throw error;
    }
  },

  // Ajouter un produit (Protégé par le token de session)
  addProduct: async (productData, token) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Transmission du jeton de sécurité
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout du produit");
      return await response.json();
    } catch (error) {
      console.error("Erreur addProduct:", error.message);
      throw error;
    }
  },

  // Supprimer un produit
  deleteProduct: async (productId, token) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");
      return await response.json();
    } catch (error) {
      console.error("Erreur deleteProduct:", error.message);
      throw error;
    }
  }
};