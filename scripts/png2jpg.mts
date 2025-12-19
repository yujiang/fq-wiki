import fs from "fs";
import path from "path";
import sharp from "sharp";


const inputDir = path.resolve("docs/public/images/char");
const outputDir = path.resolve("docs/public/images/char");

fs.mkdirSync(outputDir, { recursive: true });

for (const file of fs.readdirSync(inputDir)) {
  if (!file.endsWith(".png")) continue;

  const input = path.join(inputDir, file);
  const output = path.join(
    outputDir,
    file.replace(/\.png$/, ".jpg")
  );

  await sharp(input)
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 90 })
    .toFile(output);

  fs.unlinkSync(input); // 删除原始 PNG 文件

  console.log(`✓ ${file} -> jpg`);
}
