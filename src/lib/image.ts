/** Compress / resize any user photo so large phone images still upload cleanly. */
export async function prepareAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, WebP, or GIF).");
  }

  const bitmap = await createImageBitmap(file);
  const maxSide = 720;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not process that image. Try another photo.");
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Prefer JPEG for size; keep PNG if the source has transparency needs (rare for avatars).
  const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
  let quality = 0.88;
  let dataUrl = canvas.toDataURL(mime, quality);

  // If still huge (localStorage limits), step quality down.
  while (dataUrl.length > 900_000 && quality > 0.45) {
    quality -= 0.12;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  return dataUrl;
}
