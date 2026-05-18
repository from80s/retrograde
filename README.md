<img src="assets/images/RetroGrade.png" alt="RetroGrade">

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
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
- **Detecção de Clones/Duplicados:** Identifica ROMs duplicadas por região (USA, World, Europe, Japan, Brazil) e permite manter múltiplas regiões preferidas.
- **Ação Configurável:** Escolha entre mover arquivos para pasta `/removidos` ou deletar permanentemente.
- **Dry Run (Simulação):** Simule toda a curadoria antes de executar — veja exatamente o que seria movido/deletado com tamanhos e notas.

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

### Configuração & Dados
- **Configuração via UI:** Modal completo para editar credenciais, nota mínima, ação, clássicos, gêneros e jogos protegidos.
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

---

## 📂 Arquivos de Configuração (JSON)

A aplicação mantém a persistência de dados em arquivos JSON locais na pasta `data/`:

| Arquivo                  | Função                                                                  |
| :----------------------- | :---------------------------------------------------------------------- |
| `config.json`            | Credenciais de API, nota mínima (`minRating`) e ação (`action`).        |
| `classics.json`          | Lista de palavras-chave para proteger franquias (ex: "Mario", "Zelda"). |
| `genre.json`             | Lista de gêneros protegidos (ex: "RPG", "Luta").                        |
| `protected_games.json`   | Lista de jogos individuais protegidos pelo usuário.                     |
| `systems.json`           | Mapeamento de extensões para IDs de plataformas IGDB/TGDB.              |
| `curator_stats.json`     | Histórico completo de execuções com totais e resultados.                |

---

## 📦 Como Instalar e Rodar

### Requisitos

- Node.js >= 18.0.0
- Windows 11 (nativo)

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

4. **Rode em modo desenvolvimento:**
   ```bash
   npm run electron:dev
   ```

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
│   ├── main.ts           # Processo principal (IPC, APIs, file I/O, scan, simulation)
│   ├── preload.ts        # Ponte segura contextBridge
│   └── tsconfig.json     # Config TypeScript do Electron
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx        # Modal "Sobre" com créditos e tecnologias
│   │   ├── ActivityLog.tsx       # Log de atividades com nota e gênero
│   │   ├── ProgressCard.tsx      # Barra de progresso + arquivo atual
│   │   ├── ScanPreviewModal.tsx  # Pré-visualização da curadoria
│   │   ├── SettingsModal.tsx     # Configurações completas
│   │   ├── SpaceSavingsCard.tsx  # Card de economia de espaço
│   │   ├── SplashScreen.tsx      # Splash screen com vídeo
│   │   ├── StatCard.tsx          # Cards de estatísticas animados
│   │   ├── StatsHistory.tsx      # Histórico com gráficos
│   │   ├── SupportModal.tsx      # Modal de suporte
│   │   ├── Toast.tsx             # Notificações toast
│   │   └── TitleBar.tsx          # Barra de título customizada
│   ├── types/
│   │   └── global.d.ts           # Tipagem da API bridge
│   ├── App.tsx                    # Componente principal
│   ├── main.tsx                   # Entry point React
│   └── index.css                  # Tailwind + estilos customizados
├── data/
│   ├── classics.json              # Franquias protegidas
│   ├── config.json                # Credenciais + minRating + action
│   ├── genre.json                 # Gêneros protegidos
│   ├── protected_games.json       # Jogos individuais protegidos
│   ├── systems.json               # Mapeamento de sistemas
│   └── curator_stats.json         # Histórico de execuções
├── assets/
│   ├── images/
│   │   ├── RetroGrade.png         # Logo do app
│   │   └── RetroGrade_icon_app_256x256.png  # Ícone do executável
│   └── videos/
│       └── RetroGrade_intro.mp4   # Vídeo da splash screen
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔌 Arquitetura IPC

O projeto utiliza comunicação segura entre processos via `contextBridge`:

- **Main Process:** Lida com `fs`, `path`, chamadas de API (IGDB/TGDB), escaneamento recursivo, detecção de clones, simulação de curadoria e operações de arquivo
- **Renderer Process:** Responsável exclusivamente pela UI e estados React
- **Preload Script:** Expõe a ponte `window.api` com métodos seguros para o renderer

---

## 📋 Scripts Disponíveis

| Comando                  | Descrição                                    |
| :----------------------- | :------------------------------------------- |
| `npm run dev`            | Inicia o servidor Vite (apenas frontend)     |
| `npm run build`          | Build do frontend com Vite                   |
| `npm run electron:dev`   | Roda o app completo em modo desenvolvimento  |
| `npm run electron:build` | Build completo para produção                 |
| `npm run preview`        | Preview do build do frontend                 |

---

## 📝 Versionamento

O projeto segue o [Semantic Versioning](https://semver.org/lang/pt-BR/):

- **MAJOR** (X.0.0): Mudanças incompatíveis com versões anteriores
- **MINOR** (0.X.0): Novas funcionalidades compatíveis com versões anteriores
- **PATCH** (0.0.X): Correções de bugs compatíveis com versões anteriores

A versão atual é refletida na UI do app (sidebar e modal "Sobre") e sincronizada com o `package.json`.

---

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

**Thiago Teles**

- GitHub: [@from80s](https://github.com/from80s)
- ☕ [Buy me a coffee](https://www.buymeacoffee.com/retrograde)
