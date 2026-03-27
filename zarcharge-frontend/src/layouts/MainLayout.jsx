// src/layouts/MainLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { useToast } from '../context/ToastContext'

export const MainLayout = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="min-h-screen flex flex-col bg-darker">
      <Header />
      
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Toast Container */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl border backdrop-blur-xl animate-slide-in ${
              toast.type === 'success' ? 'bg-success/10 border-success/30 text-success' :
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
              'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
            }`}
          >
            <p className="font-inter font-medium">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainLayout