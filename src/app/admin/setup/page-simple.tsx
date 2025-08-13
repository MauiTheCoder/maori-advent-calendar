'use client'

import { useState } from 'react'

export default function AdminSetupSimple() {
  const [step, setStep] = useState<'initialize' | 'create_admin' | 'complete'>('initialize')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInitialize = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Simulate initialization
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess('System initialized successfully!')
      setStep('create_admin')
    } catch (error) {
      setError('Failed to initialize system')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-2xl">🌿</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mahuru Admin Setup</h1>
          <p className="text-gray-600 mt-2">Initialize your content management system</p>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {step === 'initialize' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                This will set up your Mahuru CMS database and content.
              </p>
              <ul className="text-sm text-left space-y-2 mb-6">
                <li>• 30 days of Mahuru activities</li>
                <li>• Default content and settings</li>
                <li>• Admin user management</li>
              </ul>
            </div>
            
            <button
              onClick={handleInitialize}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Initializing...' : 'Initialize Admin System'}
            </button>
          </div>
        )}

        {step === 'create_admin' && (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              System initialized! Now create your admin user.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Display Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                placeholder="Admin Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => setStep('complete')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Admin User
              </button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold">Setup Complete!</h3>
            <p className="text-gray-600">
              Your admin system is ready to use.
            </p>
            <div className="space-y-2">
              <a 
                href="/admin/login"
                className="block w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Go to Admin Login
              </a>
              <a 
                href="/"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                View Live Site
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Mahuru Activation 2025 • Te Wānanga o Aotearoa
          </p>
        </div>
      </div>
    </div>
  )
}