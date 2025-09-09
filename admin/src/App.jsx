import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

// Small UI helpers
const Badge = ({ color = 'slate', children }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-700`}>{children}</span>
)
const Pill = ({ ok, children }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{children}</span>
)

function Login({ onAuth }) {
  const [email, setEmail] = useState('admin@demo.local')
  const [password, setPassword] = useState('P@ssw0rd!')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      const { token, user } = res.data
      if (user.role !== 'admin') return setError('Admin only account required')
      localStorage.setItem('admin_token', token)
      onAuth({ token, user })
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded bg-indigo-600 text-white font-bold grid place-items-center">N</div>
          <div>
            <h2 className="text-lg font-semibold leading-tight">NeuroBank Admin</h2>
            <p className="text-xs text-slate-500">Sign in to continue</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm disabled:opacity-60">{loading?'Signing in…':'Login'}</button>
        </form>
      </div>
    </div>
  )
}

function Dashboard({ token }) {
  const logout = () => { localStorage.removeItem('admin_token'); location.reload() }
  const api = useMemo(() => {
    const instance = axios.create({ baseURL: 'http://localhost:5000', headers: { Authorization: `Bearer ${token}` }})
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status
        const msg = err?.response?.data?.error
        if (status === 401 || msg === 'Invalid token') { logout(); return Promise.reject(new Error('Session expired')) }
        return Promise.reject(err)
      }
    )
    return instance
  }, [token])

  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [health, setHealth] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Users UI state
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState('email')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const pageSize = 8
  const [selected, setSelected] = useState(new Set())

  const refresh = async () => {
    try {
      setLoading(true)
      const [s, u, h] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/admin/health'),
      ])
      setStats(s.data)
      setUsers(u.data.users)
      setHealth(h.data)
      setError(null)
    } catch (e) {
      setError(e.response?.data?.error || e.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { refresh() }, [api])

  const filtered = useMemo(() => {
    let list = [...users]
    if (query) list = list.filter(u => (u.name||'').toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
    if (roleFilter !== 'all') list = list.filter(u => u.role === roleFilter)
    if (statusFilter !== 'all') list = list.filter(u => (u.status||'active') === statusFilter)
    list.sort((a,b)=>{
      const dir = sortDir === 'asc' ? 1 : -1
      const av = (a[sortKey]||'').toString().toLowerCase()
      const bv = (b[sortKey]||'').toString().toLowerCase()
      return av > bv ? dir : av < bv ? -dir : 0
    })
    return list
  }, [users, query, roleFilter, statusFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page-1)*pageSize, page*pageSize)

  useEffect(()=>{ if (page > totalPages) setPage(totalPages) }, [totalPages])

  const toggleSelectAllPage = (checked) => {
    const ids = paged.map(u=>u._id)
    setSelected(prev => {
      const next = new Set(prev)
      ids.forEach(id => checked ? next.add(id) : next.delete(id))
      return next
    })
  }
  const toggleSelect = (id) => setSelected(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n })
  const clearSelection = () => setSelected(new Set())

  const changeRole = async (id, role) => {
    try { await api.patch(`/api/admin/users/${id}/role`, { role }); setUsers(prev => prev.map(x => x._id===id ? { ...x, role } : x)) }
    catch (e) { alert(e.response?.data?.error || e.message) }
  }
  const changeStatus = async (id, status) => {
    try { await api.patch(`/api/admin/users/${id}/status`, { status }); setUsers(prev => prev.map(x => x._id===id ? { ...x, status } : x)) }
    catch (e) { alert(e.response?.data?.error || e.message) }
  }
  const bulkChangeRole = async (role) => {
    for (const id of selected) { await changeRole(id, role) }
    clearSelection()
  }
  const bulkChangeStatus = async (status) => {
    for (const id of selected) { await changeStatus(id, status) }
    clearSelection()
  }
  const exportCSV = () => {
    const rows = [['name','email','role','status']].concat(filtered.map(u=>[(u.name||'').replaceAll(',',' '),u.email,u.role,u.status||'active']))
    const csv = rows.map(r=>r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click(); URL.revokeObjectURL(url)
  }

  if (error) return <div className="min-h-screen grid place-items-center"><div className="text-red-600 p-6 bg-red-50 rounded border border-red-200">{error}</div></div>
  if (loading) return <div className="min-h-screen grid place-items-center"><div className="p-4 bg-white rounded shadow border">Loading…</div></div>

  const roleCounts = users.reduce((acc,u)=>{ acc[u.role]=(acc[u.role]||0)+1; return acc }, {})

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-indigo-600 text-white font-bold grid place-items-center">N</div>
            <span className="font-semibold">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">API: http://localhost:5000</span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-xl border border-slate-200 p-3 h-fit">
          <nav className="space-y-1 text-sm">
            {[
              { key:'overview', label:'Overview' },
              { key:'users', label:'Users' },
              { key:'settings', label:'Settings' },
            ].map(i => (
              <button key={i.key} onClick={()=>setTab(i.key)} className={`w-full text-left px-3 py-2 rounded ${tab===i.key?'bg-indigo-50 text-indigo-700':'hover:bg-slate-50'}`}>{i.label}</button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main>
          {tab==='overview' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border p-4"><div className="text-xs text-slate-500">Users</div><div className="text-2xl font-bold mt-1">{stats.users}</div></div>
                <div className="bg-white rounded-xl border p-4"><div className="text-xs text-slate-500">Activities</div><div className="text-2xl font-bold mt-1">{stats.activities}</div></div>
                <div className="bg-white rounded-xl border p-4"><div className="text-xs text-slate-500">Disabled</div><div className="text-2xl font-bold mt-1 text-orange-600">{stats.disabled}</div></div>
                <div className="bg-white rounded-xl border p-4"><div className="text-xs text-slate-500">Uptime</div><div className="text-2xl font-bold mt-1">{Math.round(health?.uptime)}s</div></div>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Role distribution</h3><button className="text-xs text-slate-500 hover:underline" onClick={refresh}>Refresh</button></div>
                  <ul className="space-y-2">
                    {['user','premium','admin'].map(r => (
                      <li key={r} className="flex items-center gap-3">
                        <Badge color={r==='admin'?'purple':r==='premium'?'indigo':'slate'}>{r}</Badge>
                        <div className="flex-1 h-2 bg-slate-100 rounded">
                          <div className={`h-2 rounded ${r==='admin'?'bg-purple-400':r==='premium'?'bg-indigo-400':'bg-slate-400'}`} style={{ width: `${((roleCounts[r]||0)/(users.length||1))*100}%` }} />
                        </div>
                        <span className="text-xs text-slate-600 w-8 text-right">{roleCounts[r]||0}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <h3 className="font-semibold mb-2">Health</h3>
                  <div className="space-y-2 text-sm">
                    <div>Database: <Pill ok={!!health?.db}>{health?.db? 'Connected':'Offline'}</Pill></div>
                    <div>Uptime: {Math.round(health?.uptime)}s</div>
                    <button onClick={refresh} className="mt-2 inline-flex items-center rounded bg-slate-900 text-white px-3 py-1.5 text-xs">Re-run checks</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab==='users' && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="bg-white rounded-xl border p-4 flex flex-wrap items-center gap-3">
                <input value={query} onChange={e=>{ setQuery(e.target.value); setPage(1) }} placeholder="Search name or email" className="flex-1 min-w-[220px] border rounded-lg px-3 py-2 text-sm" />
                <select value={roleFilter} onChange={e=>{ setRoleFilter(e.target.value); setPage(1) }} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="all">All roles</option>
                  {['user','premium','admin'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select value={statusFilter} onChange={e=>{ setStatusFilter(e.target.value); setPage(1) }} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="all">All status</option>
                  {['active','disabled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={sortKey} onChange={e=>setSortKey(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="email">Sort: email</option>
                  <option value="role">Sort: role</option>
                  <option value="status">Sort: status</option>
                </select>
                <button onClick={()=>setSortDir(d=>d==='asc'?'desc':'asc')} className="border rounded-lg px-3 py-2 text-sm">{sortDir==='asc'?'Asc':'Desc'}</button>
                <button onClick={exportCSV} className="ml-auto inline-flex items-center rounded bg-indigo-600 text-white px-3 py-2 text-sm">Export CSV</button>
              </div>

              {/* Bulk actions */}
              {selected.size>0 && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-3 text-sm">
                  <div><b>{selected.size}</b> selected</div>
                  <button onClick={()=>bulkChangeRole('user')} className="px-2 py-1 rounded bg-white border">Set role: user</button>
                  <button onClick={()=>bulkChangeRole('premium')} className="px-2 py-1 rounded bg-white border">Set role: premium</button>
                  <button onClick={()=>bulkChangeRole('admin')} className="px-2 py-1 rounded bg-white border">Set role: admin</button>
                  <span className="mx-2 text-slate-400">|</span>
                  <button onClick={()=>bulkChangeStatus('active')} className="px-2 py-1 rounded bg-white border">Set status: active</button>
                  <button onClick={()=>bulkChangeStatus('disabled')} className="px-2 py-1 rounded bg-white border">Set status: disabled</button>
                  <button onClick={clearSelection} className="ml-auto text-slate-600 hover:underline">Clear</button>
                </div>
              )}

              {/* Users table */}
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-2 text-left w-8"><input type="checkbox" checked={paged.every(u=>selected.has(u._id)) && paged.length>0} onChange={e=>toggleSelectAllPage(e.target.checked)} /></th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Role</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {paged.map(u => (
                      <tr key={u._id} className="hover:bg-slate-50">
                        <td className="p-2"><input type="checkbox" checked={selected.has(u._id)} onChange={()=>toggleSelect(u._id)} /></td>
                        <td className="p-2">{u.name || <span className="text-slate-400">(No name)</span>}</td>
                        <td className="p-2 font-mono text-xs">{u.email}</td>
                        <td className="p-2">
                          <select className="border rounded px-2 py-1 text-xs" value={u.role} onChange={(e)=>changeRole(u._id, e.target.value)}>
                            {['user','premium','admin'].map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </td>
                        <td className="p-2">
                          <select className="border rounded px-2 py-1 text-xs" value={u.status||'active'} onChange={(e)=>changeStatus(u._id, e.target.value)}>
                            {['active','disabled'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {paged.length===0 && (
                      <tr><td colSpan={5} className="p-6 text-center text-slate-500">No users found</td></tr>
                    )}
                  </tbody>
                </table>
                <div className="flex items-center justify-between p-3 border-t bg-slate-50 text-xs">
                  <div>Showing {(page-1)*pageSize + (paged.length?1:0)}–{(page-1)*pageSize + paged.length} of {filtered.length}</div>
                  <div className="flex items-center gap-2">
                    <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-2 py-1 rounded border bg-white disabled:opacity-40">Prev</button>
                    <span>Page {page} / {totalPages}</span>
                    <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-2 py-1 rounded border bg-white disabled:opacity-40">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab==='settings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-semibold mb-2">Session</h3>
                <div className="text-xs text-slate-600">Token: <span className="font-mono">{token.slice(0,12)}…</span></div>
                <button onClick={logout} className="mt-3 inline-flex items-center rounded bg-red-600 text-white px-3 py-1.5 text-xs">Clear session</button>
              </div>
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-semibold mb-2">System checks</h3>
                <div className="text-sm">Database: <Pill ok={!!health?.db}>{health?.db? 'Connected':'Offline'}</Pill></div>
                <div className="text-sm">Uptime: {Math.round(health?.uptime)}s</div>
                <button onClick={refresh} className="mt-3 inline-flex items-center rounded bg-slate-900 text-white px-3 py-1.5 text-xs">Run</button>
              </div>
            </div>
          )}
        </main>
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
