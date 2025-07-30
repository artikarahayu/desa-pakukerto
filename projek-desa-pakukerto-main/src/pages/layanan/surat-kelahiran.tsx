import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSuratKelahiranSchema,
  CreateSuratKelahiranInput,
} from "@/schemas/surat-kelahiran.schema";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, User, Users, Phone, UserCheck } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "sonner";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function SuratKelahiranPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const form = useForm<CreateSuratKelahiranInput>({
    resolver: zodResolver(createSuratKelahiranSchema),
    defaultValues: {
      namaLengkapAnak: "",
      anakKe: 1,
      tempatLahirAnak: "",
      tanggalLahirAnak: "",
      alamatAnak: "",
      namaIbu: "",
      nikIbu: "",
      tempatLahirIbu: "",
      tanggalLahirIbu: "",
      alamatIbu: "",
      namaAyah: "",
      nikAyah: "",
      tempatLahirAyah: "",
      tanggalLahirAyah: "",
      alamatAyah: "",
      nomorWhatsApp: "",
      penolongKelahiran: "",
      alamatPenolong: "",
      keperluan: "",
      recaptchaToken: "",
    },
  });

  const onSubmit = async (data: CreateSuratKelahiranInput) => {
    console.log("Form data:", data);
    console.log("reCAPTCHA token:", recaptchaToken);

    if (!recaptchaToken) {
      toast.error("Silakan verifikasi reCAPTCHA terlebih dahulu");
      return;
    }

    // All required fields are validated by the schema

    setIsSubmitting(true);

    try {
      const submitData = {
        ...data,
        recaptchaToken,
      };

      console.log("Submitting data:", submitData);
      await axios.post("/api/layanan/surat-kelahiran", submitData);

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
        <title>Surat Keterangan Kelahiran - Desa Pakukerto</title>
        <meta
          name="description"
          content="Ajukan permohonan surat keterangan kelahiran secara online"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content="https://www.desapakukerto.id/layanan/surat-kelahiran"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Surat Keterangan Kelahiran - Desa Pakukerto"
        />
        <meta
          property="og:description"
          content="Ajukan permohonan surat keterangan kelahiran secara online"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/layanan/surat-kelahiran"
        />
        <meta
          name="twitter:title"
          content="Surat Keterangan Kelahiran - Desa Pakukerto"
        />
        <meta
          name="twitter:description"
          content="Ajukan permohonan surat keterangan kelahiran secara online"
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
                  Surat Keterangan Kelahiran
                </h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Silakan lengkapi formulir di bawah ini untuk mengajukan
                permohonan surat keterangan kelahiran. Pastikan semua data yang
                dimasukkan benar dan lengkap.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Data Anak */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Data Anak
                    </CardTitle>
                    <CardDescription>
                      Informasi lengkap tentang anak yang akan dibuatkan surat
                      keterangan kelahiran
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="namaLengkapAnak"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nama Lengkap Anak
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama lengkap anak"
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
                        name="anakKe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Anak ke <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="1"
                                disabled={isSubmitting}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 1)
                                }
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
                        name="tempatLahirAnak"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tempat Lahir
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan tempat lahir anak"
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
                        name="tanggalLahirAnak"
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

                    <FormField
                      control={form.control}
                      name="alamatAnak"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alamat Anak <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan alamat lengkap anak"
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

                {/* Data Ibu */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Data Ibu
                    </CardTitle>
                    <CardDescription>
                      Informasi lengkap tentang ibu dari anak
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="namaIbu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nama Lengkap Ibu
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama lengkap ibu"
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
                        name="nikIbu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              NIK Ibu <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan NIK ibu"
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
                        name="tempatLahirIbu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tempat Lahir Ibu
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan tempat lahir ibu"
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
                        name="tanggalLahirIbu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tanggal Lahir Ibu
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

                    <FormField
                      control={form.control}
                      name="alamatIbu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alamat Ibu <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan alamat lengkap ibu"
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

                {/* Data Ayah */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Data Ayah
                    </CardTitle>
                    <CardDescription>
                      Informasi lengkap tentang ayah dari anak
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="namaAyah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Nama Lengkap Ayah
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan nama lengkap ayah"
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
                        name="nikAyah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              NIK Ayah <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan NIK ayah"
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
                        name="tempatLahirAyah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tempat Lahir Ayah
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Masukkan tempat lahir ayah"
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
                        name="tanggalLahirAyah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Tanggal Lahir Ayah
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

                    <FormField
                      control={form.control}
                      name="alamatAyah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alamat Ayah <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan alamat lengkap ayah"
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

                {/* Penolong Kelahiran */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-primary" />
                      Penolong Kelahiran
                    </CardTitle>
                    <CardDescription>
                      Informasi tentang penolong kelahiran (bidan, dokter, dll)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="penolongKelahiran"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nama Penolong Kelahiran
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nama penolong kelahiran (bidan, dokter, dll)"
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
                      name="alamatPenolong"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alamat Penolong
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan alamat lengkap penolong kelahiran"
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
                      Tujuan pengajuan surat keterangan kelahiran
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
                              placeholder="Masukkan keperluan pengajuan surat keterangan kelahiran"
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
