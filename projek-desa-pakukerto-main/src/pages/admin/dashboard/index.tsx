import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardApi } from "@/lib/admin/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import LatestPendingSurat from "@/components/dashboard/LatestPendingSurat";

export default function AdminDashboard() {
  // Query to fetch dashboard statistics
  const {
    data: statistics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-statistics"],
    queryFn: dashboardApi.getStatistics,
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Selamat datang di panel admin Desa Pakukerto.
        </p>

        {error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            Gagal memuat data statistik. Silakan coba lagi.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/berita">
              <Card className="group bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-700 dark:text-red-300">
                    Berita Desa
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-400">
                    Kelola berita dan informasi desa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Memuat...</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-red-800 dark:text-red-200">
                      Total berita: {statistics?.berita.total || 0}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/umkm">
              <Card className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                    UMKM
                  </CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-400">
                    Kelola katalog UMKM lokal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Memuat...</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-blue-800 dark:text-blue-200">
                      Total UMKM: {statistics?.umkm.total || 0}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/galeri">
              <Card className="group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-700 dark:text-purple-300">
                    Galeri
                  </CardTitle>
                  <CardDescription className="text-purple-600 dark:text-purple-400">
                    Kelola foto dan video desa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Memuat...</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-purple-800 dark:text-purple-200">
                      Total media: {statistics?.galeri.total || 0}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        {/* Latest Pending Surat */}
        {!error && (
          <div className="mt-6">
            <LatestPendingSurat
              data={statistics?.layananPublik?.latestPending || []}
              isLoading={isLoading}
              totalPending={statistics?.layananPublik?.pending || 0}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
