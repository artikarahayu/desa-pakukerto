import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { profileApi } from "@/lib/admin/profile";

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// Define the form schema with Zod
const formSchema = z.object({
  content: z.string().min(1, "Sejarah desa tidak boleh kosong"),
});

type FormValues = z.infer<typeof formSchema>;

// Quill modules configuration with more comprehensive toolbar
const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["clean"],
  ],
};

export default function SejarahDesaTab() {
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = useQueryClient();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  // Fetch existing data
  const { data, isLoading, error } = useQuery({
    queryKey: ["sejarahDesa"],
    queryFn: async () => {
      return await profileApi.sejarah.get();
    },
  });

  // Update form values when data is fetched
  useEffect(() => {
    if (data && data.content) {
      form.setValue("content", data.content);
    }
  }, [data, form]);

  // Handle client-side rendering for React Quill
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mutation for saving data
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return await profileApi.sejarah.update(values);
    },
    onSuccess: () => {
      toast.success("Sejarah desa berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["sejarahDesa"] });
    },
    onError: (error) => {
      toast.error("Gagal menyimpan sejarah desa");
      console.error("Error saving sejarah desa:", error);
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sejarah Desa</FormLabel>
                  <FormControl>
                    {isMounted && (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        modules={quillModules}
                        className="min-h-[300px]"
                      />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end pr-4 mt-16">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="min-w-[150px] z-50"
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
