import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function Analytics({ token }) {
  const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000', headers: { Authorization: `Bearer ${token}` }}), [token]);
  const [summary, setSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { (async () => {
    try { const s = await api.get('/api/analytics/summary'); setSummary(s.data); const k = await api.get('/api/analytics/streak'); setStreak(k.data); }
    catch(e){ setError(e.response?.data?.error || e.message); }
  })(); }, [api]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!summary || !streak) return <div>Loading analytics…</div>;
  const cats = Object.entries(summary.byCategory||{});
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Analytics</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-3 bg-slate-50 rounded">Total activities: <b>{summary.total}</b></div>
        <div className="p-3 bg-slate-50 rounded">Average drain: <b>{summary.avgDrain.toFixed(1)}</b></div>
        <div className="p-3 bg-slate-50 rounded">Streak: <b>{streak.streakDays}</b> days</div>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold">By category</h4>
        <ul className="text-sm list-disc list-inside">
          {cats.map(([c,sum]) => <li key={c}>{c}: {sum.toFixed(1)}</li>)}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold">Last 7 days</h4>
        <ul className="text-sm grid grid-cols-2 gap-2">
          {summary.last7.map(d => <li key={d.date} className="p-2 rounded bg-slate-50 flex justify-between"><span>{d.date}</span><span>{d.drain}</span></li>)}
        </ul>
      </div>
    </div>
  );
}
