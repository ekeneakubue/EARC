import { uploadPublicImage } from "./r2";

export async function saveNewsImage(newsId: string, file: File): Promise<string> {
  return uploadPublicImage("news", newsId, file);
}
