import { useState, useEffect} from 'react';
import { mockGlossaryTerms } from '../mock/mockGlossary';
import { getGlossary } from '../services/api';
import { Search, Loader2} from 'lucide-react';

export default function Glossary() {
  const [terms, setTerms] = useState([]);
  const [loading, setloading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getGlossary()
      .then(res => setTerms(res.data))
      .catch(() => setTerms([]))
      .finally(() => setLoading(false));
 },   []);
  
  const filteredTerms = terms.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Business Glossary</h2>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Core enterprise metrics and definitions.</p>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search glossary terms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '0.5rem',
            color: '#fff',
            fontSize: '0.9rem'
          }}
        />
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
      </div>

      {/* HTML Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e293b', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#0f172a', textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '1rem' }}>Term</th>
            <th style={{ padding: '1rem' }}>Definition</th>
            <th style={{ padding: '1rem' }}>Owner</th>
            <th style={{ padding: '1rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTerms.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>{item.termName}</td>
              <td style={{ padding: '1rem', color: '#cbd5e1' }}>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}