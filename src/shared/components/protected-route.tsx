"use client";

import { useRouter } from "next/navigation";
import useAuthStore from "../context/auth";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/autenticacao");
    }
  }, [isLoggedIn, router]);

  return isLoggedIn ? <>{children}</> : null;
};
