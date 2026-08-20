import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const galleryDir = new URL("../public/images/trail-gallery/", import.meta.url);
const files = (await fs.readdir(galleryDir)).filter((name) => name.endsWith(".jpg")).sort();

for (const file of files) {
  const input = new URL(file, galleryDir);
  const temporary = new URL(`${file}.optimized`, galleryDir);
  await sharp(fileURLToPath(input))
    .rotate()
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 70, mozjpeg: true })
    .toFile(fileURLToPath(temporary));
  await fs.rename(temporary, input);
}

const sizes = await Promise.all(files.map(async (file) => (await fs.stat(new URL(file, galleryDir))).size));
console.log(`Optimized ${files.length} photos to ${(sizes.reduce((sum, size) => sum + size, 0) / 1024 / 1024).toFixed(1)} MB in ${fileURLToPath(galleryDir)}`);
