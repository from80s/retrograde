import pyautogui
import pyperclip
import time

# Lista de prompts mantida intacta
prompts_dola = [
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do Commodore Amiga interagindo em uma única cena dinâmica, incluindo Guybrush Threepwood (Monkey Island), LeChuck, Shadow of the Beast criatura, Turrican e elementos de Cannon Fodder. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica do Amiga. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do Commodore Amiga CD32 interagindo em uma única cena dinâmica, incluindo Zool, James Pond, Superfrog, Alien Breed soldados e elementos de Chaos Engine. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica do Amiga CD32. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do MAME interagindo em uma única cena dinâmica, incluindo Pac-Man, Donkey Kong, Ryu (Street Fighter II), Mortal Kombat ninjas, Galaga naves e Metal Slug soldados. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica dos arcades. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do Coleco Adam interagindo em uma única cena dinâmica, incluindo Smurf, Zaxxon naves, Donkey Kong e elementos de Buck Rogers: Planet of Zoom. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica do Coleco. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do Commodore VIC-20 interagindo em uma única cena dinâmica, incluindo Gorf naves, Omega Race elementos, Avenger guerreiros e Clowns personagens. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica do VIC-20. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do Neo Geo CD interagindo em uma única cena dinâmica, incluindo Terry Bogard (Fatal Fury), Kyo Kusanagi (King of Fighters), Haohmaru (Samurai Shodown), Marco Rossi (Metal Slug) e Athena Asamiya. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica do Neo Geo. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do PC Engine CD / TurboGrafx-CD interagindo em uma única cena dinâmica, incluindo Rondo of Blood Richter Belmont, Bonk, Keith Courage, Lords of Thunder cavaleiros e Ys heróis. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica do PC Engine CD. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do SuperGrafx interagindo em uma única cena dinâmica, incluindo Daimakaimura (Ghouls 'n Ghosts) cavaleiro Arthur, Aldynes naves, Battle Ace pilotos e elementos de 1941: Counter Attack. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica do SuperGrafx. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do Sega CD / Mega-CD interagindo em uma única cena dinâmica, incluindo Sonic, Night Trap personagens, Lunar heróis, Ecco the Dolphin e Snatcher protagonistas. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica do Sega CD. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do Sega Dreamcast interagindo em uma única cena dinâmica, incluindo Shenmue Ryo Hazuki, Sonic Adventure personagens, Jet Set Radio grafiteiros, Skies of Arcadia heróis e SoulCalibur lutadores. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica do Dreamcast. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",
    "O estilo é 3D, um pôster premium de fan art quadrado em 1:1 exibindo uma composição épica de personagens icônicos clássicos do Sharp X68000 interagindo em uma única cena dinâmica, incluindo Simon Belmont (Castlevania X68000), Arthur (Daimakaimura/Ghouls 'n Ghosts), Vic Viper (Gradius), Cho Ren Sha naves e inimigos de Akumajou Dracula. Estilo de arte vetorial detalhado com linhas limpas, sombreamento de gradiente suave e iluminação ambiente teatral. Usando a paleta de cores retrô autêntica do X68000. Forte foco na ação heroica dos personagens, poses dramáticas, sem texto, sem logotipos, puro conteúdo de arte ilustrativa de jogos, foco nítido. Não deverá ser criado nenhum texto, logotipo ou o console/sistema, apenas a ilustração.",

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