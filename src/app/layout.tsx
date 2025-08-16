import { FirebaseProvider } from '../components/FirebaseProvider';
import { AuthProvider } from '../contexts/AuthContext';
import { AdminProvider } from '../contexts/AdminContext';
import { CMSProvider } from '../contexts/CMSContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import './globals.css';

export const metadata = {
  title: 'Mahuru Māori Activation 2025 - Te Reo Māori Learning Platform',
  description: 'A 30-day Māori cultural learning journey',
};

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <FirebaseProvider>
            <AuthProvider>
              <AdminProvider>
                <CMSProvider>
                  {children}
                </CMSProvider>
              </AdminProvider>
            </AuthProvider>
          </FirebaseProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
