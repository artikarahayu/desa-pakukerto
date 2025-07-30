import { GetStaticProps } from "next";
import Head from "next/head";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getLatestDemografi,
  getAvailableDemografiYears,
  getDemografiByYear,
  DemografiPublicData,
} from "@/lib/public/demografi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import useCountUp from "@/hooks/useCountUp";
import {
  Users,
  Home,
  MapPin,
  GraduationCap,
  Briefcase,
  Heart,
  Church,
  Venus,
  Mars,
  Loader2,
} from "lucide-react";

// Custom colors for charts - more vibrant and modern
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ff7c7c",
  "#87ceeb",
];

// Interface for page props
interface DemografiPendudukPageProps {
  initialDemografiData: DemografiPublicData | null;
  availableYears: number[];
}

export default function DemografiPendudukPage({
  initialDemografiData,
  availableYears,
}: DemografiPendudukPageProps) {
  const [demografiData, setDemografiData] =
    useState<DemografiPublicData | null>(initialDemografiData);
  const [activeYear, setActiveYear] = useState<number | null>(
    initialDemografiData?.tahun || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch demographic data by year
  const fetchDemografiByYear = async (year: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getDemografiByYear(year);
      if (!response) {
        throw new Error("Failed to fetch demographic data");
      }

      const data: DemografiPublicData = await response;
      setDemografiData(data);
    } catch (err) {
      setError("Gagal mengambil data demografi");
      console.error("Error fetching demographic data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle year change
  const handleYearChange = (year: string) => {
    const yearNumber = parseInt(year);
    setActiveYear(yearNumber);

    // If the selected year is different from current data, fetch new data
    if (demografiData?.tahun !== yearNumber) {
      fetchDemografiByYear(yearNumber);
    }
  };

  // If no initial data is available, show a message
  if (!initialDemografiData && availableYears.length === 0) {
    return (
      <>
        <Head>
          <title>Demografi Penduduk | Desa Pakukerto</title>
          <meta
            name="description"
            content="Data demografi penduduk Desa Pakukerto belum tersedia."
          />
        </Head>
        <PublicLayout>
          <div className="container mx-auto pt-12 px-4 sm:px-6 pb-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Demografi Penduduk
                </h1>
              </div>
              <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
                Data statistik kependudukan Desa Pakukerto
              </p>
              <Card className="bg-backgorund/50 backdrop-blur-sm border-border shadow-lg">
                <CardContent className="pt-12 pb-12">
                  <div className="flex flex-col items-center gap-4">
                    <Users className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-lg">
                      Data demografi belum tersedia.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </PublicLayout>
      </>
    );
  }

  // Format number with thousand separator
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  // Calculate percentage
  const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  // Show error state
  if (error) {
    return (
      <>
        <Head>
          <title>Demografi Penduduk | Desa Pakukerto</title>
        </Head>
        <PublicLayout>
          <div className="container mx-auto pt-12 px-4 sm:px-6 pb-20">
            <div className="max-w-4xl mx-auto text-center">
              <Card className="bg-backgorund/50 backdrop-blur-sm border-border shadow-lg">
                <CardContent className="pt-12 pb-12">
                  <div className="flex flex-col items-center gap-4">
                    <Users className="h-16 w-16 text-red-500/50" />
                    <p className="text-red-600 text-lg">{error}</p>
                    <button
                      onClick={() =>
                        activeYear && fetchDemografiByYear(activeYear)
                      }
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Coba Lagi
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </PublicLayout>
      </>
    );
  }

  // Use current demographic data or initial data as fallback
  const currentData = demografiData || initialDemografiData;

  if (!currentData) {
    return null;
  }

  // Count-up animations for global statistics - use activeYear as dependency to reset animation when year changes
  const totalPendudukCount = useCountUp({
    targetValue: currentData.dataGlobal.totalPenduduk,
    duration: 1500,
    formatFn: formatNumber,
    startOnMount: true, // Always start on mount
    key: activeYear?.toString(), // Convert to string to avoid null issues
  });

  const jumlahKKCount = useCountUp({
    targetValue: currentData.dataGlobal.jumlahKepalaKeluarga,
    duration: 1500,
    formatFn: formatNumber,
    startOnMount: true,
    key: activeYear?.toString(),
  });

  const lakiLakiCount = useCountUp({
    targetValue: currentData.dataGlobal.jumlahLakiLaki,
    duration: 1500,
    formatFn: formatNumber,
    startOnMount: true,
    key: activeYear?.toString(),
  });

  const perempuanCount = useCountUp({
    targetValue: currentData.dataGlobal.jumlahPerempuan,
    duration: 1500,
    formatFn: formatNumber,
    startOnMount: true,
    key: activeYear?.toString(),
  });

  return (
    <>
      <Head>
        <title>Demografi Penduduk | Desa Pakukerto</title>
        <meta
          name="description"
          content={`Data demografi penduduk Desa Pakukerto tahun ${
            currentData.tahun
          }. Total penduduk: ${formatNumber(
            currentData.dataGlobal.totalPenduduk
          )} jiwa.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content="https://www.desapakukerto.id/demografi-penduduk"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Demografi Penduduk Desa Pakukerto" />
        <meta
          property="og:description"
          content={`Data statistik kependudukan Desa Pakukerto tahun ${currentData.tahun}`}
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/demografi-penduduk"
        />
        <meta
          name="twitter:title"
          content="Demografi Penduduk Desa Pakukerto"
        />
        <meta
          name="twitter:description"
          content={`Data statistik kependudukan Desa Pakukerto tahun ${currentData.tahun}`}
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>
      <PublicLayout>
        <div className="container mx-auto pt-12 px-4 sm:px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Demografi Penduduk
                </h1>
              </div>
              <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
                Data statistik kependudukan Desa Pakukerto tahun{" "}
                {currentData.tahun}
              </p>
            </div>

            {/* Year selection */}
            {availableYears.length > 1 && (
              <div className="mb-8 w-full flex justify-end">
                <Select
                  value={activeYear?.toString()}
                  onValueChange={handleYearChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full md:w-[180px] bg-backgorund backdrop-blur-sm border-border shadow-sm">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        Tahun {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                <Card className="bg-backgorund shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p>Memuat data demografi...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Content with opacity when loading */}
            <div
              className={`transition-opacity duration-200 ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              {/* Global Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                        Total Penduduk
                      </CardTitle>
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-1">
                      {totalPendudukCount.displayValue}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Jiwa
                    </p>
                  </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-green-700 dark:text-green-300">
                        Jumlah KK
                      </CardTitle>
                      <Home className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-200 mb-1">
                      {jumlahKKCount.displayValue}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Kepala Keluarga
                    </p>
                  </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50 border-indigo-200 dark:border-indigo-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-indigo-700 dark:text-indigo-300">
                        Laki-laki
                      </CardTitle>
                      <Mars className="h-6 w-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-indigo-800 dark:text-indigo-200 mb-1">
                      {lakiLakiCount.displayValue}
                    </p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">
                      {calculatePercentage(
                        currentData.dataGlobal.jumlahLakiLaki,
                        currentData.dataGlobal.totalPenduduk
                      )}
                      % dari total
                    </p>
                  </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50 border-pink-200 dark:border-pink-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-pink-700 dark:text-pink-300">
                        Perempuan
                      </CardTitle>
                      <Venus className="h-6 w-6 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-pink-800 dark:text-pink-200 mb-1">
                      {perempuanCount.displayValue}
                    </p>
                    <p className="text-sm text-pink-600 dark:text-pink-400">
                      {calculatePercentage(
                        currentData.dataGlobal.jumlahPerempuan,
                        currentData.dataGlobal.totalPenduduk
                      )}
                      % dari total
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="space-y-8">
                {/* Age Groups and Dusun Distribution */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="group bg-backgorund/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="text-xl">
                            Distribusi Penduduk
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Distribusi penduduk berdasarkan dusun dan jenis
                            kelamin
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={currentData.dataKelompokDusun}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#ccc"
                            opacity={0.3}
                          />
                          <XAxis
                            dataKey="kelompokDusun"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            fontSize={12}
                            stroke="#8B8C93"
                          />
                          <YAxis fontSize={12} stroke="#8B8C93" />
                          <Tooltip
                            formatter={(value) => formatNumber(value as number)}
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              color: "#000",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="lakiLaki"
                            name="Laki-laki"
                            fill="#0088FE"
                            radius={[2, 2, 0, 0]}
                          />
                          <Bar
                            dataKey="perempuan"
                            name="Perempuan"
                            fill="#FF8042"
                            radius={[2, 2, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="group bg-backgorund/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="text-xl">
                            Distribusi Dusun
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Jumlah penduduk per dusun
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={currentData.dataDusun}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="jumlah"
                            nameKey="namaDusun"
                            label={({ namaDusun, jumlah, percent }) =>
                              `${namaDusun}: ${formatNumber(jumlah)} (${(
                                percent! * 100
                              ).toFixed(1)}%)`
                            }
                          >
                            {currentData.dataDusun.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => formatNumber(value as number)}
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              color: "#000",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Education and Occupation */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <Card className="group bg-backgorund/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="text-xl">
                            Tingkat Pendidikan
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Distribusi penduduk berdasarkan tingkat pendidikan
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={currentData.dataPendidikan}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                          layout="vertical"
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#ccc"
                            opacity={0.3}
                          />
                          <XAxis type="number" fontSize={12} stroke="#8B8C93" />
                          <YAxis
                            dataKey="tingkatPendidikan"
                            type="category"
                            width={150}
                            fontSize={12}
                            stroke="#8B8C93"
                          />
                          <Tooltip
                            formatter={(value) => formatNumber(value as number)}
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              color: "#000",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="jumlah"
                            name="Jumlah"
                            fill="#82ca9d"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="group bg-backgorund/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="text-xl">
                            Jenis Pekerjaan
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Distribusi penduduk berdasarkan pekerjaan (Top 10)
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={currentData.dataPekerjaan.slice(0, 10)}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                          layout="vertical"
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#ccc"
                            opacity={0.3}
                          />
                          <XAxis type="number" fontSize={12} stroke="#8B8C93" />
                          <YAxis
                            dataKey="jenisPekerjaan"
                            type="category"
                            width={150}
                            fontSize={12}
                            stroke="#8B8C93"
                          />
                          <Tooltip
                            formatter={(value) => formatNumber(value as number)}
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              color: "#000",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="jumlah"
                            name="Jumlah"
                            fill="#8884d8"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Religion and Marital Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="group bg-backgorund/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Church className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="text-xl">Agama</CardTitle>
                          <CardDescription className="mt-1">
                            Distribusi penduduk berdasarkan agama
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={currentData.dataAgama}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="jumlah"
                            nameKey="namaAgama"
                            label={({ namaAgama, jumlah, percent }) =>
                              `${namaAgama}: ${formatNumber(jumlah)} (${(
                                percent! * 100
                              ).toFixed(1)}%)`
                            }
                          >
                            {currentData.dataAgama.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => formatNumber(value as number)}
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              color: "#000",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="group bg-backgorund/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Heart className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="text-xl">
                            Status Perkawinan
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Distribusi penduduk berdasarkan status perkawinan
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={currentData.dataPerkawinan}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="jumlah"
                            nameKey="statusPerkawinan"
                            label={({ statusPerkawinan, jumlah, percent }) =>
                              `${statusPerkawinan}: ${formatNumber(jumlah)} (${(
                                percent! * 100
                              ).toFixed(1)}%)`
                            }
                          >
                            {currentData.dataPerkawinan.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => formatNumber(value as number)}
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              color: "#000",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps<
  DemografiPendudukPageProps
> = async () => {
  try {
    // Fetch the latest demographic data
    const demografiData = await getLatestDemografi();

    // Fetch available years
    const availableYears = await getAvailableDemografiYears();

    return {
      props: {
        initialDemografiData: demografiData,
        availableYears,
      },
      // Revalidate every 1 minutes (in seconds)
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching demographic data:", error);

    return {
      props: {
        initialDemografiData: null,
        availableYears: [],
      },
      revalidate: 86400,
    };
  }
};
