// src/pages/RechargeFlow/RechargeFlow.jsx
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecharge } from '../../context/RechargeContext'
import StepProduct from './StepProduct'
import StepSummary from './StepSummary'

export const RechargeFlow = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { step, setStep, operator, phoneNumber } = useRecharge()

  // Redirect to home if no phone/operator selected
  useEffect(() => {
    if (!operator || !phoneNumber) {
      navigate('/')
    }
  }, [operator, phoneNumber, navigate])

  // Handle auto-redirect from landing page
  useEffect(() => {
    if (location.state?.step) {
      setStep(location.state.step)
      // Clear state to prevent re-triggering
      window.history.replaceState({}, document.title)
    }
  }, [location.state, setStep])

  // Show nothing while redirecting
  if (!operator || !phoneNumber) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Simple Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
            <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-primary' : 'bg-gray'}`} />
            <span className="text-xs text-gray font-inter uppercase tracking-wider">
              {step === 2 ? 'Select Amount' : 'Confirm Payment'}
            </span>
            <div className={`w-2 h-2 rounded-full ${step === 3 ? 'bg-primary' : 'bg-gray'}`} />
          </div>
        </div>

        {/* Main Card */}
        <div className="fintech-card p-6 sm:p-8 relative">
          {/* Top Border Glow */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary-dark to-primary border-glow rounded-t-3xl" />
          
          {/* Step Content */}
          {step === 2 && <StepProduct />}
          {step === 3 && <StepSummary />}
        </div>
      </div>
    </div>
  )
}

export default RechargeFlow