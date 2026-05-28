import json
import os
import urllib.request
import urllib.parse
import re
import sys
import time

import tkinter as tk
from tkinter import filedialog

HISTORICAL_DB = {
    "Sega 32X": {"manufacturer": "Sega", "year": 1994, "origin": "Japão", "type": "Video game console add-on", "generation": "5ª Geração"},
    "Nintendo 3DS": {"manufacturer": "Nintendo", "year": 2011, "origin": "Japão", "type": "handheld", "generation": "8ª Geração"},
    "Arcade/MAME": {"manufacturer": "Vários", "year": 1971, "origin": "Vários", "type": "arcade"},
    "Atari 2600": {"manufacturer": "Atari", "year": 1977, "origin": "Estados Unidos", "type": "console", "generation": "2ª Geração"},
    "Atari 5200": {"manufacturer": "Atari", "year": 1982, "origin": "Estados Unidos", "type": "console", "generation": "2ª Geração"},
    "Atari 7800": {"manufacturer": "Atari", "year": 1986, "origin": "Estados Unidos", "type": "console", "generation": "3ª Geração"},
    "Atari Jaguar": {"manufacturer": "Atari", "year": 1993, "origin": "Estados Unidos", "type": "console", "generation": "5ª Geração"},
    "Amiga": {"manufacturer": "Commodore", "year": 1985, "origin": "Estados Unidos", "type": "Home computer", "generation": "16/32-bit Computer"},
    "Atari 800": {"manufacturer": "Atari", "year": 1979, "origin": "Estados Unidos", "type": "Home computer", "generation": "8-bit Computer"},
    "Sony PlayStation": {"manufacturer": "Sony", "year": 1994, "origin": "Japão", "type": "console", "generation": "5ª Geração"},
    "SNES": {"manufacturer": "Nintendo", "year": 1990, "origin": "Japão", "type": "console", "generation": "4ª Geração"},
    "Super Famicom": {"manufacturer": "Nintendo", "year": 1990, "origin": "Japão", "type": "console", "generation": "4ª Geração"},
    "Amstrad CPC": {"manufacturer": "Amstrad", "year": 1984, "origin": "Reino Unido", "type": "Home computer", "generation": "8-bit Computer"},
    "Dreamcast": {"manufacturer": "Sega", "year": 1998, "origin": "Japão", "type": "console", "generation": "6ª Geração"},
    "Fairchild Channel F": {"manufacturer": "Fairchild", "year": 1976, "origin": "Estados Unidos", "type": "console", "generation": "2ª Geração"},
    "GameCube": {"manufacturer": "Nintendo", "year": 2001, "origin": "Japão", "type": "console", "generation": "6ª Geração"},
    "ColecoVision": {"manufacturer": "Coleco", "year": 1982, "origin": "Estados Unidos", "type": "console", "generation": "2ª Geração"},
    "DOS": {"manufacturer": "Microsoft", "year": 1981, "origin": "Estados Unidos", "type": "Personal computer", "generation": "Personal Computer"},
    "Commodore 64": {"manufacturer": "Commodore", "year": 1982, "origin": "Estados Unidos", "type": "Home computer", "generation": "8-bit Computer"},
    "Sony PSP": {"manufacturer": "Sony", "year": 2004, "origin": "Japão", "type": "handheld", "generation": "7ª Geração"},
    "PC-88": {"manufacturer": "NEC", "year": 1981, "origin": "Japão", "type": "computer", "generation": "8-bit Computer"},
    "PC-98": {"manufacturer": "NEC", "year": 1982, "origin": "Japão", "type": "computer", "generation": "16-bit Computer"},
    "Daphne": {"manufacturer": "Vários", "year": 1983, "origin": "Estados Unidos", "type": "Software", "generation": "Software Platform"},
    "Apple II": {"manufacturer": "Apple", "year": 1977, "origin": "Estados Unidos", "type": "Home computer", "generation": "8-bit Computer"},
    "Apple IIGS": {"manufacturer": "Apple", "year": 1986, "origin": "Estados Unidos", "type": "Home computer", "generation": "16-bit Computer"},
    "Doom": {"manufacturer": "id Software", "year": 1993, "origin": "Estados Unidos", "type": "Software", "generation": "Software Platform"},
    "Nintendo DS": {"manufacturer": "Nintendo", "year": 2004, "origin": "Japão", "type": "handheld", "generation": "7ª Geração"},
    "Sharp X1": {"manufacturer": "Sharp Corporation", "year": 1982, "origin": "Japão", "type": "computer", "generation": "8-bit Computer"},
    "Famicom Disk System": {"manufacturer": "Nintendo", "year": 1986, "origin": "Japão", "type": "console add-on", "generation": "3ª Geração"},
    "Vectrex": {"manufacturer": "General Consumer Electronics", "year": 1982, "origin": "Estados Unidos", "type": "console", "generation": "2ª Geração"},
    "Game Boy": {"manufacturer": "Nintendo", "year": 1989, "origin": "Japão", "type": "handheld", "generation": "3ª Geração"},
    "Game Boy Advance": {"manufacturer": "Nintendo", "year": 2001, "origin": "Japão", "type": "handheld", "generation": "6ª Geração"},
    "Game Boy Color": {"manufacturer": "Nintendo", "year": 1998, "origin": "Japão", "type": "handheld", "generation": "5ª Geração"},
    "Sega Genesis": {"manufacturer": "Sega", "year": 1988, "origin": "Japão", "type": "console", "generation": "4ª Geração"},
    "Mega Drive": {"manufacturer": "Sega", "year": 1988, "origin": "Japão", "type": "console", "generation": "4ª Geração"},
    "Game Gear": {"manufacturer": "Sega", "year": 1990, "origin": "Japão", "type": "handheld", "generation": "4ª Geração"},
    "PlayStation 2": {"manufacturer": "Sony", "year": 2000, "origin": "Japão", "type": "console", "generation": "6ª Geração"},
    "Game & Watch": {"manufacturer": "Nintendo", "year": 1980, "origin": "Japão", "type": "handheld", "generation": "2ª Geração"},
    "Pokémon Mini": {"manufacturer": "Nintendo", "year": 2001, "origin": "Japão", "type": "handheld", "generation": "5ª Geração"},
    "Atari ST": {"manufacturer": "Atari", "year": 1985, "origin": "Estados Unidos", "type": "Home computer", "generation": "16-bit Computer"},
    "MSX": {"manufacturer": "Microsoft / ASCII", "year": 1983, "origin": "Japão", "type": "Home computer", "generation": "8-bit Computer"},
    "MSX2": {"manufacturer": "MSX Licensing Corporation", "year": 1985, "origin": "Japão", "type": "Home computer", "generation": "8-bit Computer"},
    "Nintendo 64": {"manufacturer": "Nintendo", "year": 1996, "origin": "Japão", "type": "console", "generation": "5ª Geração"},
    "Nintendo Switch": {"manufacturer": "Nintendo", "year": 2017, "origin": "Japão", "type": "hybrid", "generation": "8ª Geração"},
    "Neo Geo": {"manufacturer": "SNK", "year": 1990, "origin": "Japão", "type": "console", "generation": "4ª Geração"},
    "NES": {"manufacturer": "Nintendo", "year": 1983, "origin": "Japão", "type": "console", "generation": "3ª Geração"},
    "Neo Geo Pocket Color": {"manufacturer": "SNK", "year": 1999, "origin": "Japão", "type": "handheld", "generation": "5ª Geração"},
    "Neo Geo Pocket": {"manufacturer": "SNK", "year": 1998, "origin": "Japão", "type": "handheld", "generation": "5ª Geração"},
    "LowRes NX": {"manufacturer": "Inconcreto (Retro-style)", "year": 2017, "origin": "Vários", "type": "Fantasy Console", "generation": "Fantasy Console"},
    "Sinclair ZX81": {"manufacturer": "Sinclair Research", "year": 1981, "origin": "Reino Unido", "type": "Home computer", "generation": "8-bit Computer"},
    "PICO-8": {"manufacturer": "Lexaloffle Games", "year": 2015, "origin": "Nova Zelândia", "type": "Fantasy Console", "generation": "Fantasy Console"},
    "PC Engine": {"manufacturer": "NEC / Hudson Soft", "year": 1987, "origin": "Japão", "type": "console", "generation": "4ª Geração"},
    "PlayStation 3": {"manufacturer": "Sony", "year": 2006, "origin": "Japão", "type": "console", "generation": "7ª Geração"},
    "Wii U": {"manufacturer": "Nintendo", "year": 2012, "origin": "Japão", "type": "console", "generation": "8ª Geração"},
    "Sega Saturn": {"manufacturer": "Sega", "year": 1994, "origin": "Japão", "type": "console", "generation": "5ª Geração"},
    "Sinclair ZX Spectrum": {"manufacturer": "Sinclair Research", "year": 1982, "origin": "Reino Unido", "type": "Home computer", "generation": "8-bit Computer"},
    "Sega SG-1000": {"manufacturer": "Sega", "year": 1983, "origin": "Japão", "type": "console", "generation": "2ª Geração"},
    "Master System": {"manufacturer": "Sega", "year": 1985, "origin": "Japão", "type": "console", "generation": "3ª Geração"},
    "BBC Micro": {"manufacturer": "Acorn Computers", "year": 1981, "origin": "Reino Unido", "type": "Home computer", "generation": "8-bit Computer"},
    "ScummVM": {"manufacturer": "Vários", "year": 2001, "origin": "Digital", "type": "Software", "generation": "Software Platform"},
    "Watara Supervision": {"manufacturer": "Watara", "year": 1992, "origin": "Hong Kong", "type": "handheld", "generation": "4ª Geração"},
    "TIC-80": {"manufacturer": "Nesbox", "year": 2017, "origin": "Digital", "type": "Fantasy Console", "generation": "Fantasy Console"},
    "PC-FX": {"manufacturer": "NEC", "year": 1994, "origin": "Japão", "type": "console", "generation": "5ª Geração"},
    "Virtual Boy": {"manufacturer": "Nintendo", "year": 1995, "origin": "Japão", "type": "console", "generation": "5ª Geração"},
    "PlayStation Vita": {"manufacturer": "Sony", "year": 2011, "origin": "Japão", "type": "handheld", "generation": "8ª Geração"},
    "WASM-4": {"manufacturer": "Bruno Garcia", "year": 2021, "origin": "Digital", "type": "Fantasy Console", "generation": "Fantasy Console"},
    "Wii": {"manufacturer": "Nintendo", "year": 2006, "origin": "Japão", "type": "console", "generation": "7ª Geração"},
    "WonderSwan": {"manufacturer": "Bandai", "year": 1999, "origin": "Japão", "type": "handheld", "generation": "5ª Geração"},
    "WonderSwan Color": {"manufacturer": "Bandai", "year": 2000, "origin": "Japão", "type": "handheld", "generation": "5ª Geração"},
    "Xbox 360": {"manufacturer": "Microsoft", "year": 2005, "origin": "Estados Unidos", "type": "console", "generation": "7ª Geração"},
    "Xbox": {"manufacturer": "Microsoft", "year": 2001, "origin": "Estados Unidos", "type": "console", "generation": "6ª Geração"},
    "Sega NAOMI": {"manufacturer": "Sega", "year": 1998, "origin": "Japão", "type": "Arcade", "generation": "Arcade"},
    "Atari Lynx": {"manufacturer": "Atari", "year": 1989, "origin": "Estados Unidos", "type": "handheld", "generation": "3ª Geração"},
    "3DO Interactive Multiplayer": {"manufacturer": "The 3DO Company", "year": 1993, "origin": "Estados Unidos", "type": "console", "generation": "5ª Geração"},
    "Coleco Adam": {"manufacturer": "Coleco", "year": 1983, "origin": "Estados Unidos", "type": "Home computer", "generation": "8-bit Computer"},
    "Amiga CD32": {"manufacturer": "Commodore", "year": 1993, "origin": "Estados Unidos", "type": "console", "generation": "5ª Geração"},
    "Commodore VIC-20": {"manufacturer": "Commodore", "year": 1980, "origin": "Estados Unidos", "type": "Home computer", "generation": "8-bit Computer"},
    "MAME": {"manufacturer": "Nicola Salmoria", "year": 1997, "origin": "Digital", "type": "Software", "generation": "Software Platform"},
    "Neo Geo CD": {"manufacturer": "SNK", "year": 1994, "origin": "Japão", "type": "console", "generation": "4ª Geração"},
    "TurboGrafx-CD": {"manufacturer": "NEC / Hudson Soft", "year": 1988, "origin": "Japão", "type": "console add-on", "generation": "4ª Geração"},
    "Sega CD": {"manufacturer": "Sega", "year": 1991, "origin": "Japão", "type": "console add-on", "generation": "4ª Geração"},
    "Sharp X68000": {"manufacturer": "Sharp", "year": 1987, "origin": "Japão", "type": "computer", "generation": "16-bit Computer"},
    "SuperGrafx": {"manufacturer": "NEC / Hudson Soft", "year": 1989, "origin": "Japão", "type": "console", "generation": "4ª Geração"},
    "SuFami Turbo": {"manufacturer": "Bandai", "year": 1996, "origin": "Japão", "type": "console add-on", "generation": "4ª Geração"},
    "Intellivision": {"manufacturer": "Mattel", "year": 1979, "origin": "Estados Unidos", "type": "console", "generation": "2ª Geração"},
    "Atari Jaguar CD": {"manufacturer": "Atari", "year": 1995, "origin": "Estados Unidos", "type": "console add-on", "generation": "5ª Geração"},
    "PC-88/PC-98": {"manufacturer": "NEC", "year": 1981, "origin": "Japão", "type": "computer", "generation": "8-bit Computer"},
    "Sony PlayStation/Dreamcast": {"manufacturer": "Sony / Sega", "year": 1994, "origin": "Japão", "type": "console"},
    "GameCube/Wii": {"manufacturer": "Nintendo", "year": 2001, "origin": "Japão", "type": "console"},
    "Sony PlayStation 2": {"manufacturer": "Sony", "year": 2000, "origin": "Japão", "type": "console", "generation": "6ª Geração"},
}

