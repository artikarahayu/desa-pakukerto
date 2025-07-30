import { ReactNode, useState } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { pendingCountApi } from "@/lib/admin/pending-count";
import { useQuery } from "@tanstack/react-query";
import AdminCustomDropdown from "@/components/admin/AdminCustomDropdown";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Home,
  FileText,
  Store,
  Users,
  LogOut,
  Image as ImageIcon,
  Landmark,
  Mail,
  Menu,
  ChartPie,
  CircleDollarSign,
  House,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type AdminLayoutProps = {
  children: ReactNode;
};

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Profil Desa",
    url: "/admin/profil-desa",
    icon: Landmark,
  },
  {
    title: "Profil Dusun",
    url: "/admin/profil-dusun",
    icon: House,
  },
  {
    title: "Berita Desa",
    url: "/admin/berita",
    icon: FileText,
  },
  {
    title: "UMKM Desa",
    url: "/admin/umkm",
    icon: Store,
  },
  {
    title: "Galeri",
    url: "/admin/galeri",
    icon: ImageIcon,
  },
  {
    title: "Demografi Penduduk",
    url: "/admin/demografi",
    icon: ChartPie,
  },
  {
    title: "APBDes",
    url: "/admin/apbdes",
    icon: CircleDollarSign,
  },
  {
    title: "Struktur Organisasi",
    url: "/admin/struktur-organisasi",
    icon: Users,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Query to get pending count
  const { data: pendingData } = useQuery({
    queryKey: ["pending-count"],
    queryFn: pendingCountApi.getPendingCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/admin/signin");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const isActivePath = (path: string) => {
    if (path === "/admin") {
      return router.pathname === "/admin";
    }
    return router.pathname.startsWith(path);
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen bg-background flex w-full">
          {/* Sidebar */}
          <Sidebar className="border-r">
            <SidebarHeader className="border-b p-6">
              <Link href="/">
                <div className="flex items-center gap-2">
                  <div className="bg-background rounded-full p-2">
                    <Image
                      src="/logos/logo.png"
                      alt="Logo"
                      className="h-8 w-8"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold">Admin Panel</h2>
                    <p className="text-sm">Desa Pakukerto</p>
                  </div>
                </div>
              </Link>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActivePath(item.url)}
                          className="w-full"
                        >
                          <a
                            href={item.url}
                            className="flex items-center gap-3"
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}

                    {/* Layanan Publik Custom Dropdown */}
                    <SidebarMenuItem>
                      <AdminCustomDropdown
                        title="Layanan Publik"
                        icon={Mail}
                        items={[
                          {
                            title: "Surat Keterangan",
                            url: "/admin/layanan/surat-keterangan",
                            badge: pendingData?.types
                              ? pendingData.types["surat-keterangan"]
                              : 0,
                          },
                          {
                            title: "Surat Keterangan Kelahiran",
                            url: "/admin/layanan/surat-keterangan-kelahiran",
                            badge: pendingData?.types
                              ? pendingData.types["surat-keterangan-kelahiran"]
                              : 0,
                          },
                          {
                            title: "Surat Izin Keramaian",
                            url: "/admin/layanan/surat-izin-keramaian",
                            badge: pendingData?.types
                              ? pendingData.types["surat-izin-keramaian"]
                              : 0,
                          },
                          {
                            title: "Surat Pengantar SKCK",
                            url: "/admin/layanan/surat-pengantar-skck",
                            badge: pendingData?.types
                              ? pendingData.types["surat-pengantar-skck"]
                              : 0,
                          },

                          {
                            title: "Surat Keterangan Kematian",
                            url: "/admin/layanan/surat-keterangan-kematian",
                            badge: pendingData?.types
                              ? pendingData.types["surat-keterangan-kematian"]
                              : 0,
                          },
                        ]}
                        isActive={isActivePath("/admin/layanan")}
                        badge={pendingData?.total}
                      />
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="w-full text-destructive hover:text-background hover:bg-destructive bg-background transition-colors duration-200 flex justify-center items-center"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>

          {/* Main Content */}
          <div className="flex-1 flex flex-col w-full">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between border-b p-4">
              <Link href="/">
                <div className="flex items-center gap-2">
                  <div className="bg-background rounded-full p-1.5">
                    <Image
                      src="/logos/logo.png"
                      alt="Logo"
                      className="h-7 w-7"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold">Admin Panel</h2>
                    <p className="text-sm text-muted-foreground">
                      Desa Pakukerto
                    </p>
                  </div>
                </div>
              </Link>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]">
                  <SheetHeader className="border-b p-6">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="bg-background rounded-full p-1">
                        <Image
                          src="/logos/logo.png"
                          alt="Logo"
                          className="h-8 w-8"
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-bold">Admin Panel</h2>
                        <p className="text-sm text-background">
                          Desa Pakukerto
                        </p>
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="py-6">
                    <div className="px-3 mb-2">
                      <h3 className="text-xs font-medium text-background mb-1 px-4">
                        Menu Utama
                      </h3>
                    </div>
                    <nav className="space-y-1">
                      {menuItems.map((item) => (
                        <SheetClose asChild key={item.title}>
                          <Link
                            href={item.url}
                            className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md mx-2 ${
                              isActivePath(item.url)
                                ? "bg-background/10 text-background"
                                : "text-background hover:bg-background/10"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SheetClose>
                      ))}

                      {/* Layanan Publik Mobile Dropdown */}
                      <div className="mx-2">
                        <AdminCustomDropdown
                          title="Layanan Publik"
                          icon={Mail}
                          items={[
                            {
                              title: "Surat Keterangan",
                              url: "/admin/layanan/surat-keterangan",
                              badge: pendingData?.types
                                ? pendingData.types["surat-keterangan"]
                                : 0,
                            },
                            {
                              title: "Surat Keterangan Kelahiran",
                              url: "/admin/layanan/surat-keterangan-kelahiran",
                              badge: pendingData?.types
                                ? pendingData.types[
                                    "surat-keterangan-kelahiran"
                                  ]
                                : 0,
                            },
                            {
                              title: "Surat Izin Keramaian",
                              url: "/admin/layanan/surat-izin-keramaian",
                              badge: pendingData?.types
                                ? pendingData.types["surat-izin-keramaian"]
                                : 0,
                            },
                            {
                              title: "Surat Pengantar SKCK",
                              url: "/admin/layanan/surat-pengantar-skck",
                              badge: pendingData?.types
                                ? pendingData.types["surat-pengantar-skck"]
                                : 0,
                            },
                            {
                              title: "Surat Keterangan Kematian",
                              url: "/admin/layanan/surat-keterangan-kematian",
                              badge: pendingData?.types
                                ? pendingData.types["surat-keterangan-kematian"]
                                : 0,
                            },
                          ]}
                          isActive={isActivePath("/admin/layanan")}
                          badge={pendingData?.total}
                          className="text-background"
                        />
                      </div>
                    </nav>
                  </div>

                  <div className="mt-auto border-t p-4">
                    <Button
                      onClick={handleLogout}
                      className="w-full text-destructive hover:text-background hover:bg-destructive bg-background transition-colors duration-200 flex justify-center items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Main Content Area */}
            <div className="">
              <div className="container mx-auto py-6 px-4 lg:px-6 max-w-7xl">
                {children}
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
