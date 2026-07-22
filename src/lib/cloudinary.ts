import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(file: string, folder: string = "cloth-store") {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
      transformation: [
        { width: 1200, height: 1200, crop: "limit", quality: "auto" },
      ],
    });
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    throw new Error("Failed to upload image");
  }
}

export async function uploadVideo(file: string, folder: string = "cloth-store/videos") {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "video",
    });
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    throw new Error("Failed to upload video");
  }
}

export async function deleteAsset(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error("Failed to delete asset");
  }
}
