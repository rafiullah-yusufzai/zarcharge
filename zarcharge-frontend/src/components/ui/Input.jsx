// src/components/ui/Input.jsx
import React, { forwardRef } from 'react'

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-gray font-semibold uppercase tracking-[1.5px] font-inter mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg" />
        )}
        <input
          ref={ref}
          className={`
            w-full bg-white/[0.03] border-2 border-white/[0.06] rounded-xl 
            px-4 py-3 text-light font-outfit font-semibold text-lg
            placeholder:text-gray/50
            focus:outline-none focus:border-primary focus:bg-white/[0.05]
            focus:shadow-[0_0_0_4px_rgba(245,158,11,0.1)]
            transition-all duration-300
            ${Icon ? 'pl-12' : ''}
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 font-inter">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'