// src/utils/formatters.js

/**
 * Format currency with proper symbol and decimal places
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (GBP, AFN, USD, etc.)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'GBP') => {
  if (!amount && amount !== 0) return 'N/A'
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  } catch (error) {
    // Fallback if currency code is invalid
    return `${currency} ${amount.toFixed(2)}`
  }
}

/**
 * Format phone number for display (XX XXX XXXX)
 * @param {string} phone - Phone number (can be with or without formatting)
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumberDisplay = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digit characters
  let cleaned = phone.toString().replace(/\D/g, '')
  
  // Handle different formats
  let numberToFormat = cleaned
  
  // If it starts with 93 and is 11 digits, remove the country code
  if (cleaned.startsWith('93') && cleaned.length === 11) {
    numberToFormat = cleaned.substring(2)
  }
  // If it starts with 0 and is 10 digits, remove the leading zero
  else if (cleaned.startsWith('0') && cleaned.length === 10) {
    numberToFormat = cleaned.substring(1)
  }
  // If it's already 9 digits, use as is
  else if (cleaned.length === 9) {
    numberToFormat = cleaned
  }
  
  // Format as "XX XXX XXXX"
  if (numberToFormat.length === 9) {
    return `${numberToFormat.slice(0, 2)} ${numberToFormat.slice(2, 5)} ${numberToFormat.slice(5)}`
  }
  
  // If not 9 digits, return the cleaned number
  return cleaned
}

/**
 * Format full phone number with country code
 * @param {string} phone - Phone number (with or without country code)
 * @returns {string} Full phone number with +93 prefix
 */
export const formatFullPhoneNumber = (phone) => {
  if (!phone) return ''
  
  const cleaned = phone.toString().replace(/\D/g, '')
  let numberToFormat = cleaned
  
  // Remove leading zero if present
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    numberToFormat = cleaned.substring(1)
  }
  // Remove country code if already present
  else if (cleaned.startsWith('93') && cleaned.length === 11) {
    numberToFormat = cleaned.substring(2)
  }
  
  // Ensure we have 9 digits
  if (numberToFormat.length === 9) {
    return `+93${numberToFormat}`
  }
  
  return `+93${cleaned}`
}

/**
 * Get the raw phone number (digits only, 9 digits)
 * @param {string} phone - Formatted or unformatted phone
 * @returns {string} Raw 9-digit phone number
 */
export const getRawPhoneNumber = (phone) => {
  if (!phone) return ''
  
  let cleaned = phone.toString().replace(/\D/g, '')
  
  // Remove country code if present
  if (cleaned.startsWith('93') && cleaned.length === 11) {
    cleaned = cleaned.substring(2)
  }
  // Remove leading zero if present
  else if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = cleaned.substring(1)
  }
  
  return cleaned
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

/**
 * Format validity period (P30D -> 30 days, P01D -> 1 day)
 * @param {string} validity - Validity period in ISO 8601 format
 * @returns {string} Human readable validity period
 */
export const formatValidity = (validity) => {
  if (!validity || validity === '') return ''
  
  // Remove 'P' and convert to readable format
  let formatted = validity.replace('P', '')
  
  if (formatted.endsWith('D')) {
    const days = parseInt(formatted.replace('D', ''))
    return `${days} day${days !== 1 ? 's' : ''}`
  }
  
  if (formatted.endsWith('M')) {
    const months = parseInt(formatted.replace('M', ''))
    return `${months} month${months !== 1 ? 's' : ''}`
  }
  
  if (formatted.endsWith('Y')) {
    const years = parseInt(formatted.replace('Y', ''))
    return `${years} year${years !== 1 ? 's' : ''}`
  }
  
  return validity
}

/**
 * Format large numbers with commas (1000 -> 1,000)
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (number) => {
  if (!number && number !== 0) return '0'
  
  return new Intl.NumberFormat('en-US').format(number)
}

/**
 * Format percentage (0.07 -> 7%)
 * @param {number} rate - Rate as decimal
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (rate) => {
  if (!rate && rate !== 0) return '0%'
  
  return `${Math.round(rate * 100)}%`
}

/**
 * Format transaction ID for display (truncate middle)
 * @param {string} id - Transaction ID
 * @returns {string} Formatted transaction ID
 */
export const formatTransactionId = (id) => {
  if (!id) return ''
  
  const str = id.toString()
  if (str.length <= 12) return str
  
  return `${str.slice(0, 6)}...${str.slice(-6)}`
}

/**
 * Format operator name for display
 * @param {string} operatorName - Operator name
 * @returns {string} Formatted operator name
 */
export const formatOperatorName = (operatorName) => {
  if (!operatorName) return 'Unknown'
  
  const formatted = operatorName.charAt(0).toUpperCase() + operatorName.slice(1).toLowerCase()
  
  // Handle special cases
  if (formatted === 'Awcc') return 'AWCC'
  if (formatted === 'Mtn') return 'MTN'
  
  return formatted
}

/**
 * Format amount with currency symbol (short version for buttons)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Short formatted currency
 */
export const formatCurrencyShort = (amount, currency = 'AFN') => {
  if (!amount && amount !== 0) return 'N/A'
  
  const symbols = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€',
    'AFN': '؋'
  }
  
  const symbol = symbols[currency] || currency
  return `${symbol}${Math.round(amount)}`
}

/**
 * Check if string is valid JSON
 * @param {string} str - String to check
 * @returns {boolean} True if valid JSON
 */
export const isValidJSON = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return ''
  if (text.length <= length) return text
  return `${text.slice(0, length)}...`
}

/**
 * Format bytes to human readable size
 * @param {number} bytes - Bytes to format
 * @returns {string} Formatted size
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Format phone number with country code for display
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone with +93
 */
export const formatPhoneWithCountry = (phone) => {
  const raw = getRawPhoneNumber(phone)
  if (raw.length === 9) {
    return `+93 ${raw.slice(0, 2)} ${raw.slice(2, 5)} ${raw.slice(5)}`
  }
  return phone
}