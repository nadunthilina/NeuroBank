import { useEffect, useState } from 'react'
import './App.css'
import AuthPanel from './components/auth/AuthPanel'
import Ledger from './components/Ledger'
import Predictions from './components/Predictions'
import Alerts from './components/Alerts'
import Recommendations from './components/Recommendations'
import Plans from './components/Plans'
import AdminPanel from './components/AdminPanel'
import Analytics from './components/Analytics'
import Premium from './components/Premium'

function App() {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return token ? { token, user } : null;
  });

  const [tab, setTab] = useState('ledger');
  useEffect(() => {
    (async () => {
      try {
        if (session && session.token && !session.user) {
          const res = await fetch('http://localhost:5000/api/user/me', {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          if (res.ok) {
            const user = await res.json();
            localStorage.setItem('user', JSON.stringify(user));
            setSession(prev => ({ ...prev, user }));
          }
        }
      } catch (_) { /* noop */ }
    })();
  }, [session?.token]);
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">NeuroBank</h1>
          <p className="text-indigo-200">A Mental Energy Budgeting Tool</p>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Welcome to NeuroBank</h2>
          <p className="mb-4">
            Track, predict, and optimize your mental energy allocation to avoid burnout
            and make the most of your cognitive resources.
          </p>
          
          <div className="mt-8 grid gap-6">
            {!session ? (
              <AuthPanel onAuth={(s)=>{ localStorage.setItem('user', JSON.stringify(s.user)); setSession(s); }} />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {['ledger','predict','alerts','recs','plans','analytics', ...((session?.user?.role==='premium'||session?.user?.role==='admin')?['premium']:[]), ...(session?.user?.role==='admin'?['admin']:[])].map(t => (
                      <button key={t} className={`px-3 py-1 rounded ${tab===t?'bg-indigo-600 text-white':'bg-gray-200'}`} onClick={()=>setTab(t)}>
                        {t==='ledger'?'Ledger':t==='predict'?'Prediction':t==='alerts'?'Alerts':t==='recs'?'Recovery':t==='plans'?'Plans':t==='analytics'?'Analytics':t==='premium'?'Premium':'Admin'}
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mr-3">
                    {session?.user ? (<span>Signed in as <b>{session.user.email}</b> <span className="text-xs">[{session.user.role}]</span></span>) : null}
                  </div>
                  <button className="text-sm text-red-600" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setSession(null); }}>Logout</button>
                </div>
                {tab==='ledger' && <Ledger token={session.token} />}
                {tab==='predict' && <Predictions token={session.token} />}
                {tab==='alerts' && <Alerts token={session.token} />}
                {tab==='recs' && <Recommendations token={session.token} />}
                {tab==='plans' && <Plans token={session.token} />}
                {tab==='analytics' && <Analytics token={session.token} />}
                {tab==='premium' && <Premium token={session.token} />}
                {tab==='admin' && (session?.user?.role==='admin' ? <AdminPanel token={session.token} /> : <div className="p-4 bg-white rounded shadow text-red-600">Admin access required</div>)}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
