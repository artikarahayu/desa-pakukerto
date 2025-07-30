import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUmkmSchema, CreateUmkmInput } from "@/schemas/umkm.schema";
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
import { Separator } from "@/components/ui/separator";
import MultiImageUpload from "./MultiImageUpload";

interface UmkmFormProps {
  initialData?: {
    nama: string;
    deskripsi: string;
    gambar: string[];
    whatsapp: string;
    harga: string;
  };
  onSubmit: (data: CreateUmkmInput) => void;
  isSubmitting: boolean;
}

export default function UmkmForm({
  initialData,
  onSubmit,
  isSubmitting,
}: UmkmFormProps) {
  const [isMounted, setIsMounted] = useState(false);

  // React Hook Form with Zod validation
  const form = useForm<CreateUmkmInput>({
    resolver: zodResolver(createUmkmSchema),
    defaultValues: initialData || {
      nama: "",
      deskripsi: "",
      gambar: [],
      whatsapp: "",
      harga: "",
    },
  });

  // Set isMounted to true on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  // Format WhatsApp number for wa.me link
  const formatWhatsAppNumber = (number: string): string => {
    // Remove any non-digit characters
    const digits = number.replace(/\D/g, "");
    
    // If the number starts with '0', replace it with '62' (Indonesia country code)
    if (digits.startsWith("0")) {
      return digits.replace(/^0/, "62");
    }
    
    // If the number doesn't have country code, add '62'
    if (!digits.startsWith("62")) {
      return `62${digits}`;
    }
    
    return digits;
  };

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
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Produk</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Masukkan nama produk"
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
            name="gambar"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiImageUpload
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
            name="deskripsi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Produk</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Masukkan deskripsi produk"
                    disabled={isSubmitting}
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="harga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Produk</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input">
                      Rp
                    </span>
                    <Input
                      placeholder="150.000"
                      disabled={isSubmitting}
                      className="rounded-l-none"
                      {...field}
                      onChange={(e) => {
                        // Format as currency (allow digits, dots, and commas)
                        const value = e.target.value.replace(/[^0-9.,]/g, "");
                        field.onChange(value);
                      }}
                    />
                  </div>
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Format: 150.000 (tanpa Rp)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WhatsApp</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input">
                      +62
                    </span>
                    <Input
                      placeholder="8123456789"
                      disabled={isSubmitting}
                      className="rounded-l-none"
                      value={field.value.startsWith("62") ? field.value.substring(2) : field.value}
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, "");
                        // Remove leading 0 if present
                        const formattedValue = value.startsWith("0") ? value.substring(1) : value;
                        field.onChange(formattedValue);
                      }}
                    />
                  </div>
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Format: 8123456789 (tanpa awalan 0)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pr-4 mt-8">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
