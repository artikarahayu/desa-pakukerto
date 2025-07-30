import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-accent">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo and Description */}
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="bg-background p-2 rounded-full">
                <Image
                  src="/logos/logo.png"
                  alt="Desa Pakukerto"
                  width={32}
                  height={32}
                  // className="h-8 w-auto"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-foreground">
                  Desa Pakukerto
                </h2>
                <p className="text-sm text-primary-foreground/80">
                  Kabupaten Pasuruan, Jawa Timur
                </p>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/80 mt-2 max-w-xs">
              Portal resmi Desa Pakukerto, menyediakan informasi dan layanan
              untuk masyarakat desa.
            </p>
            <div className="flex space-x-4 mt-4">
              {/* <Link
                href="https://facebook.com"
                className="text-primary-foreground/80 hover:text-primary-foreground"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </Link> */}
              <Link
                href="https://www.instagram.com/desapakukerto"
                className="text-primary-foreground/80 hover:text-primary-foreground"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://youtube.com/@kkn15desapakukerto?feature=shared"
                className="text-primary-foreground/80 hover:text-primary-foreground"
              >
                <span className="sr-only">YouTube</span>
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <h3 className="text-base font-semibold text-primary-foreground mb-4">
              Alamat
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-foreground/80 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  Jl. Tirto agung No .01 Kemiri, Desa Pakukerto, Kecamatan
                  Sukorejo, Kabupaten Pasuruan, <br /> Jawa Timur 67161
                </span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-primary-foreground/80 mr-2 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  Senin - Jumat: 08.00 - 16.00 WIB
                </span>
              </li>
            </ul>
          </div>

          {/* Hubungi Kami */}
          <div>
            <h3 className="text-base font-semibold text-primary-foreground mb-4">
              Hubungi Kami
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary-foreground/80 mr-2 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  +62 852-5395-7108
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary-foreground/80 mr-2 flex-shrink-0" />
                <a
                  href="mailto:desapakukerto@gmail.com"
                  className="text-sm text-primary-foreground/80"
                >
                  desapakukerto@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-secondary py-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <p className="text-xs text-secondary-foreground/80 text-center md:text-left">
              &copy; {new Date().getFullYear()} Desa Pakukerto KKN 15 UYP. Hak
              Cipta Dilindungi Undang - Undang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
