import os
import sys
import subprocess
import re
from pathlib import Path
from tqdm import tqdm
import tkinter as tk
from tkinter import filedialog

def exibir_ascii_art():
    art = """
  ____  _____ _____ ____  ____  _____    _    __  __ 
 / ___|| ____| ____|  _ \|  _ \| ____|  / \  |  \/  |
 \___ \|  _| |  _| | | | | |_) |  _|   / _ \ | |\/| |
  ___) | |___| |___| |_| |  _ <| |___ / ___ \| |  | |
 |____/|_____|_____|____/|_| \_\_____/_/   \_\_|  |_|
                                                     
    AI Image Batch Processor | created by BlackFrom80s
    --------------------------------------------------
    """
    print(art)

def obter_pastas():
    """
    Tenta obter as pastas via argumentos de linha de comando.
    Caso não existam, abre a interface gráfica (GUI).
    """
    # Se o usuário passou os dois argumentos no terminal
    if len(sys.argv) >= 3:
        pasta_origem = Path(sys.argv[1].strip('"').strip("'"))
        pasta_destino = Path(sys.argv[2].strip('"').strip("'"))
        
        if not pasta_origem.exists() or not pasta_origem.is_dir():
            print(f"❌ Erro: A pasta de origem informada não existe ou não é um diretório: {pasta_origem}")
            sys.exit(1)
            
        pasta_destino.mkdir(parents=True, exist_ok=True)
        return pasta_origem, pasta_destino

    # Caso contrário, abre a seleção via GUI (Tkinter)
    print("🖥️  Nenhum argumento de linha de comando detectado. Abrindo interface gráfica...")
    
    # Esconde a janela principal vazia do Tkinter
    root = tk.Tk()
    root.withdraw()
    root.attributes("-topmost", True)  # Força a janela a aparecer na frente

    # Seleção da pasta de origem
    print("Aguardando seleção da pasta de ORIGEM na janela de diálogo...")
    caminho_origem = filedialog.askdirectory(title="Selecione a pasta com as imagens ORIGINAIS")
    if not caminho_origem:
        print("❌ Operação cancelada pelo usuário.")
        sys.exit(0)
    pasta_origem = Path(caminho_origem)

    # Seleção da pasta de destino
    print("Aguardando seleção da pasta de DESTINO na janela de diálogo...")
    caminho_destino = filedialog.askdirectory(title="Selecione (ou crie) a pasta onde deseja SALVAR")
    if not caminho_destino:
        print("❌ Operação cancelada pelo usuário.")
        sys.exit(0)
    pasta_destino = Path(caminho_destino)

    return pasta_origem, pasta_destino

def processar_imagens():
    exibir_ascii_art()

    # Obtém as pastas dinamicamente (CLI ou GUI)
    pasta_origem, pasta_destino = obter_pastas()

    print(f"\n📂 Pasta de Origem:  {pasta_origem}")
    print(f"📂 Pasta de Destino: {pasta_destino}")

    # Filtra os arquivos de imagem suportados
    extensoes_validas = ('.jpg', '.jpeg', '.png')
    imagens = [f for f in pasta_origem.iterdir() if f.is_file() and f.suffix.lower() in extensoes_validas]

    total_arquivos = len(imagens)
    if total_arquivos == 0:
        print("\n⚠️ Nenhuma imagem (.jpg, .jpeg, .png) foi encontrada na pasta de origem.")
        return

    print(f"\n🚀 Pronto para processar {total_arquivos} imagens.")
    print("="*60)

    prompt = "remova os textos da imagem, mantendo todo o restante original, não altere nenhuma característica da imagem, apenas realize o inpainting da área que foi removida o texto."

    # Loop com Barra de Progresso
    with tqdm(total=total_arquivos, desc="Progresso", unit="img") as pbar:
        for img_path in imagens:
            nome_arquivo = img_path.name
            pbar.set_postfix_str(f"Atual: {nome_arquivo}")

            try:
                # Passo A: Envia o comando de edição para o seedream
                resultado_envio = subprocess.run(
                    ["seedream", "edit", prompt, "-i", str(img_path)],
                    capture_output=True,
                    text=True,
                    check=True
                )
                
                saida_envio = resultado_envio.stdout.strip()
                match = re.search(r'([a-zA-Z0-9\-]+)', saida_envio)
                
                if not match:
                    print(f"\n❌ Não foi possível capturar o ID da tarefa para {nome_arquivo}. Retorno: {saida_envio}")
                    pbar.update(1)
                    continue
                    
                task_id = match.group(1)

                # Passo B: Executa o 'seedream wait' para aguardar a conclusão
                # Alterado para "wb" (escrita binária) para evitar a corrupção do arquivo de imagem
                caminho_salvamento = pasta_destino / nome_arquivo
                
                with open(caminho_salvamento, "wb") as arquivo_final:
                    subprocess.run(
                        ["seedream", "wait", task_id],
                        stdout=arquivo_final, 
                        check=True
                    )

            except subprocess.CalledProcessError as e:
                print(f"\n❌ Erro ao processar o arquivo {nome_arquivo}: {e.stderr or e}")
            except Exception as e:
                print(f"\n❌ Erro inesperado no arquivo {nome_arquivo}: {e}")
            
            pbar.update(1)

    print("\n🎉 Processamento em lote concluído com sucesso!")

if __name__ == "__main__":
    processar_imagens()