import React, { useState, useMemo } from 'react';
import { ShoppingBag, Sparkles, Store } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductList() {
  const { products, addToCart, activeCategory } = useShop(); 
  
  const [maxPrice, setMaxPrice] = useState(200000); 
  const [sortOrder, setSortOrder] = useState('default');

  // Filtrage et tri synchronisés avec le contexte global
  const filteredProducts = useMemo(() => {
    let result = products?.filter(p => {
      const categoryMatch = !activeCategory || activeCategory === 'all' || p.category?.toLowerCase() === activeCategory.toLowerCase();
      const priceVal = Number(p.price_fc || 0);
      return categoryMatch && priceVal <= maxPrice;
    }) || [];

    if (sortOrder === 'asc') result.sort((a, b) => a.price_fc - b.price_fc);
    if (sortOrder === 'desc') result.sort((a, b) => b.price_fc - a.price_fc);
    
    return result;
  }, [products, activeCategory, maxPrice, sortOrder]);

  const getSectionTitle = () => {
    if (activeCategory === 'homme') return "Collection Homme";
    if (activeCategory === 'femme') return "Collection Femme";
    return "Toute notre Boutique";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white min-h-screen">
      
      {/* MESSAGE D'ACCUEIL */}
      <div className="mb-12 p-8 bg-rose-50 rounded-3xl border border-rose-100 flex items-center gap-6">
        <div className="bg-white p-4 rounded-full text-rose-600 shadow-sm">
          <Store size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{getSectionTitle()}</h1>
          <p className="text-rose-600 font-bold text-sm tracking-wide">Bienvenue dans votre espace shopping exclusif.</p>
        </div>
      </div>

      {/* SECTION FILTRES & TRI */}
      <div className="mb-16 bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-8 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">
            Budget Limite : <span className="text-rose-600">{maxPrice.toLocaleString()} FC</span>
          </label>
          <input 
            type="range" min="0" max="200000" step="5000" value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
        </div>
        <div className="w-full md:w-56">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Trier par</label>
          <select 
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none"
          >
            <option value="default">Pertinence</option>
            <option value="asc">Prix Croissant</option>
            <option value="desc">Prix Décroissant</option>
          </select>
        </div>
      </div>

      {/* GRILLE PRODUITS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-24 text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
            <Sparkles size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-bold">Aucun article ne correspond à cette sélection.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white rounded-3xl border border-slate-100 hover:border-rose-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-80 overflow-hidden rounded-t-3xl bg-slate-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[10px] font-black uppercase px-3 py-1 rounded-full">{product.category}</span>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-sm font-black text-slate-900 mb-2 truncate">{product.name}</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed flex-grow line-clamp-2">{product.desc}</p>
                
                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-50">
                  <span className="text-lg font-black text-slate-900">{Number(product.price_fc).toLocaleString()} FC</span>
                  <button onClick={() => addToCart(product)} className="p-3 bg-slate-900 text-white rounded-xl hover:bg-rose-600 transition-colors">
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}