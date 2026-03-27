// src/pages/SuccessPage.jsx
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export const SuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const transaction = location.state?.transaction || {}

  const handleNewTopUp = () => {
    navigate('/')
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="fintech-card p-6 sm:p-8 text-center">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-outfit font-bold text-light mb-2">
            Top-up Successful!
          </h1>
          
          <p className="text-gray font-inter mb-6">
            Your recharge has been sent successfully
          </p>

          <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between mb-3">
              <span className="text-gray text-sm">Transaction ID:</span>
              <span className="text-light font-mono text-sm">{transaction.transaction_id || 'N/A'}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray text-sm">Phone Number:</span>
              <span className="text-light font-medium">{transaction.data?.phone_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray text-sm">Amount:</span>
              <span className="text-primary font-bold">
                {transaction.data?.product?.receive_value || '0'} {transaction.data?.product?.receive_currency || 'AFN'}
              </span>
            </div>
          </div>

          <Button onClick={handleNewTopUp} className="w-full">
            Send Another Top-up
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage