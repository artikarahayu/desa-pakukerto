import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ApbdesTableLoading() {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tahun</TableHead>
            <TableHead>Total Pendapatan</TableHead>
            <TableHead>Total Belanja</TableHead>
            <TableHead>Surplus/Defisit</TableHead>
            <TableHead>Terakhir Diperbarui</TableHead>
            <TableHead className="w-[100px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ApbdesFormLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <div className="pl-6 space-y-2">
                {[...Array(2)].map((_, subIndex) => (
                  <div key={subIndex} className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                ))}
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          ))}
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <div className="pl-6 space-y-2">
                {[...Array(2)].map((_, subIndex) => (
                  <div key={subIndex} className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                ))}
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          ))}
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <div className="pl-6 space-y-2">
                {[...Array(2)].map((_, subIndex) => (
                  <div key={subIndex} className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                ))}
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          ))}
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
