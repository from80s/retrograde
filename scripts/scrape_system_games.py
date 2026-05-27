"""
Scraper de imagens de jogos por sistema para RetroGrade.

Baixa capas/screenshots de jogos do ScreenScraper.fr e TheGamesDB
para cada sistema suportado.

Uso:
    python scripts/scrape_system_games.py
    python scripts/scrape_system_games.py --system "Super Nintendo"
    python scripts/scrape_system_games.py --system "Mega Drive" --limit 20

Requer:
    pip install requests beautifulsoup4 pillow

APIs usadas (fallback):
    1. TheGamesDB (https://thegamesdb.net) - pública, sem chave necessária
    2. ScreenScraper (https://screenscraper.fr) - requer cadastro gratuito

Configuração:
    Crie um arquivo .env ou edite as variáveis abaixo:
    - SCREENSCRAPER_USERNAME: seu usuário do ScreenScraper
    - SCREENSCRAPER_PASSWORD: sua senha do ScreenScraper
"""

import os
import json
import time
import argparse
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "assets" / "system" / "games"
METADATA_FILE = DATA_DIR / "systems_metadata.json"

THEGAMESDB_BASE = "https://api.thegamesdb.net/v1"

SYSTEM_SLUGS_TGDB = {
    "3DO Interactive Multiplayer": 3004,
    "Amstrad CPC": 3039,
    "Apple II": 3041,
    "Arcade": 3196,
    "Atari 2600": 3005,
    "Atari 5200": 3026,
    "Atari 7800": 3027,
    "Atari Jaguar": 3028,
    "Atari Lynx": 3050,
    "Atari ST": 3043,
    "BBC Micro": 3068,
    "ColecoVision": 3031,
    "Commodore 64": 3040,
    "Commodore Amiga": 3034,
    "Commodore VIC-20": 3044,
    "DOS": 3001,
    "Dreamcast": 3016,
    "Fairchild Channel F": 3086,
    "Game Boy": 3006,
    "Game Boy Advance": 3007,
    "Game Boy Color": 3089,
    "GameCube": 3002,
    "Game Gear": 3019,
    "Intellivision": 3032,
    "MAME": 3196,
    "MSX": 3045,
    "Nintendo 3DS": 3090,
    "Nintendo 64": 3008,
    "Nintendo DS": 3009,
    "Nintendo Entertainment System": 3010,
    "Neo Geo": 3024,
    "Neo Geo Pocket": 3051,
    "PC Engine": 3035,
    "PC-88": 3058,
    "PlayStation 2": 3011,
    "PlayStation 3": 3012,
    "PlayStation Portable": 3013,
    "PlayStation Vita": 3091,
    "Sega 32X": 3030,
    "Sega CD": 3053,
    "Sega Genesis": 3018,
    "Sega Saturn": 3017,
    "Sega SG-1000": 3084,
    "SNES": 3014,
    "Wii": 3003,
    "Wii U": 3083,
    "Xbox 360": 3015,
    "Xbox": 3014,
    "ZX Spectrum": 3042,
}


def load_metadata():
    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def ensure_output_dir():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def slugify(name):
    return name.lower().replace(" ", "_").replace("/", "_").replace("-", "_")


def download_image(url, path):
    if path.exists():
        return True
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "RetroGrade/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            with open(path, "wb") as f:
                f.write(resp.read())
        return True
    except Exception as e:
        print(f"  [ERRO] Falha ao baixar {url}: {e}")
        return False


def scrape_thegamesdb(system_name, limit=10):
    """Busca capas de jogos no TheGamesDB"""
    tgdb_id = SYSTEM_SLUGS_TGDB.get(system_name)
    if not tgdb_id:
        print(f"  [SKIP] TheGamesDB: sistema '{system_name}' sem ID mapeado")
        return []

    system_slug = slugify(system_name)
    sys_dir = OUTPUT_DIR / system_slug
    sys_dir.mkdir(parents=True, exist_ok=True)

    try:
        url = f"{THEGAMESDB_BASE}/Games/ByPlatformID?apikey=1&id={tgdb_id}&page=1"
        req = urllib.request.Request(url, headers={"User-Agent": "RetroGrade/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        games = data.get("data", {}).get("games", [])[:limit]
        downloaded = 0

        for game in games:
            game_id = game.get("id")
            if not game_id:
                continue

            box_url = f"https://cdn.thegamesdb.net/images/original/boxart/front/{game_id}-1.jpg"
            img_path = sys_dir / f"{game_id}_box.jpg"

            if download_image(box_url, img_path):
                downloaded += 1
                print(f"  [OK] {game.get('game_title', 'Desconhecido')}")

            time.sleep(0.5)

        return downloaded

    except Exception as e:
        print(f"  [ERRO] TheGamesDB: {e}")
        return 0


def calculate_stats(system_name):
    """Retorna estatísticas de quantas imagens já foram baixadas"""
    system_slug = slugify(system_name)
    sys_dir = OUTPUT_DIR / system_slug
    if not sys_dir.exists():
        return 0
    return len(list(sys_dir.glob("*.jpg")))


def main():
    parser = argparse.ArgumentParser(description="Scraper de imagens de jogos para RetroGrade")
    parser.add_argument("--system", type=str, help="Nome do sistema (ex: 'Super Nintendo')")
    parser.add_argument("--limit", type=int, default=10, help="Limite de imagens por sistema")
    parser.add_argument("--stats", action="store_true", help="Apenas mostrar estatísticas")
    args = parser.parse_args()

    ensure_output_dir()
    metadata = load_metadata()
    systems = metadata["systems"]

    if args.stats:
        print("=== Estatísticas de Imagens por Sistema ===")
        total = 0
        for sys_info in systems:
            count = calculate_stats(sys_info["name"])
            total += count
            status = f"{count} imagens" if count else "vazio"
            print(f"  {sys_info['name']:<30} {status}")
        print(f"\nTotal: {total} imagens em {len(systems)} sistemas")
        return

    target_systems = [args.system] if args.system else [s["name"] for s in systems]

    print(f"=== Scraper RetroGrade: {len(target_systems)} sistema(s) ===")
    for sys_name in target_systems:
        print(f"\n[{sys_name}]")
        existing = calculate_stats(sys_name)
        print(f"  Já existentes: {existing} imagem(ns)")

        if existing < args.limit:
            needed = args.limit - existing
            print(f"  Buscando até {needed} nova(s)...")
            count = scrape_thegamesdb(sys_name, needed)
            print(f"  Baixadas: {count} nova(s)")
        else:
            print(f"  Sufficiente ({existing} >= {args.limit})")


if __name__ == "__main__":
    main()
