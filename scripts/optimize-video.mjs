import ffmpeg from 'ffmpeg-static';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const input = path.join(__dirname, '..', 'assets', 'videos', 'RetroGrade_intro.mp4');
const output = path.join(__dirname, '..', 'assets', 'videos', 'RetroGrade_intro_optimized.mp4');

const origSize = fs.statSync(input).size;
console.log('Original:', (origSize / 1024 / 1024).toFixed(1) + 'MB');

const cmd = `"${ffmpeg}" -i "${input}" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "${output}"`;
console.log('Running ffmpeg...');

try {
  execSync(cmd, { stdio: 'inherit' });
  const optSize = fs.statSync(output).size;
  console.log('Optimized:', (optSize / 1024 / 1024).toFixed(1) + 'MB');
  console.log('Reduction:', Math.round((1 - optSize / origSize) * 100) + '%');
} catch (e) {
  console.error('Error:', e.message);
}
