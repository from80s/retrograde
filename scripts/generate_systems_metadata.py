import json
import os
import urllib.request
import urllib.parse
import re
import sys
import time

# Importações nativas para a interface gráfica de seleção de arquivos
import tkinter as tk
from tkinter import filedialog

# Dicionário de fallback histórico (mantido para garantir a precisão dos dados)
HISTORICAL_DB = {
    "Sega 32X": {"manufacturer": "Sega", "year": 1994, "origin": "Japão"},
    "Nintendo 3DS": {"manufacturer": "Nintendo", "year": 2011, "origin": "Japão"},
    "Arcade/MAME": {"manufacturer": "Vários", "year": 1970, "origin": "Vários"},
    "Atari 2600": {"manufacturer": "Atari", "year": 1977, "origin": "Estados Unidos"},
    "Atari 5200": {"manufacturer": "Atari", "year": 1982, "origin": "Estados Unidos"},
    "Atari 7800": {"manufacturer": "Atari", "year": 1986, "origin": "Estados Unidos"},
    "Atari Jaguar": {"manufacturer": "Atari", "year": 1993, "origin": "Estados Unidos"},
    "Amiga": {"manufacturer": "Commodore", "year": 1985, "origin": "Estados Unidos"},
    "Atari 800": {"manufacturer": "Atari", "year": 1979, "origin": "Estados Unidos"},
    "Sony PlayStation": {"manufacturer": "Sony", "year": 1994, "origin": "Japão"},
    "SNES": {"manufacturer": "Nintendo", "year": 1990, "origin": "Japão"},
    "Super Famicom": {"manufacturer": "Nintendo", "year": 1990, "origin": "Japão"},
    "Amstrad CPC": {"manufacturer": "Amstrad", "year": 1984, "origin": "Reino Unido"},
    "Dreamcast": {"manufacturer": "Sega", "year": 1998, "origin": "Japão"},
    "Sony PlayStation/Dreamcast": {"manufacturer": "Sony / Sega", "year": 1994, "origin": "Japão"},
    "Fairchild Channel F": {"manufacturer": "Fairchild", "year": 1976, "origin": "Estados Unidos"},
    "GameCube": {"manufacturer": "Nintendo", "year": 2001, "origin": "Japão"},
    "GameCube/Wii": {"manufacturer": "Nintendo", "year": 2001, "origin": "Japão"},
    "ColecoVision": {"manufacturer": "Coleco", "year": 1982, "origin": "Estados Unidos"},
    "DOS": {"manufacturer": "Microsoft", "year": 1981, "origin": "Estados Unidos"},
    "Commodore 64": {"manufacturer": "Commodore", "year": 1982, "origin": "Estados Unidos"},
    "Sony PSP": {"manufacturer": "Sony", "year": 2004, "origin": "Japão"},
    "PC-88/PC-98": {"manufacturer": "NEC", "year": 1981, "origin": "Japão"},
    "PC-88": {"manufacturer": "NEC", "year": 1981, "origin": "Japão"},
    "PC-98": {"manufacturer": "NEC", "year": 1982, "origin": "Japão"},
    "Daphne": {"manufacturer": "Vários", "year": 1983, "origin": "Estados Unidos"},
    "Apple II": {"manufacturer": "Apple", "year": 1977, "origin": "Estados Unidos"},
    "Apple IIGS": {"manufacturer": "Apple", "year": 1986, "origin": "Estados Unidos"},
    "Doom": {"manufacturer": "id Software", "year": 1993, "origin": "Estados Unidos"},
    "Nintendo DS": {"manufacturer": "Nintendo", "year": 2004, "origin": "Japão"},
    "Sharp X1": {"manufacturer": "Sharp Corporation", "year": 1982, "origin": "Japão"},
    "Famicom Disk System": {"manufacturer": "Nintendo", "year": 1986, "origin": "Japão"},
    "Vectrex": {"manufacturer": "General Consumer Electronics", "year": 1982, "origin": "Estados Unidos"},
    "Game Boy": {"manufacturer": "Nintendo", "year": 1989, "origin": "Japão"},
    "Game Boy Advance": {"manufacturer": "Nintendo", "year": 2001, "origin": "Japão"},
    "Game Boy Color": {"manufacturer": "Nintendo", "year": 1998, "origin": "Japão"},
    "Sega Genesis": {"manufacturer": "Sega", "year": 1988, "origin": "Japão"},
    "Mega Drive": {"manufacturer": "Sega", "year": 1988, "origin": "Japão"},
    "Game Gear": {"manufacturer": "Sega", "year": 1990, "origin": "Japão"},
    "PlayStation 2": {"manufacturer": "Sony", "year": 2000, "origin": "Japão"},
    "Sony PlayStation 2": {"manufacturer": "Sony", "year": 2000, "origin": "Japão"},
    "Game & Watch": {"manufacturer": "Nintendo", "year": 1980, "origin": "Japão"},
    "Pokémon Mini": {"manufacturer": "Nintendo", "year": 2001, "origin": "Japão"},
    "Atari ST": {"manufacturer": "Atari", "year": 1985, "origin": "Estados Unidos"},
    "MSX": {"manufacturer": "Microsoft / ASCII", "year": 1983, "origin": "Japão"},
    "MSX2": {"manufacturer": "MSX Licensing Corporation", "year": 1985, "origin": "Japão"},
    "Nintendo 64": {"manufacturer": "Nintendo", "year": 1996, "origin": "Japão"},
    "Nintendo Switch": {"manufacturer": "Nintendo", "year": 2017, "origin": "Japão"},
    "Neo Geo": {"manufacturer": "SNK", "year": 1990, "origin": "Japão"},
    "NES": {"manufacturer": "Nintendo", "year": 1983, "origin": "Japão"},
    "Neo Geo Pocket Color": {"manufacturer": "SNK", "year": 1999, "origin": "Japão"},
    "Neo Geo Pocket": {"manufacturer": "SNK", "year": 1998, "origin": "Japão"},
    "LowRes NX": {"manufacturer": "Inconcreto (Retro-style)", "year": 2017, "origin": "Vários"},
    "Sinclair ZX81": {"manufacturer": "Sinclair Research", "year": 1981, "origin": "Reino Unido"},
    "PICO-8": {"manufacturer": "Lexaloffle Games", "year": 2015, "origin": "Nova Zelândia"},
    "PC Engine": {"manufacturer": "NEC / Hudson Soft", "year": 1987, "origin": "Japão"},
    "PlayStation 3": {"manufacturer": "Sony", "year": 2006, "origin": "Japão"},
    "Wii U": {"manufacturer": "Nintendo", "year": 2012, "origin": "Japão"},
    "Sega Saturn": {"manufacturer": "Sega", "year": 1994, "origin": "Japão"},
    "Sinclair ZX Spectrum": {"manufacturer": "Sinclair Research", "year": 1982, "origin": "Reino Unido"},
    "Sega SG-1000": {"manufacturer": "Sega", "year": 1983, "origin": "Japão"},
    "Master System": {"manufacturer": "Sega", "year": 1985, "origin": "Japão"},
    "BBC Micro": {"manufacturer": "Acorn Computers", "year": 1981, "origin": "Reino Unido"},
    "ScummVM": {"manufacturer": "Vários", "year": 2001, "origin": "Digital"},
    "Watara Supervision": {"manufacturer": "Watara", "year": 1992, "origin": "Hong Kong"},
    "TIC-80": {"manufacturer": "Nesbox", "year": 2017, "origin": "Digital"},
    "PC-FX": {"manufacturer": "NEC", "year": 1994, "origin": "Japão"},
    "Virtual Boy": {"manufacturer": "Nintendo", "year": 1995, "origin": "Japão"},
    "PlayStation Vita": {"manufacturer": "Sony", "year": 2011, "origin": "Japão"},
    "WASM-4": {"manufacturer": "Bruno Garcia", "year": 2021, "origin": "Digital"},
    "Wii": {"manufacturer": "Nintendo", "year": 2006, "origin": "Japão"},
    "WonderSwan": {"manufacturer": "Bandai", "year": 1999, "origin": "Japão"},
    "WonderSwan Color": {"manufacturer": "Bandai", "year": 2000, "origin": "Japão"},
    "Xbox 360": {"manufacturer": "Microsoft", "year": 2005, "origin": "Estados Unidos"},
    "Xbox": {"manufacturer": "Microsoft", "year": 2001, "origin": "Estados Unidos"},
    "Sega NAOMI": {"manufacturer": "Sega", "year": 1998, "origin": "Japão"},
    "Atari Lynx": {"manufacturer": "Atari", "year": 1989, "origin": "Estados Unidos"}
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

        grouped_systems[sys_id] = {
            "id": sys_id,
            "tgdb_id": target["tgdb"],
            "igdb_id": target["igdb"],
            "name": unified_name,
            "manufacturer": manufacturer,
            "release_year": release_year,
            "origin_country": origin_country,
            "description": wiki_description,
            "curiosities": [
                f"Suporta nativamente a execução de arquivos com a extensão '{target['extensions'][0]}' na arquitetura de emulação."
            ],
            "supported_extensions": target["extensions"]
        }

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