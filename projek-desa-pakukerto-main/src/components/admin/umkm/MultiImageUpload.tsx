import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export default function MultiImageUpload({
  value,
  onChange,
  disabled = false,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(10);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Upload image to Cloudinary
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (!uploadPreset) {
        throw new Error("Cloudinary upload preset not configured");
      }

      const result = await uploadImageToCloudinary(file, uploadPreset);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add the new image URL to the existing array
      onChange([...value, result.secure_url]);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("Gagal mengunggah gambar. Silakan coba lagi.");
      console.error("Error uploading image:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...value];
    updatedImages.splice(index, 1);
    onChange(updatedImages);
  };


  return (
    <div className="space-y-4">
      <Label htmlFor="productImages">Gambar Produk</Label>

      <div className="flex flex-col gap-4">
        <input
          ref={fileInputRef}
          id="productImages"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 flex-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-sm">{uploadProgress}%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Mengunggah gambar...
            </p>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Display existing images */}
          {value.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square w-full overflow-hidden rounded-md border">
                <Image
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveImage(index)}
                disabled={disabled}
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Add image button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="aspect-square w-full flex items-center justify-center gap-2 border-dashed"
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm">Tambah Gambar</span>
          </Button>
        </div>

        {value.length === 0 && !isUploading && (
          <p className="text-sm text-muted-foreground">
            Minimal harus ada 1 gambar produk.
          </p>
        )}
      </div>
    </div>
  );
}
