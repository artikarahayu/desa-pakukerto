import PublicLayout from "@/components/layouts/PublicLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCountUp from "@/hooks/useCountUp";
import {
  getAPBDesByYear,
  getAvailableAPBDesYears,
  getLatestAPBDes,
  getAPBDesYearlyComparison,
  APBDesPublicData,
  APBDesYearlyComparisonData,
} from "@/lib/public/apbdes";
import { formatRupiah } from "@/utils/currency";
import {
  ArrowDownCircle,
  ArrowRightLeft,
  ArrowUpCircle,
  BarChart3,
  ChartColumn,
  CircleDollarSign,
  Loader2,
  PiggyBank,
  Receipt,
} from "lucide-react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Custom colors for charts - using CSS variables to match theme
const COLORS = [
  "var(--chart-color-1, #0088FE)",
  "var(--chart-color-2, #00C49F)",
  "var(--chart-color-3, #FFBB28)",
  "var(--chart-color-4, #FF8042)",
  "var(--chart-color-5, #8884D8)",
  "var(--chart-color-6, #82CA9D)",
  "var(--chart-color-7, #F06292)",
  "var(--chart-color-8, #26A69A)",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ff7c7c",
  "#87ceeb",
];

// Interface for page props
interface APBDesPageProps {
  initialAPBDesData: APBDesPublicData | null;
  availableYears: number[];
  yearlyComparisonData: APBDesYearlyComparisonData[];
  error?: string;
}

// Server-side data fetching with getStaticProps
export const getStaticProps: GetStaticProps<APBDesPageProps> = async () => {
  try {
    const latestData = await getLatestAPBDes();
    const years = await getAvailableAPBDesYears();
    const yearlyComparisonData = await getAPBDesYearlyComparison();

    if (!latestData) {
      return {
        props: {
          initialAPBDesData: null,
          availableYears: years || [],
          yearlyComparisonData: yearlyComparisonData || [],
          error: "No APBDes data found",
        },
        revalidate: 60, // Revalidate more frequently on error
      };
    }

    return {
      props: {
        initialAPBDesData: latestData,
        availableYears: years,
        yearlyComparisonData,
      },
      revalidate: 60, // Revalidate every 1 minutes
    };
  } catch (error) {
    console.error("Error in getStaticProps for APBDes page:", error);
    return {
      props: {
        initialAPBDesData: null,
        availableYears: [],
        yearlyComparisonData: [],
        error: "Failed to fetch APBDes data",
      },
      revalidate: 60, // Revalidate more frequently on error
    };
  }
};

