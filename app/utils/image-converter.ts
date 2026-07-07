export async function convertToWebP(files: File[]): Promise<File[]> {
  const results = [] as File[];

  for (const file of files) {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
        resizeQuality: "high",
      });

      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const renderer = canvas.getContext("bitmaprenderer");
      renderer?.transferFromImageBitmap(bitmap);

      const blob = await canvas.convertToBlob({
        type: "image/webp",
        quality: 0.95,
      });

      if (blob)
        results.push(
          new File([blob], file.name, {
            type: "image/webp",
            lastModified: Date.now(),
          }),
        );
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
    }
  }

  return results;
}
