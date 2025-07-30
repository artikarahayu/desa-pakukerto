import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStrukturSchema, CreateStrukturInput } from "@/schemas/struktur.schema";
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
import StrukturImageUpload from "@/components/admin/struktur/StrukturImageUpload";

interface StrukturFormProps {
  initialData?: {
    nama: string;
    jabatan: string;
    foto: string;
  };
  onSubmit: (data: CreateStrukturInput) => void;
  isSubmitting: boolean;
}

export default function StrukturForm({
  initialData,
  onSubmit,
  isSubmitting,
}: StrukturFormProps) {
  const form = useForm<CreateStrukturInput>({
    resolver: zodResolver(createStrukturSchema),
    defaultValues: initialData || {
      nama: "",
      jabatan: "",
      foto: "",
    },
  });

  const handleSubmit = (data: CreateStrukturInput) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
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
          name="jabatan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jabatan</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan jabatan"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="foto"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StrukturImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
    </Form>
  );
}
