import React from 'react'
import AuthPanel from '../../components/auth/AuthPanel'

export default function Landing({ onAuth }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white text-slate-800">
      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold">N</div>
            <span className="font-semibold">NeuroBank</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#testimonials" className="hover:text-slate-900">Stories</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </nav>
          <a href="#get-started" className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-indigo-500">Get started</a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Budget your mental energy like money.
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              NeuroBank helps you track drains and gains, predict fatigue, and invest your focus where it matters most.
            </p>
            <ul className="mt-6 space-y-2 text-slate-700">
              <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span> Smart predictions to avoid cognitive overdraft</li>
              <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span> Daily ledger for activities and recovery</li>
              <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span> Role‑based insights: Standard, Premium, Admin</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#get-started" className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-3 text-white font-medium shadow hover:bg-indigo-500">Create your account</a>
              <a href="#features" className="inline-flex items-center rounded-lg bg-white px-5 py-3 text-slate-700 font-medium shadow border border-slate-200 hover:bg-slate-50">Learn more</a>
            </div>
            <div className="mt-10 text-xs text-slate-500">No credit card required. Free tier available.</div>
          </div>
          <div id="get-started" className="lg:justify-self-end w-full max-w-md lg:max-w-lg">
            <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-6">
              <h2 className="text-lg font-semibold mb-2">Start now</h2>
              <p className="text-sm text-slate-600 mb-4">Register or sign in to access your dashboard.</p>
              <AuthPanel onAuth={onAuth} />
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h3 className="text-2xl font-bold text-slate-900">Designed for clarity and balance</h3>
        <p className="mt-2 text-slate-600">Everything you need to understand and improve your cognitive budget.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Activity Ledger', desc: 'Log tasks, meetings, workouts, and breaks with drain scores.', icon: (
              <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4h10a2 2 0 0 1 2 2v12l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2h2Z"/></svg>
            ) },
            { title: 'Predictions', desc: 'See tomorrow’s energy curve based on recent patterns.', icon: (
              <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h3l3 7 4-14 3 7h5"/></svg>
            ) },
            { title: 'Alerts', desc: 'Get warned before you hit cognitive overdraft.', icon: (
              <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>
            ) },
            { title: 'Recommendations', desc: 'Personalized recovery ideas to replenish focus.', icon: (
              <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v6l4 2"/></svg>
            ) },
            { title: 'Plans', desc: 'Plan high‑impact work when your energy peaks.', icon: (
              <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M7 8h10M7 12h6M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/></svg>
            ) },
            { title: 'Premium Insights', desc: 'Advanced analytics for power users and teams.', icon: (
              <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12h4v8H3zM10 6h4v14h-4zM17 10h4v10h-4z"/></svg>
            ) },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition">
              <div className="flex items-center gap-3">
                {f.icon}
                <h4 className="font-semibold text-slate-900">{f.title}</h4>
              </div>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-slate-50 border-y border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-slate-900">Loved by focused people</h3>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {[
              { q: 'NeuroBank changed how I plan my weeks. I finally stop before I burn out.', a: 'Product Designer' },
              { q: 'The ledger + predictions made my schedule sustainable.', a: 'Graduate Student' },
            ].map((t, i) => (
              <blockquote key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <p className="text-slate-700">“{t.q}”</p>
                <footer className="mt-3 text-sm text-slate-500">— {t.a}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h3 className="text-2xl font-bold text-slate-900">Simple pricing</h3>
        <p className="mt-2 text-slate-600">Start free. Upgrade anytime for premium insights.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow">
            <h4 className="font-semibold text-slate-900">Free</h4>
            <div className="mt-1 text-3xl font-bold">$0 <span className="text-sm font-normal text-slate-500">/ mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Activity ledger</li>
              <li>• Basic predictions</li>
              <li>• Alerts and recommendations</li>
            </ul>
            <a href="#get-started" className="mt-6 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-white text-sm font-medium hover:bg-slate-800">Get started</a>
          </div>
          <div className="bg-white rounded-xl border border-indigo-300 p-6 shadow-lg ring-1 ring-indigo-200">
            <div className="inline-block px-2 py-0.5 text-xs bg-indigo-50 text-indigo-700 rounded">Popular</div>
            <h4 className="mt-2 font-semibold text-slate-900">Premium</h4>
            <div className="mt-1 text-3xl font-bold">$9 <span className="text-sm font-normal text-slate-500">/ mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Advanced analytics</li>
              <li>• Priority insights</li>
              <li>• Early access features</li>
            </ul>
            <a href="#get-started" className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-500">Upgrade</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-50 border-t border-slate-200 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-slate-900">FAQ</h3>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {[
              { q: 'Do I need a credit card to start?', a: 'No. Create a free account to begin. Upgrade anytime.' },
              { q: 'Is my data secure?', a: 'We use JWT auth and role‑based access. Keep your token private.' },
              { q: 'How do predictions work?', a: 'We use heuristics now and plan to ship an ML model soon.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Free tier remains available.' },
            ].map((f, i) => (
              <details key={i} className="bg-white rounded-xl border border-slate-200 p-4 open:shadow-sm">
                <summary className="cursor-pointer font-medium text-slate-900">{f.q}</summary>
                <p className="mt-2 text-sm text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">N</div>
              <span>NeuroBank</span>
            </div>
            <div className="space-x-4">
              <a href="#features" className="hover:text-slate-700">Features</a>
              <a href="#pricing" className="hover:text-slate-700">Pricing</a>
              <a href="#faq" className="hover:text-slate-700">FAQ</a>
            </div>
            <div>© {new Date().getFullYear()} NeuroBank</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
