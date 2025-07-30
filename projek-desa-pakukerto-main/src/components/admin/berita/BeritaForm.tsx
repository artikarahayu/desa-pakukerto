import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBeritaSchema, CreateBeritaInput } from "@/schemas/berita.schema";
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
import { Separator } from "@/components/ui/separator";
import ImageUpload from "./ImageUpload";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />,
});
import "react-quill/dist/quill.snow.css";

interface BeritaFormProps {
  initialData?: {
    judul: string;
    thumbnail: string;
    isi: string;
  };
  onSubmit: (data: CreateBeritaInput) => void;
  isSubmitting: boolean;
}

export default function BeritaForm({
  initialData,
  onSubmit,
  isSubmitting,
}: BeritaFormProps) {
  const [isMounted, setIsMounted] = useState(false);

  // React Hook Form with Zod validation
  const form = useForm<CreateBeritaInput>({
    resolver: zodResolver(createBeritaSchema),
    defaultValues: initialData || {
      judul: "",
      thumbnail: "",
      isi: "",
    },
  });

  // Set isMounted to true on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  // Don't render form on server side
  if (!isMounted) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="judul"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Masukkan judul berita"
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
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="isi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Isi Berita</FormLabel>
                <FormControl>
                  <div className="min-h-[200px]">
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={modules}
                      formats={formats}
                      placeholder="Tulis isi berita di sini..."
                      className="h-64"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pr-4 mt-16">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Berita"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
