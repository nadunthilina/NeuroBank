import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

function Login({ onAuth }) {
  const [email, setEmail] = useState('admin@demo.local')
  const [password, setPassword] = useState('P@ssw0rd!')
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      const { token, user } = res.data
      if (user.role !== 'admin') return setError('Admin only account required')
      localStorage.setItem('admin_token', token)
      onAuth({ token, user })
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  )
}

function Dashboard({ token }) {
  const api = useMemo(() => axios.create({ baseURL: 'http://localhost:5000', headers: { Authorization: `Bearer ${token}` }}), [token])
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => { (async()=>{
    try { const s = await api.get('/api/admin/stats'); const u = await api.get('/api/admin/users'); const h = await api.get('/api/admin/health'); setStats({ ...s.data, health: h.data }); setUsers(u.data.users) }
    catch(e){ setError(e.response?.data?.error || e.message) }
  })() }, [api])

  const changeRole = async (id, role) => {
    try {
      await api.patch(`/api/admin/users/${id}/role`, { role })
      setUsers(prev => prev.map(x => x._id===id ? { ...x, role } : x))
    } catch (e) { alert(e.response?.data?.error || e.message) }
  }

  if (error) return <div className="text-red-600 p-6">{error}</div>
  if (!stats) return <div className="p-6">Loading…</div>
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">NeuroBank Admin</h1>
        <button className="text-sm text-red-600" onClick={()=>{ localStorage.removeItem('admin_token'); location.reload() }}>Logout</button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 rounded bg-indigo-50">Users: <b>{stats.users}</b></div>
        <div className="p-3 rounded bg-indigo-50">Activities: <b>{stats.activities}</b></div>
        <div className="p-3 rounded bg-orange-50">Disabled: <b>{stats.disabled}</b></div>
      </div>
      <div className="mb-6 p-3 rounded bg-slate-100 text-xs">Health — Uptime: {Math.round(stats.health?.uptime)}s, DB: {String(stats.health?.db)}</div>
      <div className="bg-white rounded shadow">
        <div className="p-3 font-semibold border-b">Users</div>
        <ul className="divide-y">
          {users.map(u => (
            <li key={u._id} className="p-3 flex items-center justify-between text-sm">
              <div>{u.name || '(No name)'} — {u.email} <span className="text-xs text-gray-500">[{u.role}]</span></div>
              <select className="border rounded px-2 py-1 text-xs" defaultValue={u.role} onChange={(e)=>changeRole(u._id, e.target.value)}>
                {['user','premium','admin'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select className="border rounded px-2 py-1 text-xs" defaultValue={u.status||'active'} onChange={async (e)=>{
                try { const status = e.target.value; await api.patch(`/api/admin/users/${u._id}/status`, { status }); setUsers(prev => prev.map(x=>x._id===u._id?{...x,status}:x)) }
                catch (err) { alert(err.response?.data?.error || err.message) }
              }}>
                {['active','disabled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('admin_token')
    return token ? { token } : null
  })
  return (
    <div className="min-h-screen bg-slate-50">
      {!session ? <Login onAuth={setSession} /> : <Dashboard token={session.token} />}
    </div>
  )
}