def select_paths_interactively():
    """Abre caixas de diálogo nativas para selecionar os arquivos de entrada e saída."""
    # Inicializa o Tkinter ocultando a janela principal cinza vazia
    root = tk.Tk()
    root.withdraw()
    root.attributes("-topmost", True) # Traz a janela para a frente de outras aplicações

    print("Aguardando seleção do arquivo de entrada...")
    # 1. Seleciona o arquivo JSON original
    input_path = filedialog.askopenfilename(
        title="SELECIONE O ARQUIVO JSON DE ENTRADA (Ex: systems.json)",
        filetypes=[("Arquivos JSON", "*.json"), ("Todos os arquivos", "*.*")]
    )
    
    if not input_path:
        print("\n[CANCELADO] Seleção do arquivo de entrada foi cancelada pelo usuário.")
        return None, None

    print(f"Arquivo de entrada selecionado: {input_path}")

    # 2. Seleciona a pasta e define o nome do arquivo de saída de metadados
    print("\nAguardando seleção do local de salvamento da saída...")
    output_path = filedialog.asksaveasfilename(
        title="ESCOLHA O LOCAL E NOME PARA SALVAR O METADADOS DE SAÍDA",
        initialfile="systems_metadata.json",
        defaultextension=".json",
        filetypes=[("Arquivos JSON", "*.json")]
    )

    if not output_path:
        print("\n[CANCELADO] Seleção do arquivo de saída foi cancelada pelo usuário.")
        return None, None

    print(f"Arquivo de saída configurado: {output_path}\n")
    return input_path, output_path

