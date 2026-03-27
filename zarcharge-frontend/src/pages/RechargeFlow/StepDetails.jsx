import React, { useState, useEffect } from 'react'
import { useRecharge } from '../../context/RechargeContext'
import { useToast } from '../../context/ToastContext'
import { fetchOperators } from '../../services/api'
import { validateAfghanPhone, formatPhoneNumber } from '../../utils/validators'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Loader } from '../../components/ui/Loader'

export const StepDetails = () => {
  const { phoneNumber, setPhoneNumber, operator, setOperator, nextStep, setLoading, isLoading } = useRecharge()
  const { addToast } = useToast()
  
  const [operators, setOperators] = useState([])
  const [isLoadingOperators, setIsLoadingOperators] = useState(true)
  const [phoneError, setPhoneError] = useState('')
  const [operatorError, setOperatorError] = useState('')

  useEffect(() => {
    loadOperators()
  }, [])

  const loadOperators = async () => {
    try {
      setIsLoadingOperators(true)
      const data = await fetchOperators()
      
      // Handle different API response formats
      // If your API returns { results: [...] } or just [...]
      const operatorsList = Array.isArray(data) ? data : (data.results || data.data || [])
      
      setOperators(operatorsList.map(op => ({ 
        value: op.id, 
        label: op.name || op.operator_name || op.title 
      })))
    } catch (error) {
      console.error('Failed to load operators:', error)
      addToast('Failed to load operators. Please try again.', 'error')
    } finally {
      setIsLoadingOperators(false)
    }
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
    setPhoneError('')
  }

  const handleContinue = () => {
    // Validate phone
    const phoneValidation = validateAfghanPhone(phoneNumber)
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error)
      return
    }

    // Validate operator
    if (!operator) {
      setOperatorError('Please select an operator')
      return
    }

    nextStep()
  }

  const isValid = phoneNumber.length >= 9 && operator

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-outfit font-bold text-light mb-2">Enter Details</h2>
        <p className="text-gray font-inter">Provide the recipient's information</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs text-gray font-semibold uppercase tracking-[1.5px] font-inter mb-2">
            Afghan Phone Number
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-outfit font-bold text-lg z-10">+93</span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="70 123 4567"
              maxLength={12}
              className="w-full bg-white/[0.03] border-2 border-white/[0.06] rounded-xl pl-16 pr-4 py-3 text-light font-outfit font-semibold text-lg placeholder:text-gray/50 focus:outline-none focus:border-primary focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(245,158,11,0.1)] transition-all duration-300"
            />
          </div>
          {phoneError && (
            <p className="mt-2 text-sm text-red-500 font-inter">{phoneError}</p>
          )}
        </div>

        {isLoadingOperators ? (
          <div className="flex items-center justify-center py-8">
            <Loader />
          </div>
        ) : (
          <div>
            <label className="block text-xs text-gray font-semibold uppercase tracking-[1.5px] font-inter mb-2">
              Select Operator
            </label>
            <div className="relative">
              <select
                value={operator || ''}
                onChange={(e) => {
                  setOperator(e.target.value)
                  setOperatorError('')
                }}
                className="w-full bg-white/[0.03] border-2 border-white/[0.06] rounded-xl px-4 py-3 text-light font-outfit font-semibold text-lg appearance-none cursor-pointer focus:outline-none focus:border-primary focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(245,158,11,0.1)] transition-all duration-300"
              >
                <option value="" disabled className="bg-dark text-gray">Choose operator...</option>
                {operators.map((op) => (
                  <option key={op.value} value={op.value} className="bg-dark text-light">
                    {op.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {operatorError && (
              <p className="mt-2 text-sm text-red-500 font-inter">{operatorError}</p>
            )}
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button
          size="lg"
          isLoading={isLoading}
          disabled={!isValid || isLoadingOperators}
          onClick={handleContinue}
          className="w-full"
        >
          Continue
        </Button>
      </div>

      <p className="text-center text-sm text-gray font-inter">
        Supported: AWCC, MTN, Etisalat, Salaam
      </p>
    </div>
  )
}