import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function Predictions({ token }) {
  const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000', headers: { Authorization: `Bearer ${token}` }}), [token]);
  const [series, setSeries] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => { (async () => {
    try { const res = await api.get('/api/predict'); setSeries(res.data.series || []);} catch(e){ setError(e.response?.data?.error || e.message);} })(); }, [api]);
  if (error) return <div className="text-red-600">{error}</div>;
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Energy Prediction (next 12h)</h3>
      <div className="text-xs text-gray-700 grid grid-cols-3 gap-2">
        {series.map(p => (
          <div key={p.t} className="p-2 rounded bg-slate-50 flex justify-between">
            <span>{new Date(p.t).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
            <span>{Math.round(p.energy*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
