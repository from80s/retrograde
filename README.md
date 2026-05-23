<img src="assets/images/RetroGrade.png" alt="RetroGrade">

![Version](https://img.shields.io/badge/version-1.6.0-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg)
![Electron](https://img.shields.io/badge/electron-v30+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Curadoria inteligente de coleções de jogos baseada em avaliações da IGDB e TheGamesDB.**

O **RetroGrade** é uma aplicação Desktop moderna, rápida e visualmente sofisticada para organizar bibliotecas de ROMs retro. Analisa milhares de arquivos, consulta APIs de bancos de dados e organiza sua coleção com base em notas, gêneros e listas de proteção configuráveis.

---

## 🚀 Funcionalidades Principais

### Curadoria Inteligente
- **Multi-Database:** Consulta notas automaticamente nas APIs da IGDB e TheGamesDB com fallback inteligente. Unifica notas pegando sempre a maior entre as APIs (padrão 0-100).
- **Proteção em 3 Camadas:**
  - 🟡 **Clássicos:** Franquias icônicas protegidas por palavras-chave (`classics.json`)
  - 🟣 **Gêneros:** Gêneros inteiros protegidos mesmo com nota baixa (`genre.json`) — requer IGDB configurado
  - 🟢 **Jogos Individuais:** Jogos específicos escolhidos pelo usuário com validação automática (`protected_games.json`)
- **Popular Clássicos:** Seletor visual com 675 jogos clássicos pré-curados em 28 plataformas. Escolha por sistema, visualize em lista ou grade com capas otimizadas em WebP, e popule automaticamente sua `classics.json` sem sobrescrever os existentes.
- **Detecção de Clones/Duplicados:** Identifica ROMs duplicadas por região (USA, World, Europe, Japan, Brazil) e permite manter múltiplas regiões preferidas.
- **Ação Configurável:** Escolha entre mover arquivos para pasta `/removidos` ou deletar permanentemente.
- **Dry Run (Simulação):** Simule toda a curadoria antes de executar — veja exatamente o que seria movido/deletado com tamanhos e notas.

### Detecção de ROMs (3 Camadas)
- **Hash Lookup (ALTA confiança):** CRC32, SHA1 e MD5 computados e comparados contra banco SQLite de ~1.27M ROMs de 90 sistemas (No-Intro/Redump).
- **Magic Bytes (MÉDIA confiança):** Assinaturas binárias conhecidas (NES `4E45531A`, GBA `24FFAE51`, MegaDrive `53454741`, etc.).
- **Extensão (BAIXA confiança):** Fallback pelo mapeamento de extensão `.sfc` → SNES, `.gen` → MegaDrive, etc.
- **Arquivos compactados:** Extrai automaticamente `.zip` e `.gz` para detectar a ROM interna.
- **Cancelamento + Retomada:** Curadoria, simulação e extração podem ser canceladas com botão dedicado e retomadas de onde pararam via log de progresso (`.retrograde_progress.json`).

### Interface & UX
- **Splash Screen:** Vídeo de intro animado no lançamento do app.
- **Pré-visualização da Curadoria:** Modal completo antes de executar, com:
  - Escaneamento com barra de progresso em duas fases (arquivos → APIs)
  - Filtros por nome, gênero e ano (dropdown com anos das ROMs)
  - Listagem de ROMs por sistema expansível com nota, gênero, região e badges de proteção
  - Configuração de clones e jogos protegidos em tempo real
- **Dashboard em Tempo Real:** Contadores animados, barra de progresso global, card do sistema atual e log de atividades com nota e gênero de cada ROM processada.
- **Card de Economia de Espaço:** Mostra visualmente o espaço economizado/recuperável com gráfico animado e botão para deletar `/removidos`.
- **Toast Notifications:** Feedback visual instantâneo para salvar configurações, testar APIs e ações do usuário.
- **Auto-save de APIs:** Ao testar conexão, credenciais válidas são salvas automaticamente.
- **Pasta Selecionada:** Exibida diretamente no menu lateral abaixo do botão "Selecionar Pasta".

### Extrator de ROMs
- **Multi-Formato:** Suporte nativo a `.zip`, `.rar`, `.7z`, `.tar`, `.gz` e `.tar.gz` — sem depender de software externo.
- **Modos de Extração:** Extraia no mesmo diretório ou crie uma pasta individual para cada arquivo.
- **Concorrência Inteligente:** Ajusta automaticamente de 1 a 3 threads baseado no tamanho dos arquivos (arquivos >2GB rodam em single-thread para estabilidade).
- **Progresso em Tempo Real:** Log animado com barras de progresso por arquivo, tamanhos compactado/extraído e contadores.
- **Auto-Limpeza:** Opção de excluir o arquivo compactado após extração bem-sucedida.
- **Cancelamento + Retomada:** Extração pode ser cancelada a qualquer momento e retomada posteriormente via log de progresso.
- **Resumo Final:** Dashboard com stats de sucesso/erro/cancelados, comparação de tamanhos e log detalhado.

### Scanner de Arquivos Órfãos
- **Detecção Inteligente:** Identifica imagens, manuais, textos, metadados e configs sem ROM correspondente na pasta.
- **Similaridade de Nomes:** Usa algoritmo de Levenshtein (>85%) para evitar falsos positivos — arquivos com nome similar a uma ROM são preservados.
- **Categorização Visual:** Arquivos órfãos são classificados por tipo (imagem, manual, texto, metadado, config) com ícones e cores distintas.
- **Seleção Granular:** Selecione/deselecione individualmente ou em lote, com contagem de espaço liberado em tempo real.
- **Deleção Segura:** Deleta apenas os selecionados com feedback visual de quantos arquivos foram removidos e quanto espaço foi liberado.

### Mídias & Asset Downloader
- **Busca de Mídias:** Boxart, screenshots, fanart e banners diretamente da API da TheGamesDB.
- **Detalhes do Jogo:** Título oficial, data de lançamento, desenvolvedor, publicadora e sinopse.
- **Preview em Tela Cheia:** Clique em qualquer imagem para visualizar em tamanho real com overlay escuro.
- **Dropdown de Plataformas:** Seletor com busca rápida entre 40+ plataformas suportadas (NES, SNES, Genesis, PlayStation, etc).
- **Exportação Automática — RetroArch:** Detecta instalação do RetroArch automaticamente, exporta boxarts como PNG no formato `Named_Boxarts`, `Named_Snaps` e `Named_Titles` com nomes compatíveis com playlists.
- **Exportação Automática — ES-DE:** Detecta instalação do ES-DE, exporta mídias para `media/[sistema]/` e atualiza automaticamente o `gamelist.xml` com metadados.
- **Exportação Manual:** Salva todas as mídias em uma pasta organizada com nomes descritivos, com instruções passo-a-passo para integração manual em qualquer frontend.
- **Instruções Integradas:** Cada modo de exportação inclui instruções detalhadas com botão de copiar para a área de transferência.
- **Fallback de Curadoria:** TheGamesDB já é usada automaticamente como fallback para notas e gêneros quando a IGDB está indisponível.

### Configuração & Dados
- **Configuração via UI:** Modal completo para editar credenciais, nota mínima, ação, clássicos, gêneros e jogos protegidos.
- **Popular Clássicos:** Botão na seção de clássicos das configurações que abre um seletor visual com 675 jogos em 28 plataformas, views em lista ou grade com capas em miniatura, busca por nome e filtro por sistema.
- **Sistema de Locales:** Arquitetura preparada para multiletramento — gêneros e textos traduzidos para pt-BR com estrutura extensível para novos idiomas.
- **Histórico de Execuções:** Registro completo com gráficos interativos (barra e rosca).
- **Suporte Integrado:** Modal com informações de contato e suporte.
- **Sobre:** Modal com créditos, versão, tecnologias e links para GitHub e licença.

### Build & Distribuição
- **Instalador NSIS:** Wizard completo com atalhos, desinstalação e diretório customizável.
- **Portable:** Executável único, roda direto sem instalar.

---

## 🛠️ Stack Tecnológica

- **Runtime:** Node.js (Windows 11 Nativo)
- **Framework Desktop:** [Electron](https://www.electronjs.org/) v30+
- **Bundler:** [Vite](https://vitejs.dev/)
- **Frontend:** [React](https://reactjs.org/) + TypeScript
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Requisições:** Axios
- **File I/O:** fs-extra
- **Extração:** unzipper (.zip), 7zip-min (.7z/.rar), tar (.tar/.tar.gz), zlib (.gz), adm-zip (.zip alternativo)
- **Banco de Dados:** better-sqlite3 (SQLite para detecção de ROMs por hash)
- **Hash:** crc-32, crypto (SHA1/MD5)

---

## 📂 Arquivos de Configuração (JSON)

A aplicação mantém a persistência de dados em arquivos JSON locais na pasta `data/`:

| Arquivo                  | Função                                                                  |
| :----------------------- | :---------------------------------------------------------------------- |
| `config.json`            | Credenciais de API, nota mínima (`minRating`) e ação (`action`).        |
| `classics.json`          | Lista de palavras-chave para proteger franquias (ex: "Mario", "Zelda"). |
| `classic_games.json`     | Curadoria de 675 jogos clássicos em 28 plataformas com capas inclusas.  |
| `genre.json`             | Lista de gêneros protegidos (ex: "RPG", "Luta").                        |
| `protected_games.json`   | Lista de jogos individuais protegidos pelo usuário.                     |
| `systems.json`           | Mapeamento de extensões para IDs de plataformas IGDB/TGDB.              |
| `curator_stats.json`     | Histórico completo de execuções com totais e resultados.                |
| `.retrograde_progress.json` | Log de progresso gerado automaticamente na pasta processada (curadoria/simulação/extração). Permite retomada de operações interrompidas. |

> Nota: O arquivo `.retrograde_progress.json` não fica em `data/` — ele é salvo na pasta onde a curadoria, simulação ou extração está sendo executada, e pode ser removido manualmente para descartar o progresso salvo.

---

## 📦 Como Instalar e Rodar

### Requisitos

- Node.js >= 18.0.0
- Windows 11 (nativo)
- Python 2/3 + Build Tools (para compilar módulos nativos, ver dependências abaixo)

### Desenvolvimento

1. **Clone o repositório:**
   ```bash
   git clone git@github.com:from80s/retrograde.git
   cd RetroGrade
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```
   O `npm install` executa automaticamente o script `postinstall`, que compila os módulos nativos (`better-sqlite3`) para a versão do Electron em uso via `electron-rebuild`.

3. **Configure as credenciais de API** em `data/config.json`:
   ```json
   {
     "IGDB_CLIENT_ID": "seu-client-id",
     "IGDB_CLIENT_SECRET": "seu-client-secret",
     "TGDB_API_KEY": "sua-api-key",
     "minRating": 60,
     "action": "move"
   }
   ```

4. **(Opcional) Banco de Dados para Detecção por Hash:**
   Coloque o arquivo do banco No-Intro/Redump original em `temp/rom_database.sqlite` e execute:
   ```bash
   node scripts/optimize_db.mjs
   ```
   Isso gera `assets/rom_database_optimized.sqlite` (~440MB, ~1.27M ROMs de 90 sistemas).
   Sem esse banco a detecção funciona apenas pelas camadas 2 e 3 (magic bytes + extensão), com confiança média/baixa.

5. **Rode em modo desenvolvimento:**
   ```bash
   npm run electron:dev
   ```

### Recompilação de Módulos Nativos

O `better-sqlite3` é um módulo nativo C++ que precisa ser compilado especificamente para a versão do Electron em uso. Execute apenas quando necessário:

- Após o primeiro `npm install` (já executado automaticamente via `postinstall`)
- Após deletar `node_modules` e rodar `npm install` novamente
- Após atualizar a versão do Electron ou do `better-sqlite3`

```bash
# Recompilar manualmente (se necessário)
npx electron-rebuild -f -w better-sqlite3

# ou via npm script (equivalente)
npm run postinstall
```

> **Importante:** Você **não** precisa executar `electron-rebuild` toda vez que compilar o código (`npm run build`). A recompilação de módulos nativos só é necessária quando as dependências ou o runtime do Electron mudam.

### Build para Produção

```bash
npm run electron:build
```

O build gera **dois formatos** na pasta `release/`:

| Arquivo | Tipo | Descrição |
| :--- | :--- | :--- |
| `RetroGrade Setup X.X.X.exe` | **Instalador NSIS** | Wizard de instalação com atalhos, desinstalação e opção de diretório |
| `RetroGrade X.X.X.exe` | **Portable** | Executável único, roda direto sem instalar |

**Instalador NSIS:**
- Permite escolher o diretório de instalação
- Cria atalhos na área de trabalho e Menu Iniciar
- Gera desinstalador automático em "Adicionar/Remover Programas"

**Portable:**
- Não requer instalação
- Pode ser executado de qualquer pasta ou pendrive
- Não deixa rastros no sistema após fechar

---

## 🏗️ Estrutura do Projeto

```
RetroGrade/
├── electron/
│   ├── main.ts               # Processo principal (IPC, APIs, file I/O, scan, simulation)
│   ├── preload.ts            # Ponte segura contextBridge
│   ├── romDetector.ts        # Detecção de ROMs em 3 camadas (hash, magic bytes, extensão)
│   ├── types.d.ts            # Declarações de tipos para módulos nativos
│   └── tsconfig.json         # Config TypeScript do Electron
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx             # Modal "Sobre" com créditos e tecnologias
│   │   ├── ActivityLog.tsx            # Log de atividades com nota e gênero
│   │   ├── ClassicGamesPicker.tsx     # Seletor de clássicos com capas
│   │   ├── CurationModal.tsx          # Modal de progresso da curadoria (com cancelar)
│   │   ├── ExtractorModal.tsx         # Extrator de ROMs multi-formato
│   │   ├── ProgressCard.tsx           # Barra de progresso + arquivo atual
│   │   ├── ScanPreviewModal.tsx       # Pré-visualização da curadoria
│   │   ├── SettingsModal.tsx          # Configurações completas
│   │   ├── SpaceSavingsCard.tsx       # Card de economia de espaço
│   │   ├── SplashScreen.tsx           # Splash screen com vídeo
│   │   ├── StatCard.tsx               # Cards de estatísticas animados
│   │   ├── StatsHistory.tsx           # Histórico com gráficos
│   │   ├── SupportModal.tsx           # Modal de suporte
│   │   ├── Toast.tsx                  # Notificações toast
│   │   └── TitleBar.tsx               # Barra de título customizada
│   ├── lib/
│   │   └── system-logos.ts            # Utilitário de logos por sistema
│   ├── locales/
│   │   ├── index.ts                   # Funções de tradução (tGenre, tSystem)
│   │   └── pt-br.ts                   # Locale pt-BR (gêneros e sistemas)
│   ├── types/
│   │   └── global.d.ts                # Tipagem da API bridge
│   ├── App.tsx                        # Componente principal
│   ├── main.tsx                       # Entry point React
│   └── index.css                      # Tailwind + estilos customizados
├── data/
│   ├── classics.json              # Franquias protegidas
│   ├── classic_games.json         # 675 jogos clássicos curados (28 plataformas)
│   ├── config.json                # Credenciais + minRating + action
│   ├── genre.json                 # Gêneros protegidos
│   ├── protected_games.json       # Jogos individuais protegidos
│   ├── systems.json               # Mapeamento de sistemas
│   └── curator_stats.json         # Histórico de execuções
├── scripts/
│   ├── fetch-covers.mjs           # Script para baixar/otimizar capas via IGDB
│   └── optimize_db.mjs            # Filtra SQLite original para 90 sistemas suportados
├── public/
│   └── covers/                    # 617 capas otimizadas em WebP (160x220, ~4KB cada)
├── assets/
│   ├── images/
│   │   ├── RetroGrade.png         # Logo do app
│   │   └── RetroGrade_icon_app_256x256.png  # Ícone do executável
│   ├── system/
│   │   ├── logos/                 # Logos dos sistemas (NES.svg, SNES.svg, etc.)
│   │   └── banners/               # Banners dos sistemas
│   ├── videos/
│   │   └── RetroGrade_intro.mp4   # Vídeo da splash screen
│   └── rom_database_optimized.sqlite  # Banco SQLite otimizado (~440MB, ~1.27M ROMs) — gerado pelo script optimize_db.mjs
├── temp/
│   └── rom_database.sqlite        # Banco original No-Intro/Redump (não versionado, .gitignore)
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔌 Arquitetura IPC

O projeto utiliza comunicação segura entre processos via `contextBridge`:

- **Main Process:** Lida com `fs`, `path`, chamadas de API (IGDB/TGDB), escaneamento recursivo, detecção de ROMs em 3 camadas (SQLite hash → magic bytes → extensão), detecção de clones, simulação de curadoria, extração de arquivos e operações de arquivo
- **Renderer Process:** Responsável exclusivamente pela UI e estados React
- **Preload Script:** Expõe a ponte `window.api` com métodos seguros para o renderer, incluindo `rom:detect`, `rom:detectBatch`, `cancel-curation`, `cancel-simulation`, `cancel-extraction`, `read-progress-log` e `delete-progress-log`

### Fluxo de Detecção de ROMs

```
arquivo (pode ser .zip ou .gz)
  │
  ├─► descomprime se necessário
  │
  ├─► Camada 1: lookup no SQLite por CRC32/SHA1/MD5 ──► ALTA confiança
  │
  ├─► Camada 2: magic bytes (assinatura binária) ──► MÉDIA
  │
  └─► Camada 3: extensão interna do arquivo ──► BAIXA
```

### Sistema de Progress Log

Curadoria, simulação e extração salvam um arquivo `.retrograde_progress.json` na pasta alvo contendo a lista de arquivos já processados. Ao reiniciar uma operação, o usuário pode optar por retomar de onde parou — os arquivos já processados são pulados automaticamente.

---

## 📋 Scripts Disponíveis

| Comando                          | Descrição                                    |
| :------------------------------- | :------------------------------------------- |
| `npm run dev`                    | Inicia o servidor Vite (apenas frontend)     |
| `npm run build`                  | Compila TypeScript + build do frontend       |
| `npm run electron:dev`           | Roda o app completo em modo desenvolvimento  |
| `npm run electron:build`         | Build completo para produção                 |
| `npm run postinstall`            | Recompila módulos nativos para Electron      |
| `npm run preview`                | Preview do build do frontend                 |
| `node scripts/fetch-covers.mjs`  | Baixa e otimiza capas dos jogos clássicos via IGDB |
| `node scripts/optimize_db.mjs`   | Filtra banco No-Intro/Redump para 90 sistemas suportados |
| `node scripts/optimize-video.mjs` | Otimiza vídeo de intro com ffmpeg (H.264 CRF 23) |

---

## 📝 Versionamento

O projeto segue o [Semantic Versioning](https://semver.org/lang/pt-BR/):

- **MAJOR** (X.0.0): Mudanças incompatíveis com versões anteriores
- **MINOR** (0.X.0): Novas funcionalidades compatíveis com versões anteriores
- **PATCH** (0.0.X): Correções de bugs compatíveis com versões anteriores

A versão atual é refletida na UI do app (sidebar e modal "Sobre") e sincronizada com o `package.json`. Atualmente na **v1.6.0**.

---

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

**Thiago Teles**

- GitHub: [@from80s](https://github.com/from80s)
- ☕ [Buy me a coffee](https://www.buymeacoffee.com/retrograde)
