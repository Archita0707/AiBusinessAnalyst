import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your Enterprise AI Assistant. How can I help you analyze data or lookup glossary terms today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    // Simulate AI response after a short delay (Mock Backend)
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: `I received your query about "${currentInput}". (Backend API integration pending).` 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Chat Interface</h2>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Interact with the AI assistant using mock or live backend responses.</p>

      {/* Chat Messages Box */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#1e293b', 
        border: '1px solid #334155', 
        borderRadius: '0.5rem', 
        padding: '1.5rem', 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        marginBottom: '1rem' 
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            alignItems: 'flex-start',
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%'
          }}>
            {msg.sender === 'ai' && <div style={{ background: '#4f46e5', padding: '0.5rem', borderRadius: '50%' }}><Bot size={18} color="#fff" /></div>}
            <div style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem', 
              backgroundColor: msg.sender === 'user' ? '#4f46e5' : '#0f172a',
              color: '#fff',
              fontSize: '0.9rem'
            }}>
              {msg.text}
            </div>
            {msg.sender === 'user' && <div style={{ background: '#334155', padding: '0.5rem', borderRadius: '50%' }}><User size={18} color="#fff" /></div>}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '0.5rem',
            color: '#fff',
            fontSize: '0.9rem'
          }}
        />
        <button type="submit" style={{
          backgroundColor: '#4f46e5',
          color: '#fff',
          border: 'none',
          padding: '0 1.25rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}