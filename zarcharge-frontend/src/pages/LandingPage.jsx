import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateAfghanPhone, formatPhoneNumber, getOperatorColor, getDisplayNumber } from '../utils/validators'
import { fetchOperators } from '../services/api'
import { useRecharge } from '../context/RechargeContext'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'

export const LandingPage = () => {
  const navigate = useNavigate()
  const { setPhoneNumber, setOperator, setProviderCode, setLoading: setContextLoading } = useRecharge()
  const { addToast } = useToast()
  
  const [phone, setPhone] = useState('')
  const [detectedOp, setDetectedOp] = useState(null)
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [operators, setOperators] = useState([])

  // Recent activity data - you can replace with real data from your backend
  const [recentActivities, setRecentActivities] = useState([
    { amount: '200', operator: 'AWCC', time: 'Just now', country: 'Kabul' },
    { amount: '100', operator: 'Roshan', time: '2 mins ago', country: 'Herat' },
    { amount: '500', operator: 'MTN', time: '5 mins ago', country: 'Mazar' },
    { amount: '50', operator: 'Salaam', time: '8 mins ago', country: 'Kandahar' },
    { amount: '300', operator: 'Etisalat', time: '12 mins ago', country: 'Kabul' },
  ])

  useEffect(() => {
    loadOperators()
    // You can fetch real recent activity from your API here
    // fetchRecentActivity()
  }, [])

  const loadOperators = async () => {
    try {
      const data = await fetchOperators()
      setOperators(data)
      console.log('Loaded products:', data.length)
    } catch (error) {
      console.error('Failed to load operators:', error)
      addToast('Failed to load products. Please refresh the page.', 'error')
    }
  }

  const handlePhoneChange = (e) => {
    const inputValue = e.target.value
    const formatted = formatPhoneNumber(inputValue)
    setPhone(formatted)
    
    const validation = validateAfghanPhone(formatted)
    setIsValid(validation.isValid)
    setDetectedOp(validation.operator)
  }

  const handleContinue = async () => {
    const validation = validateAfghanPhone(phone)
    
    if (!validation.isValid) {
      addToast(validation.error, 'error')
      return
    }

    if (!validation.operator || !validation.providerCode) {
      addToast('Could not detect operator from this number', 'error')
      return
    }

    setIsLoading(true)
    setContextLoading(true)
    
    const productsForProvider = operators.filter(p => p.provider_code === validation.providerCode)
    
    if (productsForProvider.length === 0) {
      addToast(`No products available for ${validation.operator}. Please contact support.`, 'error')
      setIsLoading(false)
      setContextLoading(false)
      return
    }

    setPhoneNumber(validation.cleanNumber)
    setOperator(validation.operator)
    setProviderCode(validation.providerCode)
    
    navigate('/recharge', { state: { step: 2 } })
    
    setIsLoading(false)
    setContextLoading(false)
  }

  const opColor = detectedOp ? getOperatorColor(detectedOp) : null

  // Get operator icon color for activity items
  const getOperatorActivityColor = (operatorName) => {
    const colors = {
      'AWCC': '#FF6B6B',
      'MTN': '#FFE66D',
      'Roshan': '#4ECDC4',
      'Etisalat': '#A8E6CF',
      'Salaam': '#95E77E'
    }
    return colors[operatorName] || '#F59E0B'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-afghan-red/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section - Beautiful and prominent */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary-dark/50 rounded-2xl blur-xl animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-dark text-3xl mx-auto mb-3 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-outfit font-black text-light mb-1">Zarcharge</h1>
          <p className="text-gray font-inter text-sm">Instant mobile top-up to Afghanistan</p>
        </div>

        {/* Main Card */}
        <div className="fintech-card p-6 sm:p-8 relative group hover:scale-[1.02] transition-all duration-300">
          {/* Card Title */}
          <div className="mb-6">
            <p className="text-gray/70 text-center text-sm font-inter">
              Enter the mobile number you want to send top up
            </p>
          </div>

          {/* Phone Input */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
              <span className="text-primary font-outfit font-bold text-xl">+93</span>
              <span className="text-gray/30 text-lg">|</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="70 123 4567"
              maxLength={13}
              className="w-full bg-white/[0.03] border-2 border-white/[0.06] rounded-xl pl-24 pr-4 py-4 text-light font-outfit font-bold text-xl placeholder:text-gray/50 focus:outline-none focus:border-primary focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(245,158,11,0.1)] transition-all duration-300 text-center tracking-wider"
              autoFocus
            />
          </div>

          {/* Operator Detection Badge */}
          {detectedOp && isValid && (
            <div 
              className="flex items-center justify-between gap-2 mb-6 py-2 px-4 rounded-lg font-inter font-semibold text-sm animate-slide-up"
              style={{ 
                backgroundColor: `${opColor}15`,
                color: opColor,
                border: `1px solid ${opColor}30`
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: opColor }}></span>
                <span>{detectedOp}</span>
              </div>
              <span className="text-xs opacity-75">
                {getDisplayNumber(phone)}
              </span>
            </div>
          )}

          {/* Error Message */}
          {phone.length > 3 && !isValid && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-shake">
              <p className="text-red-400 text-sm font-inter text-center">
                Please enter a valid Afghan number (70, 71, 72, 76, 77, 78, 79)
              </p>
            </div>
          )}

          {/* Continue Button */}
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!isValid || isLoading}
            isLoading={isLoading}
            className="w-full relative overflow-hidden group"
          >
            <span className="relative z-10">
              {isLoading ? 'Checking availability...' : 'Continue to Recharge'}
            </span>
            {!isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            )}
          </Button>

          {/* Features Section - Professional SVG Icons */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
            {/* 30s Delivery */}
            <div className="text-center group">
              <div className="relative mb-2">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:bg-primary/20">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-primary/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="text-[11px] text-gray font-semibold uppercase tracking-wider font-inter">30s Delivery</p>
              <p className="text-[9px] text-gray/50 mt-0.5">Instant</p>
            </div>

            {/* Secure */}
            <div className="text-center group">
              <div className="relative mb-2">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:bg-primary/20">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V6a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-primary/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="text-[11px] text-gray font-semibold uppercase tracking-wider font-inter">Secure</p>
              <p className="text-[9px] text-gray/50 mt-0.5">Encrypted</p>
            </div>

            {/* No Fees */}
            <div className="text-center group">
              <div className="relative mb-2">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:bg-primary/20">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-primary/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="text-[11px] text-gray font-semibold uppercase tracking-wider font-inter">No Fees</p>
              <p className="text-[9px] text-gray/50 mt-0.5">0% Commission</p>
            </div>
          </div>
        </div>

        {/* Recent Activity / Social Proof Section */}
        <div className="mt-8 animate-fade-in-up">
          <p className="text-xs text-gray font-inter mb-4 uppercase tracking-wider flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-primary"></span>
            Recent Activity
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-primary"></span>
          </p>
          <div className="space-y-1.5">
            {recentActivities.map((item, idx) => {
              const operatorColor = getOperatorActivityColor(item.operator)
              return (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:bg-white/10 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${operatorColor}20` }}
                      >
                        <svg className="w-4 h-4" style={{ color: operatorColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-light font-semibold">{item.amount} AFN</p>
                        <span className="text-[10px] text-gray/50">•</span>
                        <p className="text-xs text-gray/70">{item.operator}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <svg className="w-3 h-3 text-gray/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-[9px] text-gray/50">{item.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-[10px] text-gray/60 font-medium">{item.time}</p>
                    </div>
                    <p className="text-[8px] text-gray/50 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">✓ Completed</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-white/20 flex items-center justify-center">
                  <span className="text-[8px] text-gray">✓</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray/60">
              <span className="text-primary font-semibold">1,234+</span> top-ups completed today
            </p>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-gray font-inter">Trusted by thousands of users</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage