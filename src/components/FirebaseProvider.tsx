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
      
      {/* Firebase Success Popup - Bottom Right Corner */}
      {showSuccessPopup && (
        <div className="fixed bottom-4 right-4 z-50">
          <div 
            role="alert" 
            className="relative rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:bottom-4 [&>svg]:text-foreground [&>svg~*]:pl-7 text-foreground w-80 border-green-200 bg-green-50"
          >
            <div className="text-sm [&_p]:leading-relaxed text-green-600 flex items-center justify-between">
              <span>✅ Firebase services ready</span>
              <button 
                onClick={() => setShowSuccessPopup(false)}
                className="ml-2 text-green-600 hover:text-green-800 text-lg leading-none w-5 h-5 flex items-center justify-center"
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </FirebaseContext.Provider>
  );
};