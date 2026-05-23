import pyautogui
import pyperclip
import time

# Lista de prompts mantida intacta
prompts_dola = [   
    
]

def rodar_automacao():
    print("=" * 60)
    print("AUTOMAÇÃO DO DOLA COM SUPORTE A CARACTERES ESPECIAIS e FOCO DINÂMICO")
    print("Por favor, posicione o mouse em cima do campo de texto do Dola.")
    print("O script vai capturar a posição do seu mouse nos segundos finais.")
    print("Mova o cursor para o topo esquerdo (0,0) para abortar a qualquer momento.")
    print("=" * 60)
    
    for i in range(10, 0, -1):
        print(f"Iniciando em... {i}")
        time.sleep(1)

    # Captura onde o seu mouse está parado logo antes de começar o loop
    # Certifique-se de deixar o mouse parado em cima da barra de digitação do Dola
    campo_x, campo_y = pyautogui.position()
    print(f"\n[OK] Posição do input capturada em: X={campo_x}, Y={campo_y}")

    total_prompts = len(prompts_dola)
    
    for index, prompt in enumerate(prompts_dola, start=12):
        print(f"\n[{index}/{total_prompts + 11}] Preparando envio...")
        
        # 0. NOVO: Clica no campo de texto usando a coordenada salva para garantir o foco
        pyautogui.click(campo_x, campo_y)
        time.sleep(0.3)
        
        # 1. Garante que o input antigo seja limpo (Seleciona tudo e deleta)
        pyautogui.hotkey('ctrl', 'a')
        pyautogui.press('backspace')
        time.sleep(0.5)

        # 2. Copia o prompt completo com acentos perfeitamente para o Clipboard
        pyperclip.copy(prompt)
        time.sleep(0.2)
        
        # 3. Executa a colagem nativa (Ctrl + V)
        pyautogui.hotkey('ctrl', 'v')
        time.sleep(1)
        
        # 4. Envia o prompt
        pyautogui.press('enter')
        print(f"Prompt {index} colado e enviado perfeitamente!")
        
        # Tempo para processamento da renderização 3D do Dola
        tempo_espera = 45 
        print(f"Aguardando {tempo_espera} segundos pela geração da imagem...")
        time.sleep(tempo_espera)

    print("\n[FIM] Todos os prompts foram injetados sem perda de foco ou caracteres!")

if __name__ == "__main__":
    try:
        pyautogui.FAILSAFE = True
        rodar_automacao()
    except pyautogui.FailSafeException:
        print("\n[AVISO] Execução abortada via FailSafe (mouse movido para o canto).")
    except KeyboardInterrupt:
        print("\n[AVISO] Interrupção manual do script.")