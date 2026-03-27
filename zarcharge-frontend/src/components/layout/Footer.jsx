// src/components/layout/Footer.jsx
import React from 'react'

export const Footer = () => {
  return (
    <footer className="bg-dark border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-dark">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-outfit font-extrabold text-gradient">Zarcharge</span>
          </div>
          
          <p className="text-gray font-inter max-w-md mb-6">
            Connecting families across borders with speed and trust. 
            Zar means gold, we deliver golden service.
          </p>
          
          <div className="flex items-center gap-6 mb-8">
            <a href="#" className="text-gray hover:text-primary font-inter text-sm transition-colors">About</a>
            <a href="#" className="text-gray hover:text-primary font-inter text-sm transition-colors">Fees</a>
            <a href="#" className="text-gray hover:text-primary font-inter text-sm transition-colors">Security</a>
            <a href="#" className="text-gray hover:text-primary font-inter text-sm transition-colors">Contact</a>
          </div>
          
          <div className="flex rounded-md overflow-hidden shadow-lg">
            <div className="w-12 h-7 bg-black" />
            <div className="w-12 h-7 bg-afghan-red" />
            <div className="w-12 h-7 bg-afghan-green" />
          </div>
          
          <p className="mt-6 text-sm text-gray font-inter">
            © 2024 Zarcharge. Fast transfers for Afghanistan.
          </p>
        </div>
      </div>
    </footer>
  )
}