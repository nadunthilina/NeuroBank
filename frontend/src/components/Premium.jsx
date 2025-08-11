import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function Premium({ token }) {
  const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000', headers: { Authorization: `Bearer ${token}` }}), [token]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => { (async () => {
    try { const res = await api.get('/api/analytics/advanced'); setData(res.data);} catch(e){ setError(e.response?.data?.error || e.message);} })(); }, [api]);
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div>Loading premium analytics…</div>;
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Premium Analytics (30-day)</h3>
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div>
          <h4 className="font-semibold">Daily Drain</h4>
          <ul className="mt-2">
            {data.days.map(d => <li key={d.date} className="flex justify-between"><span>{d.date}</span><span>{d.drain}</span></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">SMA(7) Trend</h4>
          <ul className="mt-2">
            {data.trend.map(d => <li key={d.date} className="flex justify-between"><span>{d.date}</span><span>{d.sma7}</span></li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
