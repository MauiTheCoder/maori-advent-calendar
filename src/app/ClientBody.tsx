"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CMSProvider } from "@/contexts/CMSContext";
import FirebaseInitializer from "@/components/firebase/FirebaseInitializer";

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
    <AuthProvider>
      <AdminProvider>
        <CMSProvider>
          <FirebaseInitializer />
          <div className="antialiased">{children}</div>
        </CMSProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