def draw_progress_bar(current, total, system_name="", status_msg="Processando"):
    bar_length = 30
    fraction = current / total if total > 0 else 0
    filled_length = int(round(bar_length * fraction))
    
    bar = '█' * filled_length + '-' * (bar_length - filled_length)
    percent = fraction * 100
    
    max_name_len = 25
    truncated_name = system_name if len(system_name) <= max_name_len else system_name[:max_name_len-3] + "..."
    
    sys.stdout.write(f"\r[{bar}] {percent:.1f}% | {status_msg}: {truncated_name:<25}\033[K")
    sys.stdout.flush()

def get_wikipedia_desc(system_name):
    search_term = system_name
    if "Arcade" in system_name or "MAME" in system_name:
        search_term = "Jogo de arcade"
    elif "Doom" in system_name:
        search_term = "Doom (franquia)"
    elif "PC Engine" in system_name:
        search_term = "TurboGrafx-16"
    elif "Apple II" in system_name:
        search_term = "Apple II"
    elif "DOS" in system_name:
        search_term = "MS-DOS"

    url = f"https://pt.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&redirects=1&format=json&titles={urllib.parse.quote(search_term)}"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'SystemMetadataBot/1.0'})
        with urllib.request.urlopen(req, timeout=4) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            pages = res_data.get("query", {}).get("pages", {})
            for _, p_info in pages.items():
                if "extract" in p_info and p_info["extract"].strip():
                    text = p_info["extract"].strip()
                    sentences = re.split(r'(?<=[.!?])\s+', text)
                    return " ".join(sentences[:3]), None
    except Exception as e:
        return None, str(e)
    return None, "Artigo não encontrado ou sem introdução limpa."

