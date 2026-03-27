// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RechargeProvider } from './context/RechargeContext'
import { ToastProvider } from './context/ToastContext'
import { Header } from './components/layout/Header'  // Add this import
import { LandingPage } from './pages/LandingPage'
import { RechargeFlow } from './pages/RechargeFlow/RechargeFlow'
import { SuccessPage } from './pages/SuccessPage'
import { ErrorPage } from './pages/ErrorPage'

function App() {
  return (
    <ToastProvider>
      <RechargeProvider>
        <Router>
          <Header />  {/* Add Header component here */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/recharge" element={<RechargeFlow />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </Router>
      </RechargeProvider>
    </ToastProvider>
  )
}

export default App