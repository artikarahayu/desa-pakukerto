import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSuratKeteranganKematianSchema,
  CreateSuratKeteranganKematianInput,
} from "@/schemas/surat-keterangan-kematian.schema";
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
import { FileText, User, Users, Phone, Calendar, MapPin } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "sonner";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function SuratKeteranganKematianPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const form = useForm<CreateSuratKeteranganKematianInput>({
    resolver: zodResolver(createSuratKeteranganKematianSchema),
    defaultValues: {
      namaPelapor: "",
      nikPelapor: "",
      alamatPelapor: "",
      statusPelapor: "",
      namaLengkap: "",
      nik: "",
      nomorKartuKeluarga: "",
      tempatLahir: "",
      tanggalLahir: "",
      jenisKelamin: "Laki-Laki",
      agama: "",
      statusPerkawinan: "",
      pekerjaan: "",
      alamat: "",
      hariTanggalMeninggal: "",
      provinsiKematian: "",
      kabupatenKematian: "",
      kecamatanKematian: "",
      desaKematian: "",
      sebabKematian: "",
      keperluan: "",
      nomorWhatsApp: "",
      recaptchaToken: "",
    },
  });

  const onSubmit = async (data: CreateSuratKeteranganKematianInput) => {
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
      await axios.post("/api/layanan/surat-keterangan-kematian", submitData);

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
        <title>Surat Keterangan Kematian - Desa Pakukerto</title>
        <meta
          name="description"
          content="Ajukan permohonan surat keterangan kematian secara online"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content="https://www.desapakukerto.id/layanan/surat-keterangan-kematian"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Surat Keterangan Kematian - Desa Pakukerto"
        />
        <meta
          property="og:description"
          content="Ajukan permohonan surat keterangan kematian secara online"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/layanan/surat-keterangan-kematian"
        />
        <meta
          name="twitter:title"
          content="Surat Keterangan Kematian - Desa Pakukerto"
        />
        <meta
          name="twitter:description"
          content="Ajukan permohonan surat keterangan kematian secara online"
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
                  Surat Keterangan Kematian
                </h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Silakan lengkapi formulir di bawah ini untuk mengajukan
                permohonan surat keterangan kematian. Pastikan semua data yang
                dimasukkan benar dan lengkap.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Data Pelapor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Data Pelapor
                    </CardTitle>
                    <CardDescription>
                      Informasi tentang pelapor kematian
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="namaPelapor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nama Pelapor
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama pelapor"
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
                        name="nikPelapor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              NIK Pelapor{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan NIK pelapor"
                                maxLength={16}
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
                      name="alamatPelapor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alamat Pelapor
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan alamat lengkap pelapor"
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
                      name="statusPelapor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Status/Hubungan dengan Almarhum/Almarhumah
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: Anak Kandung, Istri, Suami, dll"
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

                {/* Data Almarhum/Almarhumah */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Data Almarhum/Almarhumah
                    </CardTitle>
                    <CardDescription>
                      Informasi lengkap tentang almarhum/almarhumah
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="namaLengkap"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nama Lengkap
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama lengkap almarhum/almarhumah"
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
                        name="nik"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              NIK <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan NIK almarhum/almarhumah"
                                maxLength={16}
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
                      name="nomorKartuKeluarga"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nomor Kartu Keluarga
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nomor kartu keluarga"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tempatLahir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tempat Lahir
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan tempat lahir"
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
                        name="tanggalLahir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tanggal Lahir
                              <span className="text-red-500">*</span>
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
                                <SelectItem value="Laki-Laki">
                                  Laki-Laki
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
                        name="statusPerkawinan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Status Perkawinan
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan status perkawinan"
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
                        name="pekerjaan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Pekerjaan <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan pekerjaan"
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

                {/* Data Kematian */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Data Kematian
                    </CardTitle>
                    <CardDescription>
                      Informasi tentang waktu dan tempat kematian
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hariTanggalMeninggal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Hari/Tanggal Meninggal
                            <span className="text-red-500">*</span>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="provinsiKematian"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Provinsi Tempat Kematian
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan provinsi"
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
                        name="kabupatenKematian"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Kabupaten/Kota Tempat Kematian
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan kabupaten/kota"
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
                        name="kecamatanKematian"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Kecamatan Tempat Kematian
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan kecamatan"
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
                        name="desaKematian"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Desa Tempat Kematian
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan desa"
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
                      name="sebabKematian"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Sebab Kematian
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan sebab kematian"
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

                {/* Keperluan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Keperluan
                    </CardTitle>
                    <CardDescription>
                      Tujuan penggunaan surat keterangan kematian
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="keperluan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Keperluan
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan keperluan surat keterangan kematian"
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
