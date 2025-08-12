import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function Plans({ token }) {
  const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000', headers: { Authorization: `Bearer ${token}` }}), [token]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', targetDate: '', priority: 'high', expectedDrain: 6, notes: '' });
  const [error, setError] = useState(null);

  const load = async () => { try { const res = await api.get('/api/plans'); setItems(res.data);} catch(e){ setError(e.response?.data?.error || e.message);} };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault(); setError(null);
    try {
      const payload = { ...form, targetDate: new Date(form.targetDate).toISOString(), expectedDrain: Number(form.expectedDrain) };
      await api.post('/api/plans', payload);
      setForm({ title: '', targetDate: '', priority: 'high', expectedDrain: 6, notes: '' });
      await load();
    } catch (e) { setError(e.response?.data?.error || e.message); }
  };

  const remove = async (id) => { await api.delete(`/api/plans/${id}`); await load(); };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold mb-2">Plan an Event</h3>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded px-3 py-2" type="datetime-local" value={form.targetDate} onChange={e=>setForm({...form,targetDate:e.target.value})} required />
            <select className="border rounded px-3 py-2" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
              {['low','medium','high','critical'].map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <input className="w-full border rounded px-3 py-2" type="number" min="0" max="10" value={form.expectedDrain} onChange={e=>setForm({...form,expectedDrain:e.target.value})} />
          <textarea className="w-full border rounded px-3 py-2" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold mb-2">Upcoming Plans</h3>
        <ul className="divide-y">
          {items.map(it => (
            <li key={it._id} className="py-3 flex justify-between">
              <div>
                <div className="font-medium">{it.title} <span className="text-xs text-gray-500">[{it.priority}]</span></div>
                <div className="text-xs text-gray-600">{new Date(it.targetDate).toLocaleString()} — drain {it.expectedDrain}/10</div>
              </div>
              <button className="text-red-600 text-sm" onClick={()=>remove(it._id)}>Delete</button>
            </li>
          ))}
          {!items.length && <li className="py-4 text-gray-500">No plans yet.</li>}
        </ul>
      </div>
    </div>
  );
}
