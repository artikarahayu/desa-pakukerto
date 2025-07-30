import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSuratIzinKeramaianSchema,
  CreateSuratIzinKeramaianInput,
} from "@/schemas/surat-izin-keramaian.schema";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, User, Calendar, Phone, MapPin, Clock } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "sonner";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function SuratIzinKeramaianPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const form = useForm<CreateSuratIzinKeramaianInput>({
    resolver: zodResolver(createSuratIzinKeramaianSchema),
    defaultValues: {
      nama: "",
      tempatTanggalLahir: "",
      jenisKelamin: "Laki-laki",
      agama: "",
      nik: "",
      alamat: "",
      nomorHP: "",
      hari: "",
      tanggal: "",
      jamMulai: "",
      jamSelesai: "",
      jenisKeramaian: "",
      keperluan: "",
      lokasi: "",
      nomorWhatsApp: "",
      recaptchaToken: "",
    },
  });

  const onSubmit = async (data: CreateSuratIzinKeramaianInput) => {
    console.log("Form data:", data);
    console.log("reCAPTCHA token:", recaptchaToken);

    if (!recaptchaToken) {
      toast.error("Silakan verifikasi reCAPTCHA terlebih dahulu");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...data,
        recaptchaToken,
      };

      console.log("Submitting data:", submitData);
      await axios.post("/api/layanan/surat-izin-keramaian", submitData);

      toast.success("Permohonan surat berhasil dikirim!");
      router.push("/layanan/sukses");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <>
      <Head>
        <title>Surat Izin Keramaian - Desa Pakukerto</title>
        <meta
          name="description"
          content="Ajukan permohonan surat izin keramaian secara online"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content="https://www.desapakukerto.id/layanan/surat-izin-keramaian"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Surat Izin Keramaian - Desa Pakukerto"
        />
        <meta
          property="og:description"
          content="Ajukan permohonan surat izin keramaian secara online"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/layanan/surat-izin-keramaian"
        />
        <meta
          name="twitter:title"
          content="Surat Izin Keramaian - Desa Pakukerto"
        />
        <meta
          name="twitter:description"
          content="Ajukan permohonan surat izin keramaian secara online"
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>

      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">
                  Surat Permohonan Izin Keramaian
                </h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Silakan lengkapi formulir di bawah ini untuk mengajukan
                permohonan surat izin keramaian. Pastikan semua data yang
                dimasukkan benar dan lengkap.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Data Pemohon */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Data Pemohon
                    </CardTitle>
                    <CardDescription>
                      Informasi lengkap tentang pemohon izin keramaian
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nama"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nama Lengkap
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama lengkap"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tempatTanggalLahir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tempat/Tanggal Lahir
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Contoh: Pasuruan, 07/04/1990"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jenisKelamin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Jenis Kelamin
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Laki-laki">
                                  Laki-laki
                                </SelectItem>
                                <SelectItem value="Perempuan">
                                  Perempuan
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="agama"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Agama <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan agama"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nik"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              NIK <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan NIK"
                                maxLength={16}
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nomorHP"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nomor HP <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Contoh: 08123456789"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="alamat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alamat <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan alamat lengkap"
                              rows={3}
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Data Pelaksanaan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Data Pelaksanaan Keramaian
                    </CardTitle>
                    <CardDescription>
                      Informasi tentang waktu dan tempat pelaksanaan keramaian
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="hari"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Hari <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Contoh: Minggu"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tanggal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tanggal <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jamMulai"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Jam Mulai <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="jamSelesai"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Jam Selesai{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="jenisKeramaian"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Jenis Keramaian
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: Bantangan Lokal"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="keperluan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Keperluan <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Contoh: Menghibur Anaknya"
                              rows={3}
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lokasi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Lokasi <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Contoh: Dusun Janti RT 002 RW 008 Desa Pakukerto Kecamatan Sukorejo Kabupaten Pasuruan"
                              rows={3}
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Kontak */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Informasi Kontak
                    </CardTitle>
                    <CardDescription>
                      Nomor WhatsApp yang dapat dihubungi untuk konfirmasi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="nomorWhatsApp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nomor WhatsApp
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: 08123456789"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* reCAPTCHA */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={(token) => {
                          setRecaptchaToken(token);
                          form.setValue("recaptchaToken", token || "");
                        }}
                        onExpired={() => {
                          setRecaptchaToken(null);
                          form.setValue("recaptchaToken", "");
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !recaptchaToken}
                    className="min-w-[200px]"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Permohonan"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}
