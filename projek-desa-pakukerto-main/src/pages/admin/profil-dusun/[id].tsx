import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { dusunApi } from "@/lib/admin/dusun";
import { updateDusunSchema, UpdateDusunInput } from "@/schemas/dusun.schema";
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

function EditDusunPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<UpdateDusunInput>({
    resolver: zodResolver(updateDusunSchema),
    defaultValues: {
      nama: "",
      isi: "",
      gambar: undefined,
    },
  });

  // Fetch dusun data
  const {
    data: dusun,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dusun", id],
    queryFn: () => (id ? dusunApi.getById(id as string) : null),
    enabled: !!id,
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (dusun) {
      form.reset({
        nama: dusun.nama,
        isi: dusun.isi,
        gambar: dusun.gambar,
      });
    }
  }, [dusun, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateDusunInput) => dusunApi.update(id as string, data),
    onSuccess: () => {
      toast.success("Profil dusun berhasil diperbarui");
      router.push("/admin/profil-dusun");
    },
    onError: (error) => {
      console.error("Error updating dusun:", error);
      toast.error(`Gagal memperbarui profil dusun: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  const onSubmit = async (data: UpdateDusunInput) => {
    setIsSubmitting(true);
    updateMutation.mutate(data);
  };

  // Error state is handled below

  if (isLoading) {
    return (
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6">Edit Profil Dusun</h1>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !dusun) {
    return (
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6">Error</h1>
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-red-500 mb-4">Gagal memuat data dusun</p>
          <Button onClick={() => router.push("/admin/dusun")}>
            Kembali ke Daftar Dusun
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">
        Edit Profil Dusun - {dusun.nama}
      </h1>
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
          <CardTitle>Edit Profil Dusun</CardTitle>
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
                        value={field.value ?? ""}
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
                        value={field.value ?? ""}
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
                  "Simpan Perubahan"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default EditDusunPage;
