import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Toaster } from "sonner";
import VisiMisiTab from "@/components/admin/profil-desa/VisiMisiTab";
import SejarahDesaTab from "@/components/admin/profil-desa/SejarahDesaTab";
import BaganDesaTab from "@/components/admin/profil-desa/BaganDesaTab";

export default function ProfilDesaPage() {
  const [activeTab, setActiveTab] = useState("visi-misi");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil Desa</h1>
          <p className="text-muted-foreground mt-2">
            Kelola informasi profil desa seperti visi & misi, sejarah, dan bagan
            struktur desa
          </p>
        </div>

        <Tabs
          defaultValue="visi-misi"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="visi-misi">Visi & Misi</TabsTrigger>
            <TabsTrigger value="sejarah">Sejarah Desa</TabsTrigger>
            <TabsTrigger value="bagan">Bagan Desa</TabsTrigger>
          </TabsList>

          <TabsContent value="visi-misi" className="space-y-4">
            <VisiMisiTab />
          </TabsContent>

          <TabsContent value="sejarah" className="space-y-4">
            <SejarahDesaTab />
          </TabsContent>

          <TabsContent value="bagan" className="space-y-4">
            <BaganDesaTab />
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </AdminLayout>
  );
}
