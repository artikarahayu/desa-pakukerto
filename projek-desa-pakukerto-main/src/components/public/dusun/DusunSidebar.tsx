import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dusun } from "@/schemas/dusun.schema";

interface DusunSidebarProps {
  dusunList: Dusun[];
  currentDusunId?: string;
}

export default function DusunSidebar({
  dusunList,
  currentDusunId,
}: DusunSidebarProps) {
  // Filter out the current dusun if provided
  const otherDusun = currentDusunId
    ? dusunList.filter((dusun) => dusun.id !== currentDusunId)
    : dusunList;

  return (
    <Card className="min-w-[14rem]">
      <CardHeader>
        <CardTitle className="text-lg">Profil Dusun Lainnya</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {otherDusun.length > 0 ? (
          <ul className="space-y-2">
            {otherDusun.map((dusun) => (
              <li key={dusun.id}>
                <Link
                  href={`/profil-desa/${dusun.slug}`}
                  className="text-primary hover:underline"
                >
                  {dusun.nama}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tidak ada dusun lainnya
          </p>
        )}
      </CardContent>
    </Card>
  );
}
