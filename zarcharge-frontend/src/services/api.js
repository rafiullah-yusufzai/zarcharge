import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || 
                   error.response?.data?.message || 
                   error.message || 
                   'An error occurred'
    return Promise.reject({ message, status: error.response?.status })
  }
)

// Helper function to get operator name from provider code
const getOperatorNameFromCode = (providerCode) => {
  const codeToOperatorMap = {
    'AWAF': 'AWCC',
    'MTAF': 'MTN',
    'RHAF': 'Roshan',
    'ETAF': 'Etisalat',
    'LJAF': 'Salaam'
  }
  return codeToOperatorMap[providerCode] || providerCode
}

// Helper function to get provider code from operator name
const getProviderCodeFromName = (operatorName) => {
  const operatorToCodeMap = {
    'AWCC': 'AWAF',
    'MTN': 'MTAF',
    'Roshan': 'RHAF',
    'Etisalat': 'ETAF',
    'Salaam': 'LJAF'
  }
  return operatorToCodeMap[operatorName] || operatorName
}

// Fetch all operators/products
export const fetchOperators = async () => {
  try {
    const response = await apiClient.get('/operators/')
    const data = response.data
    
    // Ensure we return an array
    const operatorsList = Array.isArray(data) ? data : (data.results || data.data || [])
    
    // Add operator_name to each product for easier access
    const enhancedOperators = operatorsList.map(operator => ({
      ...operator,
      operator_name: getOperatorNameFromCode(operator.provider_code),
      operator_code: operator.provider_code
    }))
    
    console.log(`Fetched ${enhancedOperators.length} products from /operators/ endpoint`)
    
    // Log distribution by provider code for debugging
    const distribution = {}
    enhancedOperators.forEach(op => {
      const code = op.provider_code
      distribution[code] = (distribution[code] || 0) + 1
    })
    console.log('Products by provider code:', distribution)
    
    return enhancedOperators
  } catch (error) {
    console.error('Error fetching operators:', error)
    throw error
  }
}

// Fetch products - filters on the frontend since backend doesn't have filtering
export const fetchProducts = async (identifier) => {
  try {
    // First fetch all operators/products
    const allProducts = await fetchOperators()
    
    if (!identifier) {
      // If no identifier, return all products
      return allProducts
    }
    
    let filteredProducts = []
    
    // Check if identifier is a provider code (AWAF, MTAF, etc.)
    const providerCodes = ['AWAF', 'MTAF', 'RHAF', 'LJAF', 'ETAF']
    
    if (providerCodes.includes(identifier)) {
      // Filter by provider_code
      filteredProducts = allProducts.filter(product => 
        product.provider_code === identifier
      )
      console.log(`Filtered ${filteredProducts.length} products for provider code: ${identifier}`)
    } 
    else if (typeof identifier === 'number' || !isNaN(identifier)) {
      // It's a numeric operator ID - your products might have an operator_id field
      filteredProducts = allProducts.filter(product => 
        product.operator_id === parseInt(identifier) || 
        product.id === parseInt(identifier)
      )
      console.log(`Filtered ${filteredProducts.length} products for operator ID: ${identifier}`)
    } 
    else {
      // It's an operator name, convert to provider code and filter
      const providerCode = getProviderCodeFromName(identifier)
      if (providerCode && providerCode !== identifier) {
        filteredProducts = allProducts.filter(product => 
          product.provider_code === providerCode
        )
        console.log(`Filtered ${filteredProducts.length} products for operator: ${identifier} (${providerCode})`)
      } else {
        // Try to search by name in product name
        filteredProducts = allProducts.filter(product => 
          product.name?.toLowerCase().includes(identifier.toLowerCase()) ||
          product.provider_code?.toLowerCase().includes(identifier.toLowerCase())
        )
        console.log(`Searched products for: ${identifier}, found ${filteredProducts.length}`)
      }
    }
    
    // Log sample products for debugging
    if (filteredProducts.length > 0) {
      console.log('Sample filtered product:', {
        id: filteredProducts[0].id,
        name: filteredProducts[0].name,
        provider_code: filteredProducts[0].provider_code,
        receive_value: filteredProducts[0].receive_value,
        send_value: filteredProducts[0].send_value
      })
    } else {
      console.log(`No products found for identifier: ${identifier}`)
      console.log('Available provider codes:', [...new Set(allProducts.map(p => p.provider_code))])
    }
    
    return filteredProducts
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Create transaction for top-up
export const createTransaction = async (data) => {
  try {
    // Format the data according to your API expectations
    const transactionData = {
      phone_number: data.phone_number,
      product_id: data.product_id,
      ...(data.provider_code && { provider_code: data.provider_code }),
      ...(data.operator_id && { operator_id: data.operator_id }),
    }
    
    console.log('Creating transaction:', transactionData)
    
    const response = await apiClient.post('/transactions/', transactionData)
    return response.data
  } catch (error) {
    console.error('Error creating transaction:', error)
    throw error
  }
}

// Fetch countries (if you need this)
export const fetchCountries = async () => {
  try {
    const response = await apiClient.get('/countries/')
    return response.data
  } catch (error) {
    console.error('Error fetching countries:', error)
    throw error
  }
}

// Sync operators (if you need to trigger sync)
export const syncOperators = async () => {
  try {
    const response = await apiClient.post('/sync-operators/')
    return response.data
  } catch (error) {
    console.error('Error syncing operators:', error)
    throw error
  }
}

// Optional: Fetch operators grouped by provider (frontend grouping)
export const fetchOperatorsGrouped = async () => {
  try {
    const allProducts = await fetchOperators()
    
    // Group products by provider_code
    const grouped = {}
    allProducts.forEach(product => {
      const code = product.provider_code
      if (!grouped[code]) {
        grouped[code] = {
          provider_code: code,
          operator_name: getOperatorNameFromCode(code),
          products: []
        }
      }
      grouped[code].products.push(product)
    })
    
    return Object.values(grouped)
  } catch (error) {
    console.error('Error fetching grouped operators:', error)
    throw error
  }
}

// Optional: Get single product by ID from the fetched list
export const fetchProductById = async (productId) => {
  try {
    const allProducts = await fetchOperators()
    const product = allProducts.find(p => p.id === parseInt(productId))
    
    if (!product) {
      throw new Error(`Product with id ${productId} not found`)
    }
    
    return {
      ...product,
      operator_name: getOperatorNameFromCode(product.provider_code),
      operator_code: product.provider_code
    }
  } catch (error) {
    console.error('Error fetching product by id:', error)
    throw error
  }
}

// Optional: Get products by provider code (frontend filter)
export const getProductsByProviderCode = async (providerCode) => {
  return fetchProducts(providerCode)
}

// Optional: Get products by operator name (frontend filter)
export const getProductsByOperatorName = async (operatorName) => {
  const providerCode = getProviderCodeFromName(operatorName)
  if (!providerCode) {
    console.log(`No provider code found for operator: ${operatorName}`)
    return []
  }
  return fetchProducts(providerCode)
}

// Helper function to check if a provider has products
export const hasProductsForProvider = async (providerCode) => {
  const products = await fetchProducts(providerCode)
  return products.length > 0
}

export default apiClient