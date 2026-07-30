import { uploadPublicImage } from "./r2";

export async function saveServiceImage(serviceId: string, file: File): Promise<string> {
  return uploadPublicImage("services", serviceId, file);
}
