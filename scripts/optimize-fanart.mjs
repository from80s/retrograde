import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FANART_DIR = path.resolve(__dirname, '..', 'assets', 'system', 'fanart');

const files = fs.readdirSync(FANART_DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

async function optimize() {
  let totalOriginal = 0;
  let totalFinal = 0;

  for (const file of files) {
    const filePath = path.join(FANART_DIR, file);
    const originalSize = fs.statSync(filePath).size;
    totalOriginal += originalSize;

    const ext = path.extname(file).toLowerCase();
    const isPng = ext === '.png';

    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Sempre converter para JPEG (quality 92) - qualidade visualmente lossless
    // PNG lossless savings são baixos; JPEG 92 é ~5-10x menor sem diferença visível
    const outName = file.replace(/\.(png|jpg|jpeg)$/i, '.jpg');
    const outPath = path.join(FANART_DIR, outName);

    await image
      .jpeg({
        quality: 92,
        chromaSubsampling: '4:4:4',
        mozjpeg: true,
      })
      .toFile(outPath);

    const newSize = fs.statSync(outPath).size;
    totalFinal += newSize;

    const pct = ((1 - newSize / originalSize) * 100).toFixed(1);
    console.log(
      `${file.padEnd(35)} ${(originalSize / 1024 / 1024).toFixed(1).padStart(4)}MB → ${(newSize / 1024 / 1024).toFixed(1).padStart(4)}MB (${pct}% menor)`
    );

    // Remove original se extensão mudou
    if (outName !== file) {
      fs.unlinkSync(filePath);
    }
  }

  const totalSaved = totalOriginal - totalFinal;
  console.log(`\nTotal: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalFinal / 1024 / 1024).toFixed(1)}MB (${(totalSaved / 1024 / 1024).toFixed(1)}MB economizados)`);
}

optimize().catch(console.error);
