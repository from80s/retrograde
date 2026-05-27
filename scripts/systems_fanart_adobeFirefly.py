import pyautogui
import pyperclip
import time
import re
import os
from pathlib import Path
import tkinter as tk
from tkinter import filedialog

# ==============================================================================
# AUTOMAÇÃO DE PROMPTS PARA ADOBE FIREFLY
# ==============================================================================
#
# REQUISITOS DE INSTALAÇÃO:
# Abra o seu terminal (ou prompt de comando) e instale as dependências abaixo:
#
#     pip install pyautogui pyperclip opencv-python pillow
#
# O 'opencv-python' é obrigatório para que o script consiga reconhecer visualmente
# o botão na tela.
#
# ------------------------------------------------------------------------------
# COMO USAR:
#
# 1. Prepare o terreno: Abra o Adobe Firefly no seu navegador e deixe a janela 
#    visível (de preferência em tela cheia). Deixe o botão de gerar ativo.
#
# 2. Execute o script no terminal:
#    python scripts\systems_fanart_adobeFirefly.py
#
# 3. Selecione o arquivo TXT contendo seus prompts na janela que vai abrir.
#
# 4. FASE 1 - CAPTURA DO CAMPO DE PROMPT:
#    O terminal iniciará uma contagem de 10 segundos. Durante esse tempo, 
#    coloque o ponteiro do mouse EXATAMENTE em cima do campo onde você digita 
#    os prompts no Firefly e NÃO MOVA O MOUSE até a contagem terminar.
#
# 5. FASE 2 - CAPTURA DO BOTÃO ENVIAR (GERAR):
#    Em seguida, o terminal avisará e iniciará outra contagem de 7 segundos.
#    Mova o mouse e posicione o ponteiro EXATAMENTE em cima do botão de Enviar/Gerar
#    (que deve estar ativo) e NÃO MOVA O MOUSE até a contagem terminar.
#
# 6. Pronto! A automação vai começar a colar os prompts, clicar no botão e 
#    esperar o Firefly terminar cada geração de forma 100% dinâmica.
#
# SEGURANÇA (FAILSAFE):
# Se o script falhar ou você precisar parar urgentemente, mova o mouse com força
# para o CANTO SUPERIOR ESQUERDO da sua tela. Isso interromperá a execução na hora.
# ==============================================================================

# Configurações globais do PyAutoGUI
pyautogui.PAUSE = 0.2
pyautogui.FAILSAFE = True  # Permite cancelar arrastando o mouse para o canto superior esquerdo

NOME_IMAGEM_TEMP = "firefly_btn_ready.png"

def selecionar_arquivo_prompt():
    root = tk.Tk()
    root.withdraw()
    arquivo = filedialog.askopenfilename(
        title="Selecione o arquivo TXT de prompts",
        filetypes=[("Arquivos TXT", "*.txt"), ("Todos os arquivos", "*.*")]
    )
    root.destroy()
    if not arquivo:
        raise Exception("Nenhum arquivo de prompts foi selecionado.")
    return arquivo

def carregar_prompts(caminho_arquivo):
    caminho = Path(caminho_arquivo).expanduser().resolve()
    if not caminho.exists():
        raise FileNotFoundError(f"Arquivo não encontrado:\n{caminho}")
    conteudo = caminho.read_text(encoding="utf-8")
    blocos = re.split(r"===.*?===\s*", conteudo)
    
    # Versão CORRIGIDA: Filtra linhas em branco e limpa os espaços
    return [bloco.strip() for bloco in blocos if bloco.strip()]

def aguardar_botao_liberar(botao_x, botao_y):
    """Monitora a região do botão até que ele volte a ficar idêntico ao estado ativo."""
    print("[INFO] Aguardando a conclusão da geração (esperando o botão ativar)...")
    
    # Define um quadrado de 60x60 pixels ao redor das coordenadas do botão
    regiao = (botao_x - 30, botao_y - 30, 60, 60)
    
    while True:
        try:
            # Procura a imagem do botão ativo apenas na região mapeada
            posicao = pyautogui.locateOnScreen(NOME_IMAGEM_TEMP, region=regiao, confidence=0.9)
            if posicao is not None:
                print("[OK] Botão Liberado! Avançando para o próximo prompt.")
                break
        except (pyautogui.ImageNotFoundException, Exception):
            # Se não encontrou (botão ainda desativado/carregando), aguarda um pouco e repete
            time.sleep(1.5)

