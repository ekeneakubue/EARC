import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
};

function getR2Config(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();
  const publicUrl = process.env.R2_PUBLIC_URL?.trim().replace(/\/$/, "");

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL.",
    );
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl };
}

function getR2Client(config: R2Config) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

function validateImageFile(file: File) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Image is required.");
  }

  const extension = EXTENSIONS[file.type];

  if (!extension) {
    throw new Error("Upload a JPG, PNG, WebP, or GIF image.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  return extension;
}

function objectKeyFromPublicUrl(url: string, publicUrl: string): string | null {
  if (!url.startsWith(`${publicUrl}/`)) {
    return null;
  }

  const key = url.slice(publicUrl.length + 1);

  return key.length > 0 ? key : null;
}

export async function uploadPublicImage(
  folder: "news" | "services",
  id: string,
  file: File,
): Promise<string> {
  const extension = validateImageFile(file);
  const config = getR2Config();
  const client = getR2Client(config);
  const key = `${folder}/${id}-${randomUUID()}.${extension}`;
  const body = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: body,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${config.publicUrl}/${key}`;
}

export async function deletePublicObject(url: string | null | undefined): Promise<void> {
  if (!url) {
    return;
  }

  let config: R2Config;

  try {
    config = getR2Config();
  } catch {
    return;
  }

  const key = objectKeyFromPublicUrl(url, config.publicUrl);

  if (!key) {
    return;
  }

  const client = getR2Client(config);

  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    }),
  );
}
