import React, { useState, useEffect } from 'react'
import { useRecharge } from '../../context/RechargeContext'
import { useToast } from '../../context/ToastContext'
import { fetchProducts } from '../../services/api'
import { getOperatorColor, getDisplayNumber } from '../../utils/validators'
import { Button } from '../../components/ui/Button'
import { Loader } from '../../components/ui/Loader'
import { formatCurrency } from '../../utils/formatters'

// Import operator logos from src/assets/logos/
import awccLogo from '../../assets/logos/awcc.png'
import mtnLogo from '../../assets/logos/mtn.png'
import roshanLogo from '../../assets/logos/roshan.png'
import etisalatLogo from '../../assets/logos/etisalat.png'

const StepProduct = () => {
  const { phoneNumber, operator, providerCode, product, setProduct, nextStep, setOperator } = useRecharge()
  const { addToast } = useToast()
  
  const [products, setProducts] = useState([])
  const [packages, setPackages] = useState([])
  const [topups, setTopups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [operatorData, setOperatorData] = useState(null)
  const [activeTab, setActiveTab] = useState('topups')

  useEffect(() => {
    if (providerCode) {
      loadProducts()
    } else if (operator) {
      loadProducts()
    }
  }, [providerCode, operator])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const codeOrName = providerCode || operator
      const data = await fetchProducts(codeOrName)
      const productsList = Array.isArray(data) ? data : (data.results || data.data || [])
      
      // Separate packages/plans from top-ups
      const packagesList = productsList.filter(product => {
        const name = product.name?.toLowerCase() || ''
        return name.includes('min') || 
               name.includes('gb') || 
               name.includes('mb') || 
               name.includes('bundle') ||
               name.includes('daily') ||
               name.includes('weekly') ||
               name.includes('monthly') ||
               name.includes('app')
      })
      
      const topupsList = productsList.filter(product => {
        const name = product.name?.toLowerCase() || ''
        return name.includes('afn') || 
               (!packagesList.includes(product) && !name.includes('min') && !name.includes('gb'))
      })
      
      // Sort packages by type (daily, weekly, monthly) and then by value
      const sortedPackages = packagesList.sort((a, b) => {
        const aName = a.name?.toLowerCase() || ''
        const bName = b.name?.toLowerCase() || ''
        
        const getPriority = (name) => {
          if (name.includes('daily')) return 1
          if (name.includes('weekly')) return 2
          if (name.includes('monthly')) return 3
          return 4
        }
        
        const aPriority = getPriority(aName)
        const bPriority = getPriority(bName)
        
        if (aPriority !== bPriority) return aPriority - bPriority
        return parseFloat(a.receive_value || 0) - parseFloat(b.receive_value || 0)
      })
      
      // Sort top-ups by amount (smallest to largest)
      const sortedTopups = topupsList.sort((a, b) => 
        parseFloat(a.receive_value || 0) - parseFloat(b.receive_value || 0)
      )
      
      setPackages(sortedPackages)
      setTopups(sortedTopups)
      setProducts(productsList)
      
      if (sortedTopups.length > 0) {
        setActiveTab('topups')
      } else if (sortedPackages.length > 0) {
        setActiveTab('packages')
      }
      
      if (productsList.length > 0) {
        const operatorName = productsList[0].operator_name || operator || getOperatorNameFromCode(productsList[0].provider_code)
        setOperatorData({
          name: operatorName,
          color: getOperatorColor(operatorName),
          logo: getOperatorLogo(operatorName)
        })
      }
      
      console.log(`Loaded: ${sortedTopups.length} top-ups, ${sortedPackages.length} packages`)
    } catch (error) {
      console.error('Failed to load products:', error)
      addToast('Failed to load products. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

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

  const getOperatorLogo = (operatorName) => {
    const logos = {
      'AWCC': awccLogo,
      'MTN': mtnLogo,
      'Roshan': roshanLogo,
      'Etisalat': etisalatLogo,
      'Salaam': salaamLogo
    }
    return logos[operatorName] || null
  }

  const handleSelect = (prod) => {
    setProduct(prod)
    setTimeout(() => {
      nextStep()
    }, 200)
  }

  const handleChangeNumber = () => {
    setOperator(null)
    setProduct(null)
    window.location.href = '/'
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader size="lg" />
        <p className="mt-4 text-gray font-inter">Loading available amounts...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray font-inter mb-4">No products available for this operator.</p>
        <Button variant="secondary" onClick={handleChangeNumber}>
          Change Number
        </Button>
      </div>
    )
  }

  const opColor = operatorData?.color || '#f59e0b'
  const displayNumber = getDisplayNumber(phoneNumber)
  const operatorLogo = operatorData?.logo

  return (
    <div>
      <div className="text-center mb-6">
        <div 
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-inter font-semibold mb-3"
          style={{ 
            backgroundColor: `${opColor}20`,
            border: `1px solid ${opColor}40`
          }}
        >
          {operatorLogo && (
            <img 
              src={operatorLogo} 
              alt={operatorData?.name} 
              className="w-6 h-6 object-contain"
              onError={(e) => {
                console.error(`Failed to load logo for ${operatorData?.name}:`, operatorLogo)
                e.target.style.display = 'none'
              }}
            />
          )}
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opColor }}></span>
          <span style={{ color: opColor }}>{operatorData?.name}</span>
        </div>
        <h2 className="text-2xl font-outfit font-bold text-light mb-1">Select Amount</h2>
        <p className="text-gray font-inter text-sm">Choose how much to send to <span className="font-bold text-light">{displayNumber}</span></p>
      </div>

      {/* Tab Navigation - Only show if both packages and top-ups exist */}
      {topups.length > 0 && packages.length > 0 && (
        <div className="flex gap-2 mb-6 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('topups')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-inter font-medium transition-all duration-200 ${
              activeTab === 'topups'
                ? 'bg-primary text-dark'
                : 'text-gray hover:text-light'
            }`}
          >
            Top-up Amounts
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-inter font-medium transition-all duration-200 ${
              activeTab === 'packages'
                ? 'bg-primary text-dark'
                : 'text-gray hover:text-light'
            }`}
          >
            Packages & Plans
          </button>
        </div>
      )}

      {/* Top-ups Section - First */}
      {activeTab === 'topups' && topups.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {topups.map((prod) => {
            const isSelected = product?.id === prod.id
            const receiveValue = prod.receive_value || 0
            const currency = prod.receive_currency || 'AFN'
            const sendValue = prod.send_value || 0
            const sendCurrency = prod.send_currency || 'GBP'
            
            return (
              <button
                key={prod.id}
                onClick={() => handleSelect(prod)}
                className={`
                  relative p-4 rounded-xl text-left transition-all duration-200
                  ${isSelected 
                    ? 'bg-primary/10 border-2 border-primary shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
                    : 'bg-white/[0.03] border-2 border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.05]'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                {/* Top-up Amount - Gold color */}
                <div className="mb-1">
                  <span className="text-2xl font-outfit font-black text-primary">
                    {receiveValue}
                  </span>
                  <span className="text-sm font-inter text-gray ml-1">{currency}</span>
                </div>
                
                {/* You Pay - White color */}
                {sendValue > 0 && (
                  <div className="text-sm font-inter text-light font-semibold mt-1">
                    ≈ {formatCurrency(sendValue, sendCurrency)}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Packages Section - Second */}
      {activeTab === 'packages' && packages.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {packages.map((prod) => {
            const isSelected = product?.id === prod.id
            const receiveValue = prod.receive_value || 0
            const currency = prod.receive_currency || 'AFN'
            const sendValue = prod.send_value || 0
            const sendCurrency = prod.send_currency || 'GBP'
            
            return (
              <button
                key={prod.id}
                onClick={() => handleSelect(prod)}
                className={`
                  relative p-4 rounded-xl text-left transition-all duration-200
                  ${isSelected 
                    ? 'bg-primary/10 border-2 border-primary shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
                    : 'bg-white/[0.03] border-2 border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.05]'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                {/* Package Name */}
                <div className="font-outfit font-bold text-light text-sm mb-2">
                  {prod.name}
                </div>
                
                {/* Price - Gold color */}
                <div className="mb-1">
                  <span className="text-xl font-outfit font-black text-primary">
                    {receiveValue}
                  </span>
                  <span className="text-xs font-inter text-gray ml-1">{currency}</span>
                </div>
                
                {/* You Pay - White color */}
                {sendValue > 0 && (
                  <div className="text-xs font-inter text-light mt-1">
                    ≈ {formatCurrency(sendValue, sendCurrency)}
                  </div>
                )}

                {/* Validity - Light gray */}
                {prod.validity && prod.validity !== '' && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-[10px] text-gray/70 font-inter">
                      Valid: {prod.validity.replace('P', '').replace('D', ' days')}
                    </p>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Show message if no products in active tab */}
      {activeTab === 'topups' && topups.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray font-inter">No top-up amounts available for this operator</p>
          {packages.length > 0 && (
            <button
              onClick={() => setActiveTab('packages')}
              className="mt-2 text-primary text-sm font-inter hover:underline"
            >
              View packages instead
            </button>
          )}
        </div>
      )}
      
      {activeTab === 'packages' && packages.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray font-inter">No packages available for this operator</p>
          {topups.length > 0 && (
            <button
              onClick={() => setActiveTab('topups')}
              className="mt-2 text-primary text-sm font-inter hover:underline"
            >
              View top-up amounts instead
            </button>
          )}
        </div>
      )}

      <button 
        onClick={handleChangeNumber}
        className="w-full text-center text-sm text-gray hover:text-primary font-inter py-2 transition-colors"
      >
        Change phone number
      </button>
    </div>
  )
}

// Explicit named export
export { StepProduct }

// Also export as default for flexibility
export default StepProduct