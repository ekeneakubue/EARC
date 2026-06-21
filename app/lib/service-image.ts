import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function saveServiceImage(serviceId: string, file: File): Promise<string> {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Service image is required.");
  }

  const extension = EXTENSIONS[file.type];

  if (!extension) {
    throw new Error("Upload a JPG, PNG, WebP, or GIF image.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const servicesDir = path.join(process.cwd(), "public", "images", "services");
  await mkdir(servicesDir, { recursive: true });

  const filename = `${serviceId}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(servicesDir, filename), buffer);

  return `/images/services/${filename}`;
}
