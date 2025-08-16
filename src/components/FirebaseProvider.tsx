'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const FirebaseContext = createContext({});

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        setUser(user);
        setLoading(false);
        
        // Show success popup briefly when Firebase is ready
        setShowSuccessPopup(true);
        
        // Auto-hide after 3 seconds
        const timer = setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
        console.error('Firebase Auth Error:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    error,
    auth,
    db
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Māori Calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">Configuration Error</h2>
          <p>Please check your Firebase configuration.</p>
          <details className="mt-4 text-sm text-left bg-red-50 p-4 rounded">
            <summary>Error Details</summary>
            <pre>{error}</pre>
          </details>
        </div>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={value}>
      {children}
      
      {/* Firebase Success Popup - Top Right Corner */}
      {showSuccessPopup && (
        <div 
          className="fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out"
          style={{
            transform: showSuccessPopup ? 'translateX(0)' : 'translateX(100%)',
            opacity: showSuccessPopup ? 1 : 0
          }}
        >
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 max-w-xs">
            <span className="text-lg">✅</span>
            <span className="font-medium text-sm">Firebase services ready</span>
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="ml-2 text-white hover:text-gray-200 text-lg leading-none w-5 h-5 flex items-center justify-center"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </FirebaseContext.Provider>
  );
};