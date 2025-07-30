import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { ImagePlus, Trash2, Loader2, Upload } from "lucide-react";
import Image from "next/image";

interface StrukturImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function StrukturImageUpload({
  value,
  onChange,
  disabled,
}: StrukturImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

      // Pass the image URL to the parent component
      onChange(result.secure_url);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("Gagal mengunggah foto. Silakan coba lagi.");
      console.error("Error uploading image:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="strukturImage">Foto Pejabat</Label>

      <div className="flex flex-col gap-4">
        <input
          ref={fileInputRef}
          id="strukturImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className={value ? "hidden" : ""}
        />

        <div className="flex flex-col items-center gap-4">
          {value ? (
            <div className="relative aspect-square w-40 h-40 rounded-full overflow-hidden border border-border">
              <Image
                src={value}
                alt="Foto Pejabat"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-40 h-40 rounded-full bg-muted">
              <ImagePlus className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          {isUploading && (
            <div className="space-y-2 w-full max-w-xs">
              <div className="flex items-center gap-2">
                <div className="h-4 flex-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-sm">{uploadProgress}%</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Mengunggah foto...
              </p>
            </div>
          )}

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <div className="flex gap-2">
            {!isUploading && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClick}
                disabled={disabled || isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {value ? "Ganti Foto" : "Unggah Foto"}
              </Button>
            )}

            {value && !isUploading && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemove}
                disabled={disabled || isUploading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Unggah foto pejabat. Format: JPG, PNG. Ukuran maks: 1MB.
        </p>
      </div>
    </div>
  );
}
