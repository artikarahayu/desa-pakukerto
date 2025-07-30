import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateSuratKeteranganInput,
  createSuratKeteranganSchema,
} from "@/schemas/surat-keterangan.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FileText, List, Phone, Plus, Trash2, User } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FieldArrayPath, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SuratKeteranganPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const form = useForm<CreateSuratKeteranganInput>({
    resolver: zodResolver(createSuratKeteranganSchema),
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
      keterangan: [""],
      keperluan: "",
      nomorWhatsApp: "",
      recaptchaToken: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "keterangan" as FieldArrayPath<CreateSuratKeteranganInput>,
  });

  const onSubmit = async (data: CreateSuratKeteranganInput) => {
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
      await axios.post("/api/layanan/surat-keterangan", submitData);

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
        <title>Surat Keterangan - Desa Pakukerto</title>
        <meta
          name="description"
          content="Ajukan permohonan surat keterangan secara online"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:url"
          content="https://www.desapakukerto.id/layanan/surat-keterangan"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Surat Keterangan - Desa Pakukerto" />
        <meta
          property="og:description"
          content="Ajukan permohonan surat keterangan secara online"
        />
        <meta property="og:image" content="/images/hero-2.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="desapakukerto.id" />
        <meta
          property="twitter:url"
          content="https://www.desapakukerto.id/layanan/surat-keterangan"
        />
        <meta
          name="twitter:title"
          content="Surat Keterangan - Desa Pakukerto"
        />
        <meta
          name="twitter:description"
          content="Ajukan permohonan surat keterangan secara online"
        />
        <meta name="twitter:image" content="/images/hero-2.webp" />
      </Head>

      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Surat Keterangan</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Silakan lengkapi formulir di bawah ini untuk mengajukan
                permohonan surat keterangan. Pastikan semua data yang dimasukkan
                benar dan lengkap.
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
                      Informasi lengkap tentang pemohon surat keterangan
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

                {/* Keterangan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <List className="h-5 w-5 text-primary" />
                      Keterangan
                    </CardTitle>
                    <CardDescription>
                      Daftar keterangan yang diperlukan (dapat menambah lebih
                      dari satu)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-end">
                        <FormField
                          control={form.control}
                          name={`keterangan.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>
                                Keterangan {index + 1}{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`Masukkan keterangan ${
                                    index + 1
                                  }`}
                                  disabled={isSubmitting}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => remove(index)}
                            disabled={isSubmitting}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append("")}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Keterangan
                    </Button>
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
                      Tujuan pengajuan surat keterangan
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
                              placeholder="Masukkan keperluan pengajuan surat keterangan"
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
