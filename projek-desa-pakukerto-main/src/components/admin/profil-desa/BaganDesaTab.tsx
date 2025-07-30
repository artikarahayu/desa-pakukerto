import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { profileApi } from "@/lib/admin/profile";

// Define the form schema with Zod
const formSchema = z.object({
  images: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BaganDesaTab() {
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const queryClient = useQueryClient();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
    },
  });

  // Fetch existing data
  const { data, isLoading, error } = useQuery({
    queryKey: ["baganDesa"],
    queryFn: async () => {
      return await profileApi.bagan.get();
    },
  });

  // Update form values when data is fetched
  useEffect(() => {
    if (data && data.images) {
      setImages(data.images);
      form.setValue("images", data.images);
    }
  }, [data, form]);

  // Mutation for saving data
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return await profileApi.bagan.update({
        images: values.images || [],
      });
    },
    onSuccess: () => {
      toast.success("Bagan desa berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["baganDesa"] });
    },
    onError: (error) => {
      toast.error("Gagal menyimpan bagan desa");
      console.error("Error saving bagan desa:", error);
    },
  });

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Upload to Cloudinary
        const uploadPreset =
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
        const result = await uploadImageToCloudinary(file, uploadPreset);

        uploadedUrls.push(result.secure_url);
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      // Update state and form values
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      form.setValue("images", newImages);

      toast.success(`${files.length} gambar berhasil diunggah`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Gagal mengunggah gambar");
    } finally {
      setUploadingImages(false);
      setUploadProgress(0);
      // Reset file input
      e.target.value = "";
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    form.setValue("images", newImages);
  };

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    mutation.mutate({ ...values, images });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        Terjadi kesalahan saat memuat data. Silakan coba lagi.
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Gambar Bagan Desa</label>
                <p className="text-sm text-muted-foreground">
                  Unggah gambar bagan struktur desa. Gambar akan dikompresi
                  secara otomatis.
                </p>

                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                    disabled={uploadingImages}
                    className="flex items-center gap-2"
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mengunggah... {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Pilih Gambar
                      </>
                    )}
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group rounded-md overflow-hidden border border-border"
                    >
                      <div className="aspect-[4/3] relative">
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                          <img
                            src={image}
                            alt={`Bagan Desa ${index + 1}`}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <div className="border border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <p>Belum ada gambar bagan desa</p>
                  <p className="text-sm">
                    Klik "Pilih Gambar" untuk mengunggah
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending || uploadingImages}
                className="min-w-[150px]"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
