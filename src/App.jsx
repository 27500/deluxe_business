import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext'; // <-- Import du Contexte
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Admin from './components/Admin';

function HomePage() {
  return (
    <>
      <Hero />
      <ProductList />
    </>
  );
}

function App() {
  return (
    <ShopProvider> {/* <-- Enveloppe globale */}
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/boutique" element={<ProductList />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ShopProvider>
  );
}

export default App;