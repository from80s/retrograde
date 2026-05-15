<img src="assets/images/RetroGrade.png" alt="RetroGrade">

![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg)
![Electron](https://img.shields.io/badge/electron-v30+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Curadoria inteligente de coleções de jogos baseada em avaliações da IGDB e TheGamesDB.**

O **RetroGrade** foi construído para oferecer uma experiência Desktop moderna, rápida e visualmente deslumbrante. Esta versão evoluiu de um script Python para uma aplicação robusta em **Electron + React**, focada em performance e UI/UX de alto nível.

---

## 🚀 Funcionalidades Principais

- **Interface Designer-First:** Desenvolvido com Tailwind CSS, oferecendo um tema Dark sofisticado, animações suaves com Framer Motion e efeitos de vidro (glassmorphism).
- **Multi-Database:** Consulta notas de forma inteligente nas APIs da IGDB e TheGamesDB via Node.js (Main Process).
- **Proteção de Clássicos:** Sistema de preservação automática que impede a remoção de franquias icônicas baseando-se no arquivo `classics.json`.
- **Dashboard em Tempo Real:** Acompanhe o progresso da curadoria com contadores animados, barra de progresso e log de atividades dinâmico.
- **Gestão de Sistemas:** Suporte a dezenas de consoles através do mapeamento customizável em `systems.json`.

---

## 🛠️ Stack Tecnológica

- **Framework:** [Electron](https://www.electronjs.org/) (Vite)
- **Frontend:** [React](https://reactjs.org/) + TypeScript
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)

---

## 📂 Arquivos de Configuração (JSON)

A aplicação mantém a persistência de dados em arquivos JSON locais, permitindo que você personalize a curadoria sem mexer no código:

| Arquivo              | Função                                                                  |
| :------------------- | :---------------------------------------------------------------------- |
| `config.json`        | Armazena credenciais de API (IGDB Client ID/Secret e TGDB Key).         |
| `classics.json`      | Lista de palavras-chave para proteger franquias (ex: "Mario", "Zelda"). |
| `systems.json`       | Mapeamento de extensões de arquivos para IDs de plataformas das APIs.   |
| `curator_stats.json` | Histórico completo de execuções e economia de espaço em disco gerada.   |

---

## 📦 Como Instalar e Rodar

1. **Clone o repositório:**
   ```bash
   git clone [git@github.com:from80s/retrograde.git](git@github.com:from80s/retrograde.git)
   cd retrograde-curator
   ```
