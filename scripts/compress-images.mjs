import sharp from "sharp";
import fs from "fs";
import path from "path";

const targets = [
  "public/assets/images/meals/fried-rice.jpg",
  "public/assets/images/meals/spaghetti.jpg",
  "public/assets/images/meals/chocolate-cake.jpg",
  "public/assets/subfooterbg.png",
  "public/assets/StepImg1.png",
  "public/assets/productPlaceholder.png",
  "public/assets/about-hero.png",
  "public/assets/StepImg2.png",
  "public/assets/hero1.png",
  "public/assets/whyUs3.png",
  "public/assets/whyUs2.png",
  "public/assets/hero2.png",
];

async function compress(rel) {
  const file = path.resolve(rel);
  if (!fs.existsSync(file)) {
    console.log("skip missing", rel);
    return;
  }
  const before = fs.statSync(file).size;
  const ext = path.extname(file).toLowerCase();
  const tmp = file + ".tmp";

  let pipeline = sharp(file).rotate();
  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: 72, mozjpeg: true });
  } else if (ext === ".png") {
    // Keep PNG for transparency; compress aggressively.
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 80 });
  } else {
    console.log("skip unsupported", rel);
    return;
  }

  await pipeline.toFile(tmp);
  const after = fs.statSync(tmp).size;
  if (after < before) {
    fs.renameSync(tmp, file);
    console.log(
      `${rel}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`,
    );
  } else {
    fs.unlinkSync(tmp);
    console.log(`${rel}: kept original (${(before / 1024).toFixed(0)}KB)`);
  }
}

for (const t of targets) {
  await compress(t);
}
