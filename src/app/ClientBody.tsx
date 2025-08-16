"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CMSProvider } from "@/contexts/CMSContext";
import FirebaseInitializer from "@/components/firebase/FirebaseInitializer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminProvider>
          <CMSProvider>
            <FirebaseInitializer />
            {children}
          </CMSProvider>
        </AdminProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
