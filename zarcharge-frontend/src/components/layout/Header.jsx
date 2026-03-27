// src/components/layout/Header.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-dark text-xl relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine" />
            </div>
            <div>
              <span className="text-2xl font-outfit font-extrabold text-gradient">Zarcharge</span>
              <p className="text-[10px] text-gray font-semibold uppercase tracking-[2.5px] -mt-1">Fast. Secure. Afghan.</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray hover:text-primary-light font-medium font-inter transition-colors">Home</Link>
            <Link to="/recharge" className="text-gray hover:text-primary-light font-medium font-inter transition-colors">Recharge</Link>
            <Link to="/recharge" className="bg-gradient-to-r from-primary to-primary-dark text-dark font-outfit font-bold px-5 py-2.5 rounded-lg hover:shadow-[0_8px_25px_rgba(245,158,11,0.4)] transition-all">
              Send Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}