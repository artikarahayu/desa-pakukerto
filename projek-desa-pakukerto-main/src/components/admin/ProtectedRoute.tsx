import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/signin");
    }
  }, [user, loading, router]);

  // Show nothing while loading or redirecting
  if (loading || !user) {
    return null;
  }

  // If we have a user, render the children
  return <>{children}</>;
}
