// src/pages/ErrorPage.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export const ErrorPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-outfit font-black text-light mb-4">Oops!</h1>
        <p className="text-gray font-inter mb-8">
          Something went wrong. Please try again or contact support if the problem persists.
        </p>

        <div className="space-y-3">
          <Button onClick={() => navigate('/')} className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage