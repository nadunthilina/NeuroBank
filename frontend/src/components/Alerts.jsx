import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function Alerts({ token }) {
  const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000', headers: { Authorization: `Bearer ${token}` }}), [token]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => { (async () => {
    try { const res = await api.get('/api/alerts/overdraft'); setData(res.data);} catch(e){ setError(e.response?.data?.error || e.message);} })(); }, [api]);
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div>Loading alerts…</div>;
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Cognitive Overdraft Risk</h3>
      <p>Risk: <b className={data.risk==='high'?'text-red-600':data.risk==='medium'?'text-orange-600':'text-green-600'}>{data.risk.toUpperCase()}</b></p>
      <ul className="mt-2 text-sm text-gray-700">
        {data.recent.map(r => <li key={r.id}>• {r.title} (drain {r.drain})</li>)}
      </ul>
    </div>
  );
}
