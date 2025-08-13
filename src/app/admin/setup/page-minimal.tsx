'use client'

import { useState } from 'react'

export default function AdminSetupMinimal() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleNext = () => {
    setLoading(true)
    setTimeout(() => {
      setStep(step + 1)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-2xl">🌿</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mahuru Admin Setup</h1>
          <p className="text-gray-600 mt-2">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Initialize System</h3>
            <p className="text-gray-600">Set up your admin database and content.</p>
            <button 
              onClick={handleNext}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Initializing...' : 'Initialize Database'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create Admin User</h3>
            <input type="text" placeholder="Name" className="w-full px-3 py-2 border rounded-md" />
            <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-md" />
            <input type="password" placeholder="Password" className="w-full px-3 py-2 border rounded-md" />
            <button 
              onClick={handleNext}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold">Complete!</h3>
            <p className="text-gray-600">Your admin system is ready.</p>
            <a href="/admin.html" className="block w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Go to Admin
            </a>
          </div>
        )}
      </div>
    </div>
  )
}