// src/components/ui/Loader.jsx
import React from 'react'

export const Loader = ({ size = 'md', variant = 'light', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  const variants = {
    light: 'border-white/30 border-t-primary',
    dark: 'border-dark/30 border-t-dark',
    primary: 'border-primary/30 border-t-primary',
  }

  return (
    <div className={`${sizes[size]} ${variants[variant]} rounded-full animate-spin ${className}`} />
  )
}