// src/components/ui/Select.jsx
import React, { forwardRef } from 'react'

export const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select...',
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
        <select
          ref={ref}
          className={`
            w-full bg-white/[0.03] border-2 border-white/[0.06] rounded-xl 
            px-4 py-3 text-light font-outfit font-semibold text-lg
            appearance-none cursor-pointer
            focus:outline-none focus:border-primary focus:bg-white/[0.05]
            focus:shadow-[0_0_0_4px_rgba(245,158,11,0.1)]
            transition-all duration-300
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled className="bg-dark text-gray">{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-dark text-light"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 font-inter">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'