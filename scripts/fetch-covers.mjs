import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const CONFIG_PATH = path.join(DATA_DIR, 'config.json');
const CLASSIC_GAMES_PATH = path.join(DATA_DIR, 'classic_games.json');
const COVERS_DIR = path.join(ROOT, 'public', 'covers');
const THUMB_WIDTH = 160;
const THUMB_HEIGHT = 220;
const RATE_LIMIT_MS = 350; // ~3 req/s

let igdbToken = null;

async function getIGDBToken(config) {
  if (igdbToken && Date.now() < igdbToken.expires_at) {
    return igdbToken.access_token;
  }
  const response = await axios.post(
    'https://id.twitch.tv/oauth2/token',
    null,
    {
      params: {
        client_id: config.IGDB_CLIENT_ID,
        client_secret: config.IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
      timeout: 15000,
    }
  );
  igdbToken = {
    access_token: response.data.access_token,
    expires_at: Date.now() + (response.data.expires_in - 60) * 1000,
  };
  return igdbToken.access_token;
}

async function searchIGDBCover(gameName, config) {
  try {
    const token = await getIGDBToken(config);
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `search "${gameName}"; fields cover.url, name; limit 5;`,
      {
        headers: {
          'Client-ID': config.IGDB_CLIENT_ID,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        timeout: 15000,
      }
    );
    if (response.data.length > 0) {
      // Try exact match first, then fallback to first result
      const exact = response.data.find(g =>
        g.name?.toLowerCase() === gameName.toLowerCase()
      );
      const match = exact || response.data[0];
      if (match?.cover?.url) {
        let url = match.cover.url;
        if (url.startsWith('//')) url = 'https:' + url;
        url = url.replace('t_thumb', 't_cover_small');
        return url;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

function getCoverFilename(platform, name, idx) {
  const hash = createHash('md5').update(`${platform}:${name}`).digest('hex').substring(0, 8);
  return `${sanitizeFileName(platform)}-${hash}.webp`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Read config
  let config;
  try {
    config = await fs.readJson(CONFIG_PATH);
  } catch {
    console.error('❌ config.json not found. Run the app first to create it.');
    process.exit(1);
  }

  if (!config.IGDB_CLIENT_ID || !config.IGDB_CLIENT_SECRET) {
    console.error('❌ IGDB credentials not configured in config.json');
    process.exit(1);
  }

  // Read classic_games.json
  let data;
  try {
    data = await fs.readJson(CLASSIC_GAMES_PATH);
  } catch {
    console.error('❌ classic_games.json not found at', CLASSIC_GAMES_PATH);
    process.exit(1);
  }

  await fs.ensureDir(COVERS_DIR);

  const platforms = Object.keys(data.platforms);
  let totalGames = 0;
  let fetchedCount = 0;
  let skippedCount = 0;
  let failCount = 0;

  // Count total games
  for (const platform of platforms) {
    totalGames += data.platforms[platform].classics.length;
  }

  console.log(`📦 Found ${totalGames} games across ${platforms.length} platforms\n`);

  for (const platform of platforms) {
    const platInfo = data.platforms[platform];
    const gameDir = path.join(COVERS_DIR, sanitizeFileName(platform));
    await fs.ensureDir(gameDir);

    for (let i = 0; i < platInfo.classics.length; i++) {
      const game = platInfo.classics[i];
      const filename = getCoverFilename(platform, game.name, i);
      const localPath = path.join(gameDir, filename);
      const relativePath = path.posix.join('covers', sanitizeFileName(platform), filename);
      const progress = `[${++fetchedCount}/${totalGames}]`;

      // Skip if already downloaded
      if (await fs.pathExists(localPath)) {
        console.log(`  ${progress} ⏭️  ${game.name} (already cached)`);
        game.cover = relativePath;
        skippedCount++;
        continue;
      }

      // Fetch cover URL from IGDB
      process.stdout.write(`  ${progress} 🔍 ${game.name}... `);
      const coverUrl = await searchIGDBCover(game.name, config);

      if (!coverUrl) {
        console.log('❌ no cover found');
        failCount++;
        await sleep(RATE_LIMIT_MS);
        continue;
      }

      // Download image
      try {
        const imgResponse = await axios.get(coverUrl, {
          responseType: 'arraybuffer',
          timeout: 30000,
        });
        const buffer = Buffer.from(imgResponse.data);

        // Resize and optimize with sharp
        const webpBuffer = await sharp(buffer)
          .resize(THUMB_WIDTH, THUMB_HEIGHT, {
            fit: 'cover',
            position: 'center',
            withoutEnlargement: true,
          })
          .webp({ quality: 85, effort: 4 })
          .toBuffer();

        await fs.writeFile(localPath, webpBuffer);
        game.cover = relativePath;
        console.log(`✅ saved (${(webpBuffer.length / 1024).toFixed(1)}KB)`);
      } catch (err) {
        console.log(`❌ download/optimize failed: ${err.message}`);
        failCount++;
      }

      await sleep(RATE_LIMIT_MS);
    }
  }

  // Write updated classic_games.json
  await fs.writeJson(CLASSIC_GAMES_PATH, data, { spaces: 2 });
  console.log(`\n📝 Updated classic_games.json with cover paths`);

  // Summary
  const downloaded = fetchedCount - skippedCount - failCount;
  console.log(`\n📊 Summary:`);
  console.log(`   Total games: ${totalGames}`);
  console.log(`   ✅ Downloaded & optimized: ${downloaded}`);
  console.log(`   ⏭️  Already cached: ${skippedCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📁 Covers location: ${COVERS_DIR}`);
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
