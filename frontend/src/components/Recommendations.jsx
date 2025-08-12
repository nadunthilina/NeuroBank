import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function Recommendations({ token }) {
  const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000', headers: { Authorization: `Bearer ${token}` }}), [token]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => { (async () => {
    try { const res = await api.get('/api/recommendations'); setItems(res.data.items || []);} catch(e){ setError(e.response?.data?.error || e.message);} })(); }, [api]);
  if (error) return <div className="text-red-600">{error}</div>;
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Recovery Recommendations</h3>
      <ul className="list-disc list-inside text-sm">
        {items.map(it => <li key={it.id}>{it.title}</li>)}
      </ul>
    </div>
  );
}
