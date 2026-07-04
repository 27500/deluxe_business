import React from 'react';
import { Send } from 'lucide-react';

export default function Contact() {
  return (
    <section className="section">
      <h2 className="section-title">Une Question ?</h2>
      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Nom Complet</label>
          <input type="text" placeholder="Votre nom..." required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="votre.email@exemple.com" required />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea rows="4" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Envoyer le message <Send size={18} />
        </button>
      </form>
    </section>
  );
}