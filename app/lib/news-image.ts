import { mkdir, writeFile } from "fs/promises";
import path from "path";

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

  const newsDirectory = path.join(process.cwd(), "public", "images", "news");
  await mkdir(newsDirectory, { recursive: true });

  const filename = `${newsId}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(newsDirectory, filename), buffer);

  return `/images/news/${filename}`;
}
