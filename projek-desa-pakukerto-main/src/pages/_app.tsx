import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { Outfit } from "next/font/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className={outfit.className}>
          <Component {...pageProps} />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
