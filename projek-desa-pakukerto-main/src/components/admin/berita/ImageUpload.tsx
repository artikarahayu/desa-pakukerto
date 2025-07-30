import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  disabled = false,
}: ImageUploadProps) {
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

      // Simulate progress (in a real app, you might get this from the upload API)
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

      // Pass the image URL to the parent component
      onChange(result.secure_url);
    } catch (err) {
      setError("Gagal mengunggah gambar. Silakan coba lagi.");
      console.error("Error uploading image:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="thumbnail">Thumbnail</Label>

      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={disabled || isUploading}
          className={value ? "hidden" : ""}
        />

        {!value && !isUploading && (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Unggah Gambar
          </Button>
        )}

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

        {value && (
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
              <Image
                src={value}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
            </div>

            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
              disabled={disabled}
              className="absolute top-2 right-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
