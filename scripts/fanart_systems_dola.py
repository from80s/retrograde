import pyautogui
import pyperclip
import time

# Lista de prompts mantida intacta
prompts_dola = [   
    "O estilo é 3D, Um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do Virtual Boy interagindo em uma única cena dinâmica, incluindo o herói Mario jogando tênis em quadras tridimensionais lineares (Mario's Tennis), o robô gigante destruindo cidades futuristas (Teleroboxer) e a nave vermelha aramada voando por túneis espaciais (Red Alarm). Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando estritamente e exclusivamente a paleta de cores retrô monocromática vermelha e preta autêntica do Virtual Boy. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, sem o óculos/console físico na imagem, puro conteúdo de arte ilustrativa de jogos, foco nítido.",
    "Um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do Nintendo GameCube interagindo em uma única cena dinâmica, incluindo o herói cel-shaded Link navegando em seu barco vermelho (The Wind Waker), a caçadora Samus Aran em visão de primeira pessoa com o visor brilhante (Metroid Prime) e os pequenos e coloridos Pikmin seguindo o Capitão Olimar. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores vibrante autêntica do Nintendo GameCube. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, sem o console cúbico físico na imagem, puro conteúdo de arte ilustrativa de jogos, foco nítido.",
    "Um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do PlayStation 3 interagindo em uma única cena dinâmica, incluindo o caçador de tesouros Nathan Drake saltando de um penhasco enquanto atira (Uncharted), os sobreviventes Joel e Ellie caminhando por uma cidade em ruínas tomada pela natureza (The Last of Us) e o pequeno boneco de pano Sackboy sorrindo com fantasias coloridas (LittleBigPlanet). Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores cinematográfica e detalhada de alta definição autêntica do PlayStation 3. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, sem o console físico na imagem, puro conteúdo de arte ilustrativa de jogos, foco nítido."
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