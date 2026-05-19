import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.join(__dirname, '..', 'assets', 'system logos');

const SUPPORTED_LOGOS = new Set([
  'nes.svg', 'snes.svg', 'sfc.svg', 'gb.svg', 'gbc.svg', 'gba.svg',
  'nds.svg', 'n3ds.svg', 'n64.svg', 'gc.svg', 'wii.svg', 'wiiu.svg',
  'psx.svg', 'psp.svg', 'genesis.svg', 'megadrive.svg', 'sega32x.svg',
  'mastersystem.svg', 'gamegear.svg', 'dreamcast.svg', 'atari2600.svg',
  'atari5200.svg', 'atari7800.svg', 'atarilynx.svg', 'pcengine.svg',
  'fds.svg', 'ngp.svg', 'ngpc.svg', 'virtualboy.svg', 'wonderswan.svg',
  'wonderswancolor.svg', 'arcade.svg', 'pokemini.svg',
]);

async function main() {
  const files = await fs.readdir(LOGOS_DIR);
  let removed = 0;
  let kept = 0;

  for (const file of files) {
    const filePath = path.join(LOGOS_DIR, file);
    if (SUPPORTED_LOGOS.has(file)) {
      kept++;
    } else {
      await fs.remove(filePath);
      removed++;
      console.log(`Removed: ${file}`);
    }
  }

  console.log(`\nKept: ${kept} | Removed: ${removed}`);
}

main().catch(console.error);
