import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopContextProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Admin from './components/Admin';
import MessagesAdmin from './components/MessagesAdmin'; // <--- AJOUTÉ : Import du composant

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
    <ShopContextProvider>
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
              <Route path="/messages-admin" element={<MessagesAdmin />} /> {/* <--- AJOUTÉ : Déclaration de la route */}
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ShopContextProvider>
  );
}

export default App;