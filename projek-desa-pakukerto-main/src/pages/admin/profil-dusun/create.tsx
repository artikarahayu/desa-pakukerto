import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { dusunApi } from "@/lib/admin/dusun";
import { createDusunSchema, CreateDusunInput } from "@/schemas/dusun.schema";
import AdminLayout from "@/components/layouts/AdminLayout";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import DusunImageUpload from "@/components/admin/dusun/DusunImageUpload";
import DusunEditor from "@/components/admin/dusun/DusunEditor";

function CreateDusunPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<CreateDusunInput>({
    resolver: zodResolver(createDusunSchema),
    defaultValues: {
      nama: "",
      isi: "",
      gambar: undefined,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateDusunInput) => dusunApi.create(data),
    onSuccess: () => {
      toast.success("Profil dusun berhasil dibuat");
      router.push("/admin/profil-dusun");
    },
    onError: (error) => {
      console.error("Error creating dusun:", error);
      toast.error(`Gagal membuat profil dusun: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  const onSubmit = async (data: CreateDusunInput) => {
    setIsSubmitting(true);
    createMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Buat Profil Dusun</h1>
      <div className="mb-4">
        <Link href="/admin/profil-dusun">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Profil Dusun Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nama Dusun */}
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Dusun</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama dusun"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gambar Dusun */}
              <FormField
                control={form.control}
                name="gambar"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DusunImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Konten Dusun */}
              <FormField
                control={form.control}
                name="isi"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DusunEditor
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Profil Dusun"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default CreateDusunPage;
