import { useState } from 'react';
import axios from 'axios';

export default function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5000${url}`, form);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      onAuth({ token, user });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex gap-2 mb-3">
        <button
          className={`px-3 py-1 rounded ${mode==='login' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setMode('login')}
        >Login</button>
        <button
          className={`px-3 py-1 rounded ${mode==='register' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setMode('register')}
        >Register</button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Create account')}
        </button>
      </form>
    </div>
  );
}
