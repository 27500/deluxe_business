import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Merci ${formData.name}, votre message a bien été simulé ! Dès que nous brancherons le serveur Node.js, ce mail parviendra directement dans votre boîte.`);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="section">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#1e293b', marginBottom: '0.5rem' }}>Contactez-Nous</h1>
        <p style={{ color: '#64748b' }}>Une question sur un vêtement ou une commande ? Écrivez-nous directement.</p>
      </div>

      <div className="contact-grid">
        {/* Colonne gauche : Infos */}
        <div>
          <div className="info-box">
            <MapPin color="#e11d48" size={24} style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: '600' }}>Adresse du magasin</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                123 Boulevard Mohammed V, Centre-ville, Casablanca, Maroc
              </p>
            </div>
          </div>

          <div className="info-box">
            <Phone color="#e11d48" size={24} style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: '600' }}>Téléphone / WhatsApp</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                +212 600 000 000
              </p>
            </div>
          </div>

          <div className="info-box">
            <Mail color="#e11d48" size={24} style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: '600' }}>Support Email</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                contact@milungubusiness.com
              </p>
            </div>
          </div>
        </div>

        {/* Colonne droite : Formulaire */}
        <div className="contact-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom complet</label>
              <input 
                type="text" 
                placeholder="Votre nom" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>

            <div className="form-group">
              <label>Adresse Email</label>
              <input 
                type="email" 
                placeholder="votre@email.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>

            <div className="form-group">
              <label>Sujet</label>
              <input 
                type="text" 
                placeholder="De quoi s'agit-il ?" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required 
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                rows="5" 
                placeholder="Écrivez votre message ici..." 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-red" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={16} /> Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}