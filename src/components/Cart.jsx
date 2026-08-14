import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount } = useShop();

  // --- 📱 FONCTION D'ENVOI WHATSAPP (STRICTEMENT INTACTE) ---
  const handleWhatsAppCheckout = () => {
    const phoneNumber = "+212646101150"; 
    
    // Construction du message textuel
    let message = `🛒 *NOUVELLE COMMANDE - DELUXE BUSINESS*\n`;
    message += `------------------------------------------\n\n`;
    
    cart.forEach((item, index) => {
      const priceUnit = item.price_fc || Number(item.price) || 0;
      const subTotalItem = priceUnit * item.quantity;
      
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Quantité : ${item.quantity}\n`;
      message += `   Prix Unitaire : ${priceUnit.toLocaleString()} FC\n`;
      message += `   Total : *${subTotalItem.toLocaleString()} FC*\n\n`;
    });
    
    message += `------------------------------------------\n`;
    message += `📦 *Nombre total d'articles :* ${getCartCount()}\n`;
    message += `💰 *MONTANT TOTAL À PAYER :* *${getCartTotal().toLocaleString()} FC*\n\n`;
    message += `Bonjour Deluxe Business, je souhaite finaliser ma commande avec ces articles !`;

    // Encodage propre du texte pour l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Ouverture de WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  };

  // --- 1. STYLE PANIER VIDE (Strictement conforme à ton image Vercel) ---
  if (cart.length === 0) {
    return (
      <div className="w-full bg-white min-h-[60vh] flex flex-col items-center justify-center font-sans px-4 py-20">
        
        {/* Grande icône de cabas épurée */}
        <div className="text-slate-300 mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="80" 
            height="80" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>

        {/* Titre principal */}
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">
          Votre panier est vide
        </h2>

        {/* Sous-titre textuel */}
        <p className="text-slate-500 text-sm text-center max-w-sm leading-relaxed mb-8">
          Découvrez nos vêtements exclusifs hommes et femmes disponibles à Kinshasa.
        </p>

        {/* Bouton de retour avec la flèche */}
        <Link 
          to="/boutique" 
          className="inline-flex items-center gap-2 bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-bold uppercase tracking-wider px-6 h-11 rounded transition-colors shadow-sm select-none"
        >
          <span>←</span> Retourner à la boutique
        </Link>

      </div>
    );
  }

  // --- 2. STYLE PANIER PLEIN (Mise en conformité visuelle haut de gamme) ---
  return (
    <div className="w-full bg-white font-sans min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* En-tête aligné et épuré */}
        <div className="border-b border-slate-100 pb-5 mb-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-slate-800" />
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Mon Panier <span className="text-[#e11d48] text-lg font-bold">({getCartCount()})</span>
            </h2>
          </div>
          <button 
            onClick={clearCart} 
            className="text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-800 transition-colors bg-rose-55 px-3 py-1.5 rounded"
          >
            Vider tout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* LISTE DES ARTICLES DE LUXE */}
          <div className="lg:col-span-2 divide-y divide-slate-100">
            {cart.map((item) => {
              const finalImage = item.image_url || item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500';
              const priceUnit = item.price_fc || Number(item.price) || 0;

              return (
                <div key={item.id} className="flex items-center justify-between py-6 first:pt-0 last:pb-0 gap-4">
                  
                  {/* Image & Informations de l'article */}
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-20 h-24 bg-slate-50 border border-slate-100 rounded overflow-hidden flex-shrink-0">
                      <img src={finalImage} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm tracking-tight">{item.name}</h4>
                      <p className="text-xs text-slate-400 uppercase font-medium">{item.category || 'Collection'}</p>
                      <span className="text-sm font-black text-slate-900 block pt-1">
                        {priceUnit.toLocaleString()} FC
                      </span>
                    </div>
                  </div>

                  {/* Boutons d'ajustement et suppression premium */}
                  <div className="flex items-center gap-8">
                    
                    {/* Sélecteur de quantité ajusté horizontalement */}
                    <div className="flex items-center border border-slate-200 rounded h-8 overflow-hidden bg-white shadow-sm">
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="px-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 h-full transition-colors font-medium text-sm select-none"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs font-black text-slate-800 min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => addToCart(item)} 
                        className="px-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 h-full transition-colors font-medium text-sm select-none"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    
                    {/* Corbeille de suppression */}
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-rose-50 rounded transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* RÉSUMÉ FINANCIER STRUCTURE DE LUXE */}
          <div className="bg-[#f8fafc] border border-slate-100 rounded-lg p-6 lg:sticky lg:top-6 space-y-6">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest border-b border-slate-200 pb-4">
              Résumé de la commande
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Sous-total articles</span>
                <span className="font-semibold text-slate-700">{getCartCount()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Frais de livraison</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Gratuit</span>
              </div>
              
              <div className="flex justify-between items-baseline pt-4 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-800">Total</span>
                <span className="text-xl font-black text-red-600 tracking-tight">
                  {getCartTotal().toLocaleString()} FC
                </span>
              </div>
            </div>

            {/* Bouton connecté à ta fonction WhatsApp sans modification de comportement */}
            <button 
              onClick={handleWhatsAppCheckout}
              className="w-full bg-green-600 text-white h-12 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-green-700 transition-colors shadow-md flex items-center justify-center gap-2 select-none"
            >
              Passer la commande via WhatsApp
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;