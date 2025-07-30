import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, FileText } from "lucide-react";
import { useRouter } from "next/router";

type LatestSuratItem = {
  id: string;
  jenisSurat: string;
  jenisSuratLabel: string;
  namaLengkap: string;
  timestamp: number;
  status: string;
};

interface LatestPendingSuratProps {
  data: LatestSuratItem[];
  isLoading: boolean;
  totalPending: number;
}

export default function LatestPendingSurat({
  data = [],
  isLoading,
  totalPending,
}: LatestPendingSuratProps) {
  const router = useRouter();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleClickItem = (jenisSurat: string) => {
    router.push(`/admin/layanan/${jenisSurat}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg flex items-center">
            <FileText className="mr-2 h-4 w-4 text-primary" />
            Permohonan Surat Terbaru
          </CardTitle>
          <CardDescription>
            {totalPending} permohonan menunggu persetujuan
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Memuat data...</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada permohonan surat yang menunggu persetujuan
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pemohon</TableHead>
                  <TableHead>Jenis Surat</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleClickItem(item.jenisSurat)}
                  >
                    <TableCell className="font-medium">
                      {item.namaLengkap}
                    </TableCell>
                    <TableCell>
                      {item.jenisSuratLabel === "surat-keterangan-kelahiran"
                        ? "Surat Keterangan Kelahiran"
                        : item.jenisSuratLabel}
                    </TableCell>
                    <TableCell>{formatDate(item.timestamp)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
