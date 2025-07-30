import axios from 'axios';
import imageCompression from 'browser-image-compression';

// Cloudinary upload URL for unsigned uploads
export const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  resource_type: string;
}

/**
 * Compresses an image and uploads it to Cloudinary
 * @param file Image file to upload
 * @param uploadPreset Cloudinary upload preset
 * @returns Cloudinary upload response
 */
export const uploadImageToCloudinary = async (
  file: File,
  uploadPreset: string
): Promise<CloudinaryUploadResponse> => {
  try {
    // Compress image before uploading
    const options = {
      maxSizeMB: 1, // Max file size in MB
      maxWidthOrHeight: 1200, // Max width/height in pixels
      useWebWorker: true,
    };
    
    const compressedFile = await imageCompression(file, options);
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'bagan-desa');
    
    // Upload to Cloudinary
    const response = await axios.post<CloudinaryUploadResponse>(
      cloudinaryUploadUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Deletes an image from Cloudinary
 * @param publicId Public ID of the image to delete
 */
export const deleteImageFromCloudinary = async (): Promise<void> => {
  try {
    // Note: For security reasons, image deletion should be done from the server-side
    // This is a placeholder for the client-side implementation
    console.warn('Image deletion from client-side is not implemented for security reasons');
    console.info('To delete images, implement a server-side function or use Cloudinary Admin API');
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
};
