import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import CustomDropdown from "@/components/public/CustomDropdown";

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Profil Desa", href: "/profil-desa" },
  { name: "Struktur Organisasi", href: "/struktur-organisasi" },
  { name: "Demografi Penduduk", href: "/demografi-penduduk" },
  { name: "APBDes", href: "/apbdes" },
  { name: "Berita", href: "/berita" },
  { name: "Produk UMKM", href: "/umkm" },
  { name: "Galeri", href: "/galeri" },
];

const layananPublik = [
  { name: "Surat Keterangan", href: "/layanan/surat-keterangan" },
  { name: "Surat Keterangan Kelahiran", href: "/layanan/surat-kelahiran" },
  { name: "Surat Izin Keramaian", href: "/layanan/surat-izin-keramaian" },
  { name: "Surat Pengantar SKCK", href: "/layanan/surat-pengantar-skck" },
  {
    name: "Surat Keterangan Kematian",
    href: "/layanan/surat-keterangan-kematian",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [layananOpen, setLayananOpen] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/") {
      return router.pathname === "/";
    }
    return router.pathname.startsWith(path);
  };

  const isLayananActive = () => {
    return router.pathname.startsWith("/layanan");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <Image
              src="/logos/logo.png"
              alt="Desa Pakukerto"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div className="">
              <h1 className="text-lg font-bold text-foreground">
                Desa Pakukerto
              </h1>
              <p className="text-xs text-muted-foreground">
                Kabupaten Pasuruan, Jawa Timur
              </p>
            </div>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetHeader className="border-b p-6">
                <SheetTitle className="flex items-center gap-2">
                  <div className="bg-background rounded-full p-1.5">
                    <Image
                      src="/logos/logo.png"
                      alt="Logo"
                      className="h-7 w-7"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h1 className="text-base font-bold">Desa Pakukerto</h1>
                    <p className="text-xs">Kabupaten Pasuruan, Jawa Timur</p>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="px-4">
                <div className="space-y-1 py-6">
                  {navigation.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.href}
                        className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-background/10 ${
                          isActive(item.href)
                            ? "bg-background/10 text-background"
                            : "text-background hover:bg-background/10"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}

                  {/* Layanan Publik Mobile */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setLayananOpen(!layananOpen)}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-background/10 ${
                        isLayananActive()
                          ? "bg-background/10 text-background"
                          : "text-background hover:bg-background/10"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        Layanan Publik
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          layananOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {layananOpen && (
                      <div className="ml-4 space-y-1">
                        {layananPublik.map((item) => (
                          <SheetClose asChild key={item.name}>
                            <Link
                              href={item.href}
                              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-background/10 ${
                                isActive(item.href)
                                  ? "bg-background/10 text-background"
                                  : "text-background/80 hover:bg-background/10 hover:text-background"
                              }`}
                            >
                              {item.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-4 2xl:gap-x-6 lg:items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href) ? "text-primary" : "text-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Layanan Publik Desktop Dropdown */}
          <CustomDropdown
            trigger="Layanan Publik"
            items={layananPublik}
            isActive={isLayananActive()}
          />
        </div>
      </nav>
    </header>
  );
}