def rodar_automacao():
    print("=" * 70)
    print("AUTOMAÇÃO ADOBE FIREFLY DINÂMICA")
    print("=" * 70)

    caminho_prompts = selecionar_arquivo_prompt()
    prompts = carregar_prompts(caminho_prompts)

    print(f"\n[OK] {len(prompts)} prompts carregados com sucesso.")
    print("\n" + "-" * 70)
    print("FASE 1: MAPEANDO O CAMPO DE TEXTO (PROMPT)")
    print("-" * 70)
    print("👉 COLOQUE O MOUSE EM CIMA DO CAMPO DE TEXTO DO FIREFLY AGORA!")
    print("Mantenha o mouse parado ali...")
    print("-" * 70)
    
    for i in range(10, 0, -1):
        print(f"Capturando posição do campo em {i}...")
        time.sleep(1)
        
    campo_x, campo_y = pyautogui.position()
    print(f"\n[OK] Campo de texto mapeado em: X={campo_x} | Y={campo_y}\n")

    print("-" * 70)
    print("FASE 2: MAPEANDO O BOTÃO DE ENVIAR (GERAR)")
    print("-" * 70)
    print("👉 MOVA O MOUSE E POSICIONE EM CIMA DO BOTÃO DE ENVIAR (GERAR) ATIVO!")
    print("Mantenha o mouse parado ali...")
    print("-" * 70)
    
    for i in range(7, 0, -1):
        print(f"Capturando posição do botão em {i}...")
        time.sleep(1)
        
    botao_x, botao_y = pyautogui.position()
    print(f"\n[OK] Botão de enviar mapeado em: X={botao_x} | Y={botao_y}\n")

    # Tira o print do botão ativo para usar como comparação posterior
    print("[INFO] Registrando imagem de referência do botão ativo...")
    regiao_botao = (botao_x - 30, botao_y - 30, 60, 60)
    pyautogui.screenshot(NOME_IMAGEM_TEMP, region=regiao_botao)
    print(f"[OK] Referência visual salva temporariamente como '{NOME_IMAGEM_TEMP}'.\n")
    
    print("Tudo pronto! Iniciando o envio dos prompts em 3 segundos...")
    time.sleep(3)

    # Loop principal de envio dos prompts
    for index, prompt in enumerate(prompts, start=1):
        print("=" * 70)
        print(f"[{index}/{len(prompts)}] Processando Prompt...")
        print("=" * 70)

        # 1. Clica no campo de texto capturado
        pyautogui.click(campo_x, campo_y)
        time.sleep(0.3)

        # 2. Limpa o texto anterior
        pyautogui.hotkey("ctrl", "a")
        pyautogui.press("backspace")
        time.sleep(0.3)

        # 3. Copia e cola o prompt da vez
        pyperclip.copy(prompt)
        time.sleep(0.2)
        pyautogui.hotkey("ctrl", "v")
        time.sleep(0.5)

        # 4. Clica no botão de enviar mapeado
        pyautogui.click(botao_x, botao_y)
        print("[OK] Prompt enviado para o Firefly.")

        # 5. Espera um delay inicial (5s) para dar tempo do Firefly mudar o estado do botão
        time.sleep(5)

        # 6. Monitoramento dinâmico da imagem do botão
        aguardar_botao_liberar(botao_x, botao_y)
        
        # Intervalo curto de descanso entre gerações
        time.sleep(1.5)

    print("\n" + "=" * 70)
    print("[FIM] Todos os prompts foram gerados com sucesso!")
    print("=" * 70)


if __name__ == "__main__":
    try:
        rodar_automacao()
    except KeyboardInterrupt:
        print("\n[AVISO] Script interrompido manualmente pelo usuário (Ctrl+C).")
    except Exception as e:
        print(f"\n[ERRO] Ocorreu uma falha na execução: {e}")
    finally:
        # Garante a remoção da imagem temporária em qualquer cenário de fechamento
        if os.path.exists(NOME_IMAGEM_TEMP):
            try:
                os.remove(NOME_IMAGEM_TEMP)
                print(f"[LIMPEZA] Arquivo temporário '{NOME_IMAGEM_TEMP}' removido com sucesso.")
            except Exception as e:
                print(f"[AVISO] Não foi possível remover o arquivo temporário: {e}")