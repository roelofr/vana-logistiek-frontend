export async function convertToWebP(files: File[]): Promise<File[]> {
  const results = [] as File[];

  for (const file of files) {
    try {
      // Create an image object from the file
      const img = await loadImage(file);

      // Create invisible canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw image to canvas
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      // Export as WebP
      const webpData = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/webp", 0.95);
      });

      if (webpData)
        results.push(
          new File([webpData], file.name, {
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

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };

    img.src = url;
  });
}
