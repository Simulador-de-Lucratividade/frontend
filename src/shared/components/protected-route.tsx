"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "../context/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.push("/autenticacao");
    }
  }, [isLoggedIn, hydrated, router]);

  return hydrated ? <>{children}</> : null;
};
