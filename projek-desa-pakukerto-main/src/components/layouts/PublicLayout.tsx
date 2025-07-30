import { ReactNode } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import EmergencyButton from "@/components/public/EmergencyButton";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <EmergencyButton />
    </div>
  );
}
