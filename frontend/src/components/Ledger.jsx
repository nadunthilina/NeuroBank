import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const categories = [
  { value: 'deep_work', label: 'Deep Work' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'social', label: 'Social' },
  { value: 'admin', label: 'Admin' },
  { value: 'break', label: 'Break' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'other', label: 'Other' },
];

export default function Ledger({ token }) {
  const [form, setForm] = useState({ title: '', category: 'other', startTime: '', endTime: '', drainScore: 5, notes: '' });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = useMemo(() => axios.create({
    baseURL: 'http://localhost:5000',
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/activities');
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { ...form };
      if (!payload.endTime) delete payload.endTime;
      payload.startTime = new Date(payload.startTime).toISOString();
      if (payload.endTime) payload.endTime = new Date(payload.endTime).toISOString();
      payload.drainScore = Number(payload.drainScore);
      await api.post('/api/activities', payload);
      setForm({ title: '', category: 'other', startTime: '', endTime: '', drainScore: 5, notes: '' });
      await load();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/api/activities/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold mb-2">Log Activity</h3>
        <form className="space-y-3" onSubmit={submit}>
          <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          <div className="flex gap-2">
            <select className="border rounded px-3 py-2" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <input className="border rounded px-3 py-2" type="number" min="0" max="10" value={form.drainScore} onChange={e=>setForm({...form, drainScore:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded px-3 py-2" type="datetime-local" value={form.startTime} onChange={e=>setForm({...form, startTime:e.target.value})} required />
            <input className="border rounded px-3 py-2" type="datetime-local" value={form.endTime} onChange={e=>setForm({...form, endTime:e.target.value})} />
          </div>
          <textarea className="w-full border rounded px-3 py-2" placeholder="Notes (optional)" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold mb-2">Your Activities {loading && <span className="text-sm text-gray-500">(loading…)</span>}</h3>
        <ul className="divide-y">
          {items.map((it) => (
            <li key={it._id} className="py-3 flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{it.title} <span className="text-xs text-gray-500">[{it.category}]</span></div>
                <div className="text-xs text-gray-600">{new Date(it.startTime).toLocaleString()} {it.endTime ? '→ ' + new Date(it.endTime).toLocaleString() : ''}</div>
                <div className="text-xs">Drain: {it.drainScore} / 10</div>
                {it.notes && <div className="text-xs text-gray-700">{it.notes}</div>}
              </div>
              <button className="text-red-600 text-sm" onClick={() => remove(it._id)}>Delete</button>
            </li>
          ))}
          {!items.length && <li className="py-4 text-gray-500">No activities yet.</li>}
        </ul>
      </div>
    </div>
  );
}
