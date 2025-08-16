import { FirebaseProvider } from '../components/FirebaseProvider';
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
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
