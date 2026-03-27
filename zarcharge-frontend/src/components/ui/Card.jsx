// src/components/ui/Card.jsx
import React from 'react'

export const Card = ({
  children,
  isSelected = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'bg-primary/10 border-2 border-primary shadow-[0_0_25px_rgba(245,158,11,0.15)]' 
          : 'bg-white/[0.02] border-2 border-white/[0.06] hover:border-primary/25 hover:bg-white/[0.04] hover:-translate-y-1'
        }
        ${className}
      `}
      {...props}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      {children}
    </div>
  )
}