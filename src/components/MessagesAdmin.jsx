import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Loader2, Trash2 } from 'lucide-react';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Chargement des messages depuis le backend
  useEffect(() => {
    fetch(`${API_URL}/api/messages`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des messages :", err);
        setLoading(false);
      });
  }, []);

  // Fonction pour supprimer un message
  const deleteMessage = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;

    try {
      const response = await fetch(`${API_URL}/api/messages/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Mise à jour de l'affichage local après suppression
        setMessages(messages.filter((msg) => msg.id !== id));
      } else {
        alert("Erreur lors de la suppression sur le serveur.");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif', color: '#0f172a' }}>
      
      {/* Barre de navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '0.85rem 1.25rem', borderRadius: '14px', marginBottom: '2rem', color: '#ffffff' }}>
        <button 
          onClick={() => navigate('/admin')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ffffff', border: 'none', color: '#0f172a', padding: '0.45rem 0.9rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
        >
          <ArrowLeft size={12} /> Retour Admin
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
          <MessageSquare size={16} /> <span>Boîte de réception</span>
        </div>
      </div>

      {/* Liste des messages */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#e11d48' }} />
          </div>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Aucun message pour le moment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ padding: '1.25rem', border: '1px solid #f1f5f9', borderRadius: '12px', backgroundColor: '#f8fafc', position: 'relative' }}>
                
                {/* Bouton de suppression */}
                <button 
                  onClick={() => deleteMessage(msg.id)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#fee2e2', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 size={14} />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.8rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>{msg.email}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Sujet : {msg.sujet}</span>
                </div>
                
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', paddingRight: '2rem' }}>
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}