// src/pages/RechargeFlow/StepSummary.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecharge } from '../../context/RechargeContext'
import { useToast } from '../../context/ToastContext'
import { createTransaction } from '../../services/api'
import { getOperatorColor, getDisplayNumber } from '../../utils/validators'
import { Button } from '../../components/ui/Button'
import { Loader } from '../../components/ui/Loader'
import { formatCurrency } from '../../utils/formatters'

const StepSummary = () => {
  const navigate = useNavigate()
  const { phoneNumber, product, providerCode, prevStep, resetFlow } = useRecharge()
  const { addToast } = useToast()
  
  const [isProcessing, setIsProcessing] = useState(false)

  // Extract values from product
  const sendValue = product.send_value || 0
  const sendCurrency = product.send_currency || 'GBP'
  const receiveValue = product.receive_value || 0
  const receiveCurrency = product.receive_currency || 'AFN'
  const operatorName = product.operator_name || getOperatorNameFromCode(product.provider_code) || 'Operator'
  const opColor = getOperatorColor(operatorName)

  const getOperatorNameFromCode = (code) => {
    const map = {
      'AWAF': 'AWCC',
      'MTAF': 'MTN',
      'RHAF': 'Roshan',
      'LJAF': 'Salaam',
      'ETAF': 'Etisalat'
    }
    return map[code] || code
  }

  const handleConfirm = async () => {
    setIsProcessing(true)
    
    try {
      const transaction = await createTransaction({
        phone_number: phoneNumber, // This should be the 9-digit number
        product_id: product.id,
        provider_code: providerCode || product.provider_code,
      })
      
      if (transaction.status === 'success') {
        addToast('Top-up successful!', 'success')
        navigate('/success', { state: { transaction } })
        resetFlow()
      } else {
        throw new Error(transaction.message || 'Transaction failed')
      }
    } catch (error) {
      console.error('Transaction failed:', error)
      addToast(error.message || 'Transaction failed. Please try again.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const displayNumber = getDisplayNumber(phoneNumber)

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-outfit font-bold text-light mb-1">Confirm</h2>
        <p className="text-gray font-inter text-sm">Review and complete your recharge</p>
      </div>

      <div className="bg-white/[0.03] rounded-2xl p-6 mb-6 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
          <span className="text-gray font-inter text-sm">Operator</span>
          <div 
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-inter font-semibold"
            style={{ 
              backgroundColor: `${opColor}20`,
              color: opColor,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opColor }}></span>
            {operatorName}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
          <span className="text-gray font-inter text-sm">Phone Number</span>
          <span className="text-light font-outfit font-bold text-lg">{displayNumber}</span>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
          <span className="text-gray font-inter text-sm">Package</span>
          <span className="text-light font-inter font-medium">{product.name}</span>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
          <span className="text-gray font-inter text-sm">You Pay</span>
          <span className="text-primary font-outfit font-bold text-xl">
            {formatCurrency(sendValue, sendCurrency)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray font-inter text-sm">They Receive</span>
          <div className="text-right">
            <span className="text-3xl font-outfit font-black text-light block">
              {receiveValue}
            </span>
            <span className="text-sm text-gray font-inter">{receiveCurrency}</span>
          </div>
        </div>

        {product.validity && product.validity !== '' && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
            <span className="text-gray font-inter text-sm">Validity</span>
            <span className="text-light font-inter text-sm">
              {product.validity.replace('P', '').replace('D', ' days')}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 bg-success/10 border border-success/20 rounded-xl p-4 mb-6">
        <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-success font-inter text-sm">
          No hidden fees. The recipient will receive exactly <strong>{receiveValue} {receiveCurrency}</strong>. Delivery usually takes under 30 seconds.
        </p>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={handleConfirm} 
          isLoading={isProcessing}
          disabled={isProcessing}
          size="lg"
          className="w-full"
        >
          {isProcessing ? 'Processing...' : `Pay ${formatCurrency(sendValue, sendCurrency)}`}
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={prevStep}
          disabled={isProcessing}
          className="w-full"
        >
          Back to Amount Selection
        </Button>
      </div>
    </div>
  )
}

export { StepSummary }
export default StepSummary