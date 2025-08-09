import { useState } from 'react'
import './App.css'
import ApiTest from './components/ApiTest'

function App() {
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
          
          <div className="mt-8">
            <ApiTest />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
