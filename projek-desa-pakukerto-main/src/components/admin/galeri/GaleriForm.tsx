import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGaleriSchema, CreateGaleriInput, extractYoutubeVideoId } from "@/schemas/galeri.schema";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GaleriImageUpload from "./GaleriImageUpload";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon, Youtube } from "lucide-react";

interface GaleriFormProps {
  initialData?: {
    type: "image" | "video";
    title: string;
    imageUrl?: string;
    youtubeUrl?: string;
  };
  onSubmit: (data: CreateGaleriInput) => void;
  isSubmitting: boolean;
}

export default function GaleriForm({
  initialData,
  onSubmit,
  isSubmitting,
}: GaleriFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"image" | "video">(
    initialData?.type || "image"
  );

  // React Hook Form with Zod validation
  const form = useForm<CreateGaleriInput>({
    resolver: zodResolver(createGaleriSchema),
    defaultValues: initialData || {
      type: "image",
      title: "",
      imageUrl: "",
      youtubeUrl: "",
    },
  });

  // Set isMounted to true on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "image" || value === "video") {
      setActiveTab(value);
      form.setValue("type", value);
      
      // Reset the other field when switching tabs
      if (value === "image") {
        form.setValue("youtubeUrl", "");
      } else {
        form.setValue("imageUrl", "");
      }
    }
  };

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  // YouTube preview
  const youtubeUrl = form.watch("youtubeUrl");
  const youtubeId = youtubeUrl ? extractYoutubeVideoId(youtubeUrl) : null;

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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Masukkan judul galeri"
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Galeri</FormLabel>
                <FormControl>
                  <Tabs
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="image" disabled={isSubmitting}>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Gambar
                      </TabsTrigger>
                      <TabsTrigger value="video" disabled={isSubmitting}>
                        <Youtube className="mr-2 h-4 w-4" />
                        Video YouTube
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="image" className="mt-4">
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <GaleriImageUpload
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="video" className="mt-4">
                      <FormField
                        control={form.control}
                        name="youtubeUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Video YouTube</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.youtube.com/watch?v=..."
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            {youtubeId && (
                              <div className="mt-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                  Preview:
                                </p>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full"
                                  ></iframe>
                                </div>
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
