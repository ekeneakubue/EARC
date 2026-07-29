import { put } from "@vercel/blob";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function saveNewsImage(newsId: string, file: File): Promise<string> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("News image is required.");
  }

  const extension = EXTENSIONS[file.type];

  if (!extension) {
    throw new Error("Upload a JPG, PNG, WebP, or GIF image.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const filename = `${newsId}.${extension}`;
  const blob = await put(`news/${filename}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return blob.url;
}
