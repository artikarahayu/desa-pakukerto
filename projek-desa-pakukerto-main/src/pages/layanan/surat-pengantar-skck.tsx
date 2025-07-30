import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSuratPengantarSKCKSchema,
  CreateSuratPengantarSKCKInput,
} from "@/schemas/surat-pengantar-skck.schema";
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
import { FileText, User, Calendar, Phone, MapPin, Shield } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "sonner";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function SuratPengantarSKCKPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const form = useForm<CreateSuratPengantarSKCKInput>({
    resolver: zodResolver(createSuratPengantarSKCKSchema),
    defaultValues: {
      namaLengkap: "",
      nik: "",
      tempatLahir: "",
      tanggalLahir: "",
      jenisKelamin: undefined,
      agama: undefined,
      statusPerkawinan: undefined,
      pekerjaan: "",
      alamat: "",
      keperluan: "",
      nomorWhatsApp: "",
      recaptchaToken: "",
    },
  });

  const onSubmit = async (data: CreateSuratPengantarSKCKInput) => {
    if (!recaptchaToken) {
      toast.error("Harap selesaikan verifikasi reCAPTCHA");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...data,
        recaptchaToken,
      };

      await axios.post("/api/layanan/surat-pengantar-skck", submitData);

      toast.success("Permohonan surat pengantar SKCK berhasil dikirim!");
      router.push("/layanan/sukses");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengirim permohonan"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    if (token) {
      form.setValue("recaptchaToken", token);
    }
  };

  return (
    <>
      <Head>
        <title>Surat Pengantar SKCK - Desa Pakukerto</title>
        <meta
          name="description"
          content="Ajukan permohonan surat pengantar SKCK online di Desa Pakukerto"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content="https://www.desapakukerto.id/layanan/surat-pengantar-skck"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Surat Pengantar SKCK - Desa Pakukerto"
        />
        <meta
          property="og:description"
          content="Ajukan permohonan surat pengantar SKCK online di Desa Pakukerto"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/layanan/surat-pengantar-skck"
        />
        <meta
          name="twitter:title"
          content="Surat Pengantar SKCK - Desa Pakukerto"
        />
        <meta
          name="twitter:description"
          content="Ajukan permohonan surat pengantar SKCK online di Desa Pakukerto"
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>

      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Surat Pengantar SKCK</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ajukan permohonan surat pengantar SKCK (Surat Keterangan Catatan
                Kepolisian) secara online. Pastikan semua data yang diisi sudah
                benar dan sesuai dengan dokumen resmi.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Data Pemohon */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Data Pemohon
                    </CardTitle>
                    <CardDescription>
                      Informasi lengkap tentang pemohon surat pengantar SKCK
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
                              Nama Lengkap{" "}
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
                        name="nik"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              NIK <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan NIK (16 digit)"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tempatLahir"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tempat Lahir{" "}
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
                              Tanggal Lahir{" "}
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
                              Jenis Kelamin{" "}
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih agama" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Islam">Islam</SelectItem>
                                <SelectItem value="Kristen">Kristen</SelectItem>
                                <SelectItem value="Katolik">Katolik</SelectItem>
                                <SelectItem value="Hindu">Hindu</SelectItem>
                                <SelectItem value="Buddha">Buddha</SelectItem>
                                <SelectItem value="Konghucu">
                                  Konghucu
                                </SelectItem>
                              </SelectContent>
                            </Select>
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
                              Status Perkawinan{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih status perkawinan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Belum Kawin">
                                  Belum Kawin
                                </SelectItem>
                                <SelectItem value="Kawin">Kawin</SelectItem>
                                <SelectItem value="Cerai Hidup">
                                  Cerai Hidup
                                </SelectItem>
                                <SelectItem value="Cerai Mati">
                                  Cerai Mati
                                </SelectItem>
                              </SelectContent>
                            </Select>
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
                            Alamat Lengkap{" "}
                            <span className="text-red-500">*</span>
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

                {/* Keperluan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Keperluan
                    </CardTitle>
                    <CardDescription>
                      Tujuan pengajuan surat pengantar SKCK
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                              placeholder="Jelaskan keperluan pembuatan SKCK (contoh: Melamar pekerjaan, dll)"
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
                            Nomor WhatsApp{" "}
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
