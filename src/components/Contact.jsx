import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useShop } from '../context/ShopContext'; // ✅ Importation du contexte

export default function Contact() {
  const { sendMessage } = useShop(); // ✅ Récupération de la fonction globale
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await sendMessage(formData);

    if (success) {
      alert(`🎉 Merci ${formData.name}, votre message a bien été transmis à l'équipe administrative !`);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      alert("❌ Une erreur est survenue lors de l'envoi de votre message. Veuillez vérifier si le serveur backend est en ligne.");
    }
    setIsSubmitting(false);
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

            <button type="submit" disabled={isSubmitting} className="btn-red" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}>
              <Send size={16} /> {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}