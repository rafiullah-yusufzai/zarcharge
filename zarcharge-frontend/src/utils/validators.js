// src/utils/validators.js

/**
 * Validate Afghan phone number and detect operator
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result with operator and provider code
 */
export const validateAfghanPhone = (phone) => {
  // Remove all non-digit characters and spaces
  let cleanNumber = phone.toString().replace(/\D/g, '')
  
  // Store original for debugging
  const originalNumber = cleanNumber
  
  // Handle different formats intelligently
  let numberToValidate = cleanNumber
  
  // Case 1: Number starts with 93 (country code) - e.g., 93701234567
  if (cleanNumber.startsWith('93') && cleanNumber.length === 11) {
    numberToValidate = cleanNumber.substring(2)
  } 
  // Case 2: Number starts with 0 and is 10 digits - e.g., 0701234567
  else if (cleanNumber.startsWith('0') && cleanNumber.length === 10) {
    // Remove the leading zero, keep the remaining 9 digits
    numberToValidate = cleanNumber.substring(1)
    console.log(`Removed leading zero for validation: ${originalNumber} -> ${numberToValidate}`)
  }
  // Case 3: Number starts with 0 and has more than 10 digits (unlikely but handle)
  else if (cleanNumber.startsWith('0') && cleanNumber.length > 10) {
    // Remove all leading zeros until we get 9 digits or a non-zero
    while (numberToValidate.startsWith('0') && numberToValidate.length > 9) {
      numberToValidate = numberToValidate.substring(1)
    }
    console.log(`Removed multiple leading zeros: ${originalNumber} -> ${numberToValidate}`)
  }
  // Case 4: Number is already 9 digits (no leading zero or country code)
  else if (cleanNumber.length === 9) {
    numberToValidate = cleanNumber
  }
  
  // Final validation: should be 9 digits after processing
  if (numberToValidate.length !== 9) {
    console.log(`Invalid phone length: ${numberToValidate.length} (original: ${originalNumber})`)
    return { 
      isValid: false, 
      error: 'Please enter a valid 9-digit Afghan number', 
      operator: null, 
      providerCode: null,
      cleanNumber: numberToValidate,
      fullNumber: null,
      prefix: null
    }
  }
  
  // Get the first 2 digits for detection
  const firstTwoDigits = numberToValidate.substring(0, 2)
  
  console.log(`Detecting operator for: ${numberToValidate} (2-digit prefix: ${firstTwoDigits})`)
  
  // Operator detection based on Afghan mobile prefixes
  let operator = null
  
  switch (firstTwoDigits) {
    // AWCC (Afghan Wireless) - provider_code: AWAF
    // Prefixes: 70, 71, 72
    case '70':
    case '71':
    case '72':
      operator = { name: 'AWCC', providerCode: 'AWAF' }
      break
    
    // MTN/ATOMA - provider_code: MTAF
    // Prefix: 77
    case '77':
      operator = { name: 'MTN', providerCode: 'MTAF' }
      break
    
    // Etisalat - provider_code: ETAF
    // Prefix: 78
    case '78':
      operator = { name: 'Etisalat', providerCode: 'ETAF' }
      break
    
    // Roshan - provider_code: RHAF
    // Prefix: 79
    case '79':
      operator = { name: 'Roshan', providerCode: 'RHAF' }
      break
    
    // Salaam - provider_code: LJAF
    // Prefix: 76
    case '76':
      operator = { name: 'Salaam', providerCode: 'LJAF' }
      break
    
    default:
      operator = null
      break
  }
  
  if (!operator) {
    console.log(`No operator found for number: ${numberToValidate} (prefix: ${firstTwoDigits})`)
    return {
      isValid: false,
      error: `Number must start with 70, 71, 72, 76, 77, 78, or 79`,
      operator: null,
      providerCode: null,
      cleanNumber: numberToValidate,
      fullNumber: `93${numberToValidate}`,
      prefix: firstTwoDigits
    }
  }
  
  console.log(`✅ Detected operator: ${operator.name} (${operator.providerCode}) for number: ${numberToValidate}`)
  
  return {
    isValid: true,
    error: null,
    operator: operator.name,
    providerCode: operator.providerCode,
    cleanNumber: numberToValidate,
    fullNumber: `93${numberToValidate}`,
    prefix: firstTwoDigits,
    displayNumber: formatDisplayNumber(numberToValidate) // Add formatted display number
  }
}

/**
 * Format phone number for display (with country code, without leading zero)
 * @param {string} cleanNumber - The 9-digit clean number
 * @returns {string} Formatted display number
 */
export const formatDisplayNumber = (cleanNumber) => {
  if (!cleanNumber || cleanNumber.length !== 9) return ''
  return `+93 ${cleanNumber.slice(0, 2)} ${cleanNumber.slice(2, 5)} ${cleanNumber.slice(5)}`
}

/**
 * Format phone number as user types - KEEPS leading zero during typing
 * @param {string} value - Input value
 * @returns {string} Formatted phone number (with leading zero if user types it)
 */
export const formatPhoneNumber = (value) => {
  if (!value) return ''
  
  // Remove all non-digit characters
  let cleaned = value.toString().replace(/\D/g, '')
  
  // Allow up to 10 digits (to accommodate leading zero)
  const limited = cleaned.slice(0, 10)
  
  // Check if it has a leading zero
  const hasLeadingZero = limited.startsWith('0')
  
  // If only "0" is typed, show it
  if (limited === '0') {
    return '0'
  }
  
  // Remove leading zero for formatting if present
  let numberToFormat = limited
  if (hasLeadingZero && limited.length > 1) {
    numberToFormat = limited.substring(1)
  }
  
  // Format as "XX XXX XXXX" without the leading zero
  if (numberToFormat.length === 0) {
    return hasLeadingZero ? '0' : ''
  } else if (numberToFormat.length <= 2) {
    return hasLeadingZero ? `0${numberToFormat}` : numberToFormat
  } else if (numberToFormat.length <= 5) {
    const formatted = `${numberToFormat.slice(0, 2)} ${numberToFormat.slice(2)}`
    return hasLeadingZero ? `0${formatted}` : formatted
  } else {
    const formatted = `${numberToFormat.slice(0, 2)} ${numberToFormat.slice(2, 5)} ${numberToFormat.slice(5)}`
    return hasLeadingZero ? `0${formatted}` : formatted
  }
}

/**
 * Get the raw 9-digit number (without leading zero or country code)
 * @param {string} formattedPhone - Formatted phone number
 * @returns {string} Raw 9-digit number
 */
export const getRawPhoneNumber = (formattedPhone) => {
  if (!formattedPhone) return ''
  let cleaned = formattedPhone.toString().replace(/\D/g, '')
  
  // Remove leading zeros
  while (cleaned.startsWith('0') && cleaned.length > 9) {
    cleaned = cleaned.substring(1)
  }
  
  // If it has a leading zero and is 10 digits, remove the leading zero
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = cleaned.substring(1)
  }
  
  // If it starts with 93 and is 11 digits, remove country code
  if (cleaned.startsWith('93') && cleaned.length === 11) {
    cleaned = cleaned.substring(2)
  }
  
  return cleaned
}

/**
 * Get the display number with country code (no leading zero)
 * @param {string} phone - Phone number (can be with or without formatting)
 * @returns {string} Formatted display number
 */
export const getDisplayNumber = (phone) => {
  const validation = validateAfghanPhone(phone)
  if (validation.isValid) {
    return formatDisplayNumber(validation.cleanNumber)
  }
  return phone
}

// ... rest of the validators.js remains the same ...

export const detectOperator = (phone) => {
  const validation = validateAfghanPhone(phone)
  return validation.operator
}

export const detectProviderCode = (phone) => {
  const validation = validateAfghanPhone(phone)
  return validation.providerCode
}

export const getOperatorColor = (operator) => {
  const colors = {
    'AWCC': '#FF6B6B',
    'Roshan': '#4ECDC4',
    'MTN': '#FFE66D',
    'Etisalat': '#A8E6CF',
    'Salaam': '#95E77E'
  }
  return colors[operator] || '#F59E0B'
}

export const getOperatorIcon = (operator) => {
  const icons = {
    'AWCC': '📱',
    'Roshan': '📶',
    'MTN': '📞',
    'Etisalat': '🌐',
    'Salaam': '🕌'
  }
  return icons[operator] || '📱'
}

export const getSupportedOperators = () => {
  return [
    { 
      name: 'AWCC', 
      providerCode: 'AWAF', 
      prefixes: ['70', '71', '72'],
      color: '#FF6B6B',
      icon: '📱'
    },
    { 
      name: 'MTN', 
      providerCode: 'MTAF', 
      prefixes: ['77'],
      color: '#FFE66D',
      icon: '📞'
    },
    { 
      name: 'Roshan', 
      providerCode: 'RHAF', 
      prefixes: ['79'],
      color: '#4ECDC4',
      icon: '📶'
    },
    { 
      name: 'Etisalat', 
      providerCode: 'ETAF', 
      prefixes: ['78'],
      color: '#A8E6CF',
      icon: '🌐'
    },
    { 
      name: 'Salaam', 
      providerCode: 'LJAF', 
      prefixes: ['76'],
      color: '#95E77E',
      icon: '🕌'
    }
  ]
}

export const getProviderCodeFromOperator = (operatorName) => {
  const map = {
    'AWCC': 'AWAF',
    'MTN': 'MTAF',
    'Roshan': 'RHAF',
    'Etisalat': 'ETAF',
    'Salaam': 'LJAF'
  }
  return map[operatorName] || null
}

export const getOperatorFromProviderCode = (providerCode) => {
  const map = {
    'AWAF': 'AWCC',
    'MTAF': 'MTN',
    'RHAF': 'Roshan',
    'ETAF': 'Etisalat',
    'LJAF': 'Salaam'
  }
  return map[providerCode] || null
}

export const filterProductsByProviderCode = (providerCode, productsList) => {
  if (!providerCode || !productsList) return []
  return productsList.filter(product => product.provider_code === providerCode)
}

export const getValidPrefixes = () => {
  return {
    'AWCC': ['70', '71', '72'],
    'MTN': ['77'],
    'Roshan': ['79'],
    'Etisalat': ['78'],
    'Salaam': ['76']
  }
}