export default function APBDesPage({
  initialAPBDesData,
  availableYears,
  yearlyComparisonData,
}: APBDesPageProps) {
  const [apbdesData, setApbdesData] = useState<APBDesPublicData | null>(
    initialAPBDesData
  );
  const [activeYear, setActiveYear] = useState<number | null>(
    initialAPBDesData?.tahun || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch APBDes data by year
  const fetchAPBDesByYear = async (year: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAPBDesByYear(year);
      if (!response) {
        throw new Error("Failed to fetch APBDes data");
      }

      const data: APBDesPublicData = await response;
      setApbdesData(data);
    } catch (err) {
      setError("Gagal mengambil data APBDes");
      console.error("Error fetching APBDes data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle year change
  const handleYearChange = (year: string) => {
    const yearNumber = parseInt(year);
    setActiveYear(yearNumber);

    // If the selected year is different from current data, fetch new data
    if (apbdesData?.tahun !== yearNumber) {
      fetchAPBDesByYear(yearNumber);
    }
  };

  // If no initial data is available, show a message
  if (!initialAPBDesData && availableYears.length === 0) {
    return (
      <>
        <Head>
          <title>APBDes | Desa Pakukerto</title>
          <meta
            name="description"
            content="Data APBDes Desa Pakukerto belum tersedia."
          />
        </Head>
        <PublicLayout>
          <div className="container mx-auto pt-12 px-4 sm:px-6 pb-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <CircleDollarSign className="h-8 w-8 text-primary" />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  Anggaran Pendapatan dan Belanja Desa
                </h1>
              </div>
              <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
                Data APBDes Desa Pakukerto
              </p>
              <Card className="bg-backgorund/50 backdrop-blur-sm border-border shadow-lg">
                <CardContent className="pt-12 pb-12">
                  <div className="flex flex-col items-center gap-4">
                    <CircleDollarSign className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-lg">
                      Data APBDes belum tersedia.
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

  // Show error state
  if (error) {
    return (
      <>
        <Head>
          <title>APBDes | Desa Pakukerto</title>
        </Head>
        <PublicLayout>
          <div className="container mx-auto pt-12 px-4 sm:px-6 pb-20">
            <div className="max-w-4xl mx-auto text-center">
              <Card className="bg-backgorund/50 backdrop-blur-sm border-border shadow-lg">
                <CardContent className="pt-12 pb-12">
                  <div className="flex flex-col items-center gap-4">
                    <CircleDollarSign className="h-16 w-16 text-red-500/50" />
                    <p className="text-red-600 text-lg">{error}</p>
                    <button
                      onClick={() =>
                        activeYear && fetchAPBDesByYear(activeYear)
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

  // Use current APBDes data or initial data as fallback
  const currentData = apbdesData || initialAPBDesData;

  if (!currentData) {
    return null;
  }

  // Count-up animations for global statistics - use activeYear as dependency to reset animation when year changes
  const totalPendapatanCount = useCountUp({
    targetValue: currentData.ringkasan.totalPendapatan,
    duration: 1500,
    formatFn: (value) => formatRupiah(value),
    startOnMount: true,
    key: activeYear?.toString(),
  });

  const totalBelanjaCount = useCountUp({
    targetValue: currentData.ringkasan.totalBelanja,
    duration: 1500,
    formatFn: (value) => formatRupiah(value),
    startOnMount: true,
    key: activeYear?.toString(),
  });

  const totalPenerimaanCount = useCountUp({
    targetValue: currentData.ringkasan.totalPembiayaan.penerimaan,
    duration: 1500,
    formatFn: (value) => formatRupiah(value),
    startOnMount: true,
    key: activeYear?.toString(),
  });

  const totalPengeluaranCount = useCountUp({
    targetValue: currentData.ringkasan.totalPembiayaan.pengeluaran,
    duration: 1500,
    formatFn: (value) => formatRupiah(value),
    startOnMount: true,
    key: activeYear?.toString(),
  });

  // Prepare data for yearly comparison chart
  const yearlyComparisonChartData = yearlyComparisonData.map((item) => ({
    tahun: item.tahun.toString(),
    Pendapatan: item.pendapatan,
    Belanja: item.belanja,
  }));

  const pendapatanChartData = currentData.pendapatan.rincian.map(
    (item, index) => ({
      name: item.kategori,
      value: item.jumlah,
      fill: COLORS[index % COLORS.length],
    })
  );

  const belanjaChartData = currentData.belanja.rincian.map((item, index) => ({
    name: item.kategori,
    value: item.jumlah,
    fill: COLORS[index % COLORS.length],
  }));

  const pembiayaanChartData = [
    {
      name: "Penerimaan",
      value: currentData.pembiayaan.penerimaan.total,
      fill: "#00C49F",
    },
    {
      name: "Pengeluaran",
      value: currentData.pembiayaan.pengeluaran.total,
      fill: "#FF8042",
    },
  ];

  return (
    <>
      <Head>
        <title>APBDes | Desa Pakukerto</title>
        <meta
          name="description"
          content={`Data APBDes Desa Pakukerto tahun ${currentData.tahun}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:url" content="https://www.desapakukerto.id/apbdes" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="APBDes Desa Pakukerto" />
        <meta
          property="og:description"
          content={`Data Anggaran Pendapatan dan Belanja Desa Pakukerto tahun ${currentData.tahun}`}
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/apbdes"
        />
        <meta name="twitter:title" content="APBDes Desa Pakukerto" />
        <meta
          name="twitter:description"
          content={`Data Anggaran Pendapatan dan Belanja Desa Pakukerto tahun ${currentData.tahun}`}
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>
      <PublicLayout>
        <div className="container mx-auto pt-12 px-4 sm:px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <CircleDollarSign className="h-8 w-8 text-primary" />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  Anggaran Pendapatan dan Belanja Desa
                </h1>
              </div>
              <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
                Data APBDes Desa Pakukerto tahun {currentData.tahun}
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
                      <p>Memuat data APBDes...</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <Card className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-green-700 dark:text-green-300">
                        Pendapatan
                      </CardTitle>
                      <ArrowDownCircle className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-200 mb-1">
                      {totalPendapatanCount.displayValue}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Total pendapatan desa
                    </p>
                  </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-red-700 dark:text-red-300">
                        Belanja
                      </CardTitle>
                      <ArrowUpCircle className="h-6 w-6 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-red-800 dark:text-red-200 mb-1">
                      {totalBelanjaCount.displayValue}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Total belanja desa
                    </p>
                  </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                        Penerimaan
                      </CardTitle>
                      <PiggyBank className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-1">
                      {totalPenerimaanCount.displayValue}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Total pembiayaan masuk
                    </p>
                  </CardContent>
                </Card>

                <Card className="group bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-orange-700 dark:text-orange-300">
                        Pengeluaran
                      </CardTitle>
                      <Receipt className="h-6 w-6 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-orange-800 dark:text-orange-200 mb-1">
                      {totalPengeluaranCount.displayValue}
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Total pembiayaan keluar
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-8 mb-12">
                {/* Yearly Comparison Section */}
                <Card className="group backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <ChartColumn className="h-6 w-6 text-primary" />
                        Pendapatan dan Belanja Desa dari Tahun ke Tahun
                      </CardTitle>
                      <div
                        className={`flex items-center gap-2 ${
                          currentData.ringkasan.surplus >= 0
                            ? "bg-green-100"
                            : "bg-red-100"
                        } py-2 px-4 rounded-md`}
                      >
                        <span className="text-sm text-muted-foreground">
                          {currentData.ringkasan.surplus >= 0
                            ? "Surplus"
                            : "Defisit"}{" "}
                          tahun {activeYear}:
                        </span>
                        <span
                          className={cn(
                            "font-mono text-sm",
                            currentData.ringkasan.surplus >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {formatRupiah(currentData.ringkasan.surplus)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] 2xl:h-[700px]">
                      <ChartContainer
                        config={{
                          Pendapatan: { label: "Pendapatan", color: "#0088FE" },
                          Belanja: { label: "Belanja", color: "#FF8042" },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={yearlyComparisonChartData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 80,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#ccc"
                              opacity={0.3}
                            />
                            <XAxis
                              dataKey="tahun"
                              stroke="#8B8C93"
                              label={{
                                value: "Tahun",
                                position: "insideBottomRight",
                                offset: -5,
                                fill: "#8B8C93",
                              }}
                            />
                            <YAxis
                              stroke="#8B8C93"
                              tickFormatter={(value) => {
                                // Format large numbers in billions/millions for better readability
                                if (value >= 1000000000) {
                                  return `${(value / 1000000000).toFixed(1)} M`;
                                } else if (value >= 1000000) {
                                  return `${value / 1000000} Jt`;
                                } else {
                                  return formatRupiah(value, false);
                                }
                              }}
                              width={70}
                              label={{
                                value: "Rupiah",
                                angle: -90,
                                position: "insideLeft",
                                fill: "#8B8C93",
                              }}
                            />
                            <Tooltip
                              formatter={(value) =>
                                formatRupiah(value as number)
                              }
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                color: "#000",
                              }}
                            />{" "}
                            <Legend />
                            <Bar
                              dataKey="Pendapatan"
                              fill="#0088FE"
                              name="Pendapatan"
                            />
                            <Bar
                              dataKey="Belanja"
                              fill="#FF8042"
                              name="Belanja"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Pendapatan Section */}
                <Card className="group backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300 mb-8 lg:mt-50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <ArrowDownCircle className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-xl">
                          Pendapatan Desa Tahun {activeYear}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Rincian pendapatan desa
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] 2xl:h-[350px]">
                        <ChartContainer
                          config={{
                            pendapatan: {
                              label: "Pendapatan",
                              color: "#0088FE",
                            },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart
                              margin={{
                                top: 0,
                                right: 0,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <Pie
                                data={pendapatanChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius="90%"
                                innerRadius="0%"
                                paddingAngle={2}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                              >
                                {pendapatanChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) =>
                                  formatRupiah(value as number)
                                }
                                contentStyle={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  color: "#000",
                                }}
                              />
                              <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ paddingTop: "20px" }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Rincian Pendapatan
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                          {currentData.pendapatan.rincian.map((item, index) => (
                            <AccordionItem
                              key={item.id || index}
                              value={`item-${index}`}
                            >
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex justify-between w-full pr-4">
                                  <span>{item.kategori}</span>
                                  <span>{formatRupiah(item.jumlah)}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {item.subRincian.map((subItem, subIndex) => (
                                    <div
                                      key={subItem.id || subIndex}
                                      className="flex justify-between py-2 px-4 border-b border-border/30 last:border-0"
                                    >
                                      <span className="text-muted-foreground">
                                        {subItem.uraian}
                                      </span>
                                      <span>
                                        {formatRupiah(subItem.jumlah)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Belanja Section */}
                <Card className="group backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300 ">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <ArrowUpCircle className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-xl">
                          Belanja Desa Tahun {activeYear}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Rincian belanja desa
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] 2xl:h-[350px]">
                        <ChartContainer
                          config={{
                            belanja: { label: "Belanja", color: "#FF8042" },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart
                              margin={{
                                top: 0,
                                right: 0,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <Pie
                                data={belanjaChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius="90%"
                                innerRadius="0%"
                                paddingAngle={2}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                              >
                                {belanjaChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value) =>
                                  formatRupiah(value as number)
                                }
                                contentStyle={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  color: "#000",
                                }}
                              />
                              <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{ paddingTop: "20px" }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Rincian Belanja
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                          {currentData.belanja.rincian.map((item, index) => (
                            <AccordionItem
                              key={item.id || index}
                              value={`item-${index}`}
                            >
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex justify-between w-full pr-4">
                                  <span>{item.kategori}</span>
                                  <span>{formatRupiah(item.jumlah)}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {item.subRincian.map((subItem, subIndex) => (
                                    <div
                                      key={subItem.id || subIndex}
                                      className="flex justify-between py-2 px-4 border-b border-border/30 last:border-0"
                                    >
                                      <span className="text-muted-foreground">
                                        {subItem.uraian}
                                      </span>
                                      <span>
                                        {formatRupiah(subItem.jumlah)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pembiayaan Section */}
                <Card className="group backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <ArrowRightLeft className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-xl">
                          Pembiayaan Desa Tahun {activeYear}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Rincian pembiayaan desa
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] 2xl:h-[350px]">
                        <ChartContainer
                          config={{
                            penerimaan: {
                              label: "Penerimaan",
                              color: "#00C49F",
                            },
                            pengeluaran: {
                              label: "Pengeluaran",
                              color: "#FF8042",
                            },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={pembiayaanChartData}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#ccc"
                                opacity={0.3}
                              />
                              <XAxis dataKey="name" stroke="#8B8C93" />
                              <YAxis
                                stroke="#8B8C93"
                                tickFormatter={(value) => {
                                  // Format large numbers in billions/millions for better readability
                                  if (value >= 1000000000) {
                                    return `${(value / 1000000000).toFixed(
                                      1
                                    )}M`;
                                  } else if (value >= 1000000) {
                                    return `${value / 1000000} Jt`;
                                  } else {
                                    return formatRupiah(value, false);
                                  }
                                }}
                              />
                              <Tooltip
                                formatter={(value) =>
                                  formatRupiah(value as number)
                                }
                                contentStyle={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  color: "#000",
                                }}
                              />
                              {/* <Legend /> */}
                              <Bar
                                dataKey="value"
                                fill="var(--color-penerimaan)"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                      <div>
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-4">
                            Penerimaan Pembiayaan
                          </h3>
                          <div className="w-full flex flex-col gap-1.5">
                            {currentData.pembiayaan.penerimaan.rincian.map(
                              (item, index) => (
                                <div key={item.id || index}>
                                  <div className="flex justify-between w-full pr-4 text-xs md:text-sm">
                                    <span>{item.kategori}</span>
                                    <span>{formatRupiah(item.jumlah)}</span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Pengeluaran Pembiayaan
                          </h3>
                          <div className="w-full flex flex-col gap-1.5">
                            {currentData.pembiayaan.pengeluaran.rincian.map(
                              (item, index) => (
                                <div key={item.id || index}>
                                  <div className="flex justify-between w-full pr-4 text-xs md:text-sm">
                                    <span>{item.kategori}</span>
                                    <span>{formatRupiah(item.jumlah)}</span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}