def build_metadata():
    # Chama o seletor interativo de arquivos
    input_json_path, output_json_path = select_paths_interactively()
    
    if not input_json_path or not output_json_path:
        print("[ERRO] Operação abortada porque os caminhos não foram definidos.")
        return

    if not os.path.exists(input_json_path):
        print(f"\n[ERRO] O arquivo de origem não foi localizado em: '{input_json_path}'")
        return

    with open(input_json_path, "r", encoding="utf-8") as file:
        raw_data = json.load(file)

    unique_targets = {}
    for ext, system_info in raw_data.items():
        original_name = system_info.get("name", "Desconhecido")
        tgdb_id = system_info.get("tgdb")
        igdb_id = system_info.get("igdb")

        unified_name = original_name
        if original_name == "Super Famicom": unified_name = "SNES"
        if original_name == "Mega Drive": unified_name = "Sega Genesis"
        if "/" in original_name: 
            unified_name = original_name.split('/')[0].strip()

        system_id = unified_name.lower().replace(" ", "_").replace("-", "_")
        
        if system_id not in unique_targets:
            unique_targets[system_id] = {
                "name": unified_name,
                "original_name": original_name,
                "tgdb": tgdb_id,
                "igdb": igdb_id,
                "extensions": []
            }
        if ext not in unique_targets[system_id]["extensions"]:
            unique_targets[system_id]["extensions"].append(ext)

    grouped_systems = {}
    total_systems = len(unique_targets)
    current_index = 0
    errors_log = []

    print(f"Total de sistemas únicos identificados para processar: {total_systems}\n")
    
    for sys_id, target in unique_targets.items():
        current_index += 1
        unified_name = target["name"]
        
        draw_progress_bar(current_index - 1, total_systems, unified_name, "Buscando")

        meta_defaults = HISTORICAL_DB.get(target["original_name"], HISTORICAL_DB.get(unified_name, {}))
        manufacturer = meta_defaults.get("manufacturer", "Vários" if "Arcade" in unified_name else "Desconhecido")
        release_year = meta_defaults.get("year", 0)
        origin_country = meta_defaults.get("origin", "Desconhecido")

        wiki_description, error_msg = get_wikipedia_desc(unified_name)
        
        if error_msg:
            errors_log.append({"sistema": unified_name, "erro": error_msg})
        
        if not wiki_description:
            wiki_description = f"O {unified_name} é uma plataforma de hardware ou ecossistema de software voltado à execução de jogos eletrônicos, amplamente preservada por meio da emulação."

        entry = {
            "id": sys_id,
            "tgdb_id": target["tgdb"],
            "igdb_id": target["igdb"],
            "name": unified_name,
            "manufacturer": manufacturer,
            "release_year": release_year,
            "origin_country": origin_country,
            "description": wiki_description,
            "curiosities": [],
            "supported_extensions": target["extensions"],
            "emulators": [],
        }

        if meta_defaults.get("type"):
            entry["type"] = meta_defaults["type"]
        if meta_defaults.get("generation"):
            entry["generation"] = meta_defaults["generation"]

        grouped_systems[sys_id] = entry

        time.sleep(0.04)
        draw_progress_bar(current_index, total_systems, unified_name, "Concluído")

    print("\n")

    output_data = {"systems": list(grouped_systems.values())}
    with open(output_json_path, "w", encoding="utf-8") as out_file:
        json.dump(output_data, out_file, ensure_ascii=False, indent=2)

    if errors_log:
        print("================ RELATÓRIO DE ALERTAS/ERROS ================")
        print(f"Houve pendências ou falhas de scraping em {len(errors_log)} sistemas (dados locais de fallback foram aplicados):")
        for item in errors_log:
            print(f" -> [{item['sistema']}]: {item['erro']}")
        print("============================================================\n")

    print("=======================================================")
    print("Processamento finalizado com sucesso!")
    print(f"Total de sistemas únicos salvos: {len(output_data['systems'])}")
    print(f"Arquivo gerado em: '{output_json_path}'")
    print("=======================================================")

if __name__ == "__main__":
    build_metadata()