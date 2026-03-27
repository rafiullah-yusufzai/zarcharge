// src/components/ui/Button.jsx
import React from 'react'
import { Loader } from './Loader'

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'relative overflow-hidden font-outfit font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary-dark text-dark hover:shadow-[0_15px_30px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none',
    secondary: 'bg-white/[0.03] border-2 border-white/[0.08] text-light hover:border-primary/30 hover:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-gray hover:text-primary transition-colors',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg uppercase tracking-wider',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader size="sm" variant="dark" />}
      {children}
    </button>
  )
}