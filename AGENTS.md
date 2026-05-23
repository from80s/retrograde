# RetroGrade - Project Guidelines

## Code Conventions

### Ordering Rule
**SEMPRE** criar selects, listagens, dropdowns, menus e qualquer elemento com múltiplas opções em **ordem alfabética** (A-Z). Isso se aplica a:
- Opções de select/dropdown
- Itens de menu/lista
- Plataformas em dropdowns
- Sistemas em listagens
- Qualquer array de opções exibido ao usuário

### Language
- Respostas e commit messages em **Português Brasileiro**
- UI text em Português Brasileiro

### Design System
- Dark mode base: `bg-zinc-950`
- Glassmorphism: classe `glass`
- Cores retro: `retro-primary`, `retro-secondary`, `retro-success`, `retro-warning`, `retro-danger`
- Animações: Framer Motion
- **Logos de sistemas**: Sempre usar logo do sistema (em `assets/system/logos/`) junto com o nome do sistema na interface, especialmente em cards. Mapeamento: `.nes` → `nes.svg`, `.sfc`/`.smc` → `snes.svg`, `.n64`/`.z64`/`.v64` → `n64.svg`, `.gb` → `gb.svg`, `.gba` → `gba.svg`, `.gbc` → `gbc.svg`, `.nds` → `nds.svg`, `.3ds` → `n3ds.svg`, `.iso`/`.wbfs`/`.rvz`/`.gcm` → `gc.svg` ou `wii.svg`, `.bin`/`.cue`/`.chd`/`.pbp` → `psx.svg`, `.cso` → `psp.svg`, `.gen`/`.md`/`.smd` → `megadrive.svg`, `.sms` → `mastersystem.svg`, `.gg` → `gamegear.svg`, `.32x` → `sega32x.svg`, `.gdi`/`.sat` → `saturn.svg` ou `dreamcast.svg`, `.neo`/`.ngcd` → `neogeo.svg`, `.ngp`/`.ngpc` → `ngpc.svg`, `.7z`/`.zip` → `arcade.svg`, `.a26` → `atari2600.svg`, `.a52` → `atari5200.svg`, `.a78` → `atari7800.svg`, `.lnx` → `atarilynx.svg`, `.st` → `atarist.svg`, `.atr` → `atari800.svg`, `.jag` → `atarijaguar.svg`, `.col` → `colecovision.svg`, `.int` → `intellivision.svg`, `.vec` → `vectrex.svg`, `.mx1`/`.mx2` → `msx.svg`, `.pce` → `pcengine.svg`, `.pcecd` → `pcenginecd.svg`, `.adf` → `amiga.svg`, `.cd32` → `amigacd32.svg`, `.d64` → `c64.svg`, `.do` → `apple2.svg`, `.fds` → `fds.svg`, `.sg` → `sg-1000.svg`, `.ps2` → `ps2.svg`, `.wux` → `wiiu.svg`, `.z80` → `zxspectrum.svg`, `.ws`/`.wsc` → `wonderswan.svg`, `.vb` → `virtualboy.svg`, `.pokemini` → `pokemini.svg`.

### Detecção de Sistemas (v2 - SQLite + Hash)

O sistema de detecção de ROMs usa 3 camadas em cascata, parando na primeira que tiver resultado:

1. **Hash lookup no SQLite** (ALTA confiança) — CRC32, SHA1 e MD5 são computados e comparados contra o banco `assets/rom_database_optimized.sqlite` (~440MB, ~1.27M ROMs de 90 sistemas).
2. **Magic bytes** (MÉDIA confiança) — Assinaturas binárias conhecidas (NES `4E45531A`, GBA `24FFAE51`, MegaDrive `53454741`, etc.).
3. **Extensão do arquivo** (BAIXA confiança) — Fallback pelo mapeamento de extensão `.sfc` → SNES, `.gen` → MegaDrive, etc.

O banco SQLite é gerado a partir dos DATs No-Intro/Redump, filtrado para conter apenas os 90 sistemas mapeados no `data/systems.json`. O script `scripts/optimize_db.mjs` faz a filtragem.

### Fluxo de Detecção

```
arquivo (pode ser .zip ou .gz)
  │
  ├─► descomprime se necessário
  │
  ├─► calcula CRC32 + SHA1 + MD5
  │
  ├─► Camada 1: lookup no SQLite por hash ──► ALTA confiança
  │
  ├─► Camada 2: magic bytes (assinatura binária) ──► MÉDIA
  │
  └─► Camada 3: extensão interna do arquivo ──► BAIXA
```

O serviço `electron/romDetector.ts` (processo Main do Electron) gerencia toda a lógica. A comunicação com o Renderer é feita via IPC:
- `rom:detect(filePath)` → retorna `DetectionResult` com sistema, nome, confiança, hashes
- `rom:detectBatch(filePaths)` → detecção em lote (concorrência 4)

**Arquivos chave:**
- `electron/romDetector.ts` — Serviço de detecção (inicialização, hash, magic bytes, lookup)
- `electron/main.ts` — Inicialização do banco, handlers IPC `rom:detect`/`rom:detectBatch`
- `electron/preload.ts` — Exposição via `contextBridge` (`api.romDetect`, `api.romDetectBatch`)
- `assets/rom_database_optimized.sqlite` — Banco SQLite otimizado com ~1.27M ROMs
- `scripts/optimize_db.mjs` — Script para filtrar o banco original para apenas os sistemas suportados

**Dependências nativas:**
- `better-sqlite3` — Módulo nativo C++ para SQLite (requer `electron-rebuild`)
- `adm-zip` — Extração de arquivos .zip
- `node-gzip` — Extração de arquivos .gz
- `crc-32` — Cálculo rápido de CRC32

**Resultado da detecção:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `system` | string? | Extensão-chave no `systems.json` (ex: `.sfc`, `.bin`) |
| `name` | string? | Nome oficial conforme No-Intro/Redump |
| `confidence` | string | `high` / `medium` / `low` / `unknown` |
| `matchedBy` | string? | `hash:crc32` / `hash:sha1` / `hash:md5` / `magic_bytes` / `extension` |
| `hashes` | object? | `{ crc32, sha1, md5 }` — útil para cache |

### Versioning
- SemVer (atual: `1.5.0`)
- Versão refletida na UI e docs

### Security
- Nunca hardcoded credentials
- Scripts leem de `data/config.json` (gitignored)

### Build
- NSIS installer + Portable executable

### Workflow de Finalização
**SEMPRE** ao finalizar uma execução/tarefa:
1. Executar `npm run build` para verificar se o projeto compila sem erros
2. Fornecer ao usuário uma sugestão de commit message em Português Brasileiro com o contexto completo do que foi realizado
