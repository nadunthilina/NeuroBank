import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export default function AdminPanel({ token }) {
  const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000', headers: { Authorization: `Bearer ${token}` }}), [token]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await api.get('/api/admin/stats');
        const u = await api.get('/api/admin/users');
        setStats(s.data); setUsers(u.data.users);
      } catch (e) { setError(e.response?.data?.error || e.message); }
    })();
  }, [api]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!stats) return <div>Loading admin data…</div>;
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Admin Overview</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 rounded bg-indigo-50">Users: <b>{stats.users}</b></div>
        <div className="p-3 rounded bg-indigo-50">Activities: <b>{stats.activities}</b></div>
        <div className="p-3 rounded bg-orange-50">Disabled: <b>{stats.disabled}</b></div>
      </div>
      <h4 className="font-semibold mb-2">Users</h4>
      <ul className="divide-y">
        {users.map(u => (
          <li key={u._id} className="py-2 text-sm flex items-center justify-between gap-3">
            <div>
              {u.name || '(No name)'} — {u.email} <span className="text-xs text-gray-500">[{u.role}]</span>
            </div>
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1 text-xs" defaultValue={u.role} onChange={async (e)=>{
                try {
                  const role = e.target.value;
                  await api.patch(`/api/admin/users/${u._id}/role`, { role });
                  setUsers(prev => prev.map(x => x._id===u._id ? { ...x, role } : x));
                } catch (err) { alert(err.response?.data?.error || err.message); }
              }}>
                {['user','premium','admin'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select className="border rounded px-2 py-1 text-xs" defaultValue={u.status||'active'} onChange={async (e)=>{
                try {
                  const status = e.target.value;
                  await api.patch(`/api/admin/users/${u._id}/status`, { status });
                  setUsers(prev => prev.map(x => x._id===u._id ? { ...x, status } : x));
                } catch (err) { alert(err.response?.data?.error || err.message); }
              }}>
                {['active','disabled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
