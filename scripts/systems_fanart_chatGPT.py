import pyautogui
import pyperclip
import time
import re
from pathlib import Path
import tkinter as tk
from tkinter import filedialog

# =========================================================
# AUTOMAÇÃO DE PROMPTS PARA CHATGPT IMAGES
# =========================================================
#
# COMO USAR:
#
# 1. Instale as dependências:
#
#    pip install pyautogui pyperclip
#
# 2. Execute o script:
#
#    python systems_fanart.py
#
# 3. Uma janela será aberta para selecionar
#    o arquivo TXT contendo os prompts
#
# 4. Abra o ChatGPT Images no navegador
#
# 5. Clique UMA VEZ no campo de prompt
#
# 6. Aguarde a contagem regressiva
#
# IMPORTANTE:
#
# - A posição do mouse é salva apenas no início
# - Você pode mover o mouse depois disso
# - O FAILSAFE foi desativado
# - A janela do ChatGPT NÃO pode ser minimizada
# - O campo de prompt deve permanecer no mesmo lugar
# - Idealmente use dois monitores
#
# OBSERVAÇÃO:
#
# Este script usa automação visual com PyAutoGUI.
# Portanto o navegador precisa continuar aberto
# e visível durante toda a automação.
#
# =========================================================


# ============================================
# CONFIGURAÇÕES
# ============================================

TEMPO_ESPERA = 50

pyautogui.PAUSE = 0.2

# Remove completamente o cancelamento
# ao mover o mouse para o canto
pyautogui.FAILSAFE = False


# ============================================
# SELEÇÃO DE ARQUIVO VIA GUI
# ============================================

def selecionar_arquivo_prompt():

    root = tk.Tk()
    root.withdraw()

    arquivo = filedialog.askopenfilename(
        title="Selecione o arquivo TXT de prompts",
        filetypes=[
            ("Arquivos TXT", "*.txt"),
            ("Todos os arquivos", "*.*")
        ]
    )

    root.destroy()

    if not arquivo:
        raise Exception(
            "Nenhum arquivo foi selecionado."
        )

    return arquivo


# ============================================
# CARREGAR PROMPTS
# ============================================

def carregar_prompts(caminho_arquivo):

    caminho = Path(caminho_arquivo).expanduser().resolve()

    if not caminho.exists():
        raise FileNotFoundError(
            f"Arquivo não encontrado:\n{caminho}"
        )

    conteudo = caminho.read_text(
        encoding="utf-8"
    )

    # Divide pelos blocos === TITULO ===
    blocos = re.split(
        r"===.*?===\s*",
        conteudo
    )

    prompts = []

    for bloco in blocos:

        texto = bloco.strip()

        if texto:
            prompts.append(texto)

    return prompts


# ============================================
# AUTOMAÇÃO
# ============================================

def rodar_automacao():

    print("=" * 70)
    print("AUTOMAÇÃO CHATGPT IMAGES")
    print("=" * 70)

    print("\nSelecione o arquivo TXT de prompts...")

    caminho_prompts = selecionar_arquivo_prompt()

    print(f"\n[OK] Arquivo selecionado:")
    print(caminho_prompts)

    prompts = carregar_prompts(
        caminho_prompts
    )

    print()
    print(f"[OK] {len(prompts)} prompts carregados.")
    print()

    print("INSTRUÇÕES:")
    print("1. Abra o ChatGPT Images")
    print("2. Clique no campo de prompt")
    print("3. NÃO mova o mouse durante a contagem")
    print()

    # Contagem regressiva
    for i in range(10, 0, -1):

        print(f"Iniciando em {i}...")
        time.sleep(1)

    # Captura posição apenas UMA vez
    campo_x, campo_y = pyautogui.position()

    print()
    print(f"[OK] Campo capturado em:")
    print(f"X={campo_x} | Y={campo_y}")
    print()

    # Loop principal
    for index, prompt in enumerate(
        prompts,
        start=1
    ):

        print("=" * 70)
        print(
            f"[{index}/{len(prompts)}] Enviando prompt..."
        )
        print("=" * 70)

        # Retorna foco ao ChatGPT
        pyautogui.click(
            campo_x,
            campo_y
        )

        time.sleep(0.5)

        # Limpa texto anterior
        pyautogui.hotkey(
            "ctrl",
            "a"
        )

        pyautogui.press(
            "backspace"
        )

        time.sleep(0.3)

        # Copia prompt
        pyperclip.copy(prompt)

        time.sleep(0.2)

        # Cola prompt
        pyautogui.hotkey(
            "ctrl",
            "v"
        )

        time.sleep(0.5)

        # Envia prompt
        pyautogui.press(
            "enter"
        )

        print("[OK] Prompt enviado.")
        print(
            f"Aguardando {TEMPO_ESPERA} segundos..."
        )

        # Espera geração
        time.sleep(
            TEMPO_ESPERA
        )

    print()
    print("=" * 70)
    print(
        "[FIM] Todos os prompts foram enviados."
    )
    print("=" * 70)


# ============================================
# MAIN
# ============================================

if __name__ == "__main__":

    try:

        rodar_automacao()

    except KeyboardInterrupt:

        print(
            "\n[AVISO] Script interrompido manualmente."
        )

    except Exception as e:

        print(f"\n[ERRO] {e}")