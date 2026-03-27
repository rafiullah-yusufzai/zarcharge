// src/context/RechargeContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react'

const RechargeContext = createContext()

const initialState = {
  step: 1,
  phoneNumber: '',
  operator: null, // Will store operator name (AWCC, MTN, etc.)
  providerCode: null, // Will store provider_code (AWAF, MTAF, etc.)
  product: null,
  transaction: null,
  isLoading: false,
  error: null,
}

export const RechargeProvider = ({ children }) => {
  const [state, setState] = useState(initialState)

  const setStep = useCallback((step) => {
    setState((prev) => ({ ...prev, step }))
  }, [])

  const setPhoneNumber = useCallback((phoneNumber) => {
    setState((prev) => ({ ...prev, phoneNumber }))
  }, [])

  const setOperator = useCallback((operator) => {
    setState((prev) => ({ ...prev, operator }))
  }, [])

  const setProviderCode = useCallback((providerCode) => {
    setState((prev) => ({ ...prev, providerCode }))
  }, [])

  const setProduct = useCallback((product) => {
    setState((prev) => ({ ...prev, product }))
  }, [])

  const setTransaction = useCallback((transaction) => {
    setState((prev) => ({ ...prev, transaction }))
  }, [])

  const setLoading = useCallback((isLoading) => {
    setState((prev) => ({ ...prev, isLoading }))
  }, [])

  const setError = useCallback((error) => {
    setState((prev) => ({ ...prev, error }))
  }, [])

  const resetFlow = useCallback(() => {
    setState(initialState)
  }, [])

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: prev.step + 1 }))
  }, [])

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) }))
  }, [])

  return (
    <RechargeContext.Provider
      value={{
        ...state,
        setStep,
        setPhoneNumber,
        setOperator,
        setProviderCode,
        setProduct,
        setTransaction,
        setLoading,
        setError,
        resetFlow,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </RechargeContext.Provider>
  )
}

export const useRecharge = () => {
  const context = useContext(RechargeContext)
  if (!context) throw new Error('useRecharge must be used within RechargeProvider')
  return context
}