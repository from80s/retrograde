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

### Detecção de Sistemas
- **Prioridade 1**: Magic numbers e headers dos arquivos (SEGA SEGASATURN, PS-X EXE, Nintendo, etc.)
- **Prioridade 2**: Análise de tamanho do arquivo (PS2 > 1GB, PS1 200-700MB, etc.)
- **Prioridade 3**: Nomes de pastas como fallback (ps2, snes, genesis, etc.)
- Extensões genéricas (.iso, .bin, .chd) são analisadas pelo conteúdo, não apenas pela extensão
- Detecção 100% local, sem consumo de API

### Detecção de Sistemas
- **Prioridade 1**: Magic numbers e headers dos arquivos (SEGA SEGASATURN, PS-X EXE, Nintendo, etc.)
- **Prioridade 2**: Análise de tamanho do arquivo (PS2 > 1GB, PS1 200-700MB, etc.)
- **Prioridade 3**: Nomes de pastas como fallback (ps2, snes, genesis, etc.)
- Extensões genéricas (.iso, .bin, .chd) são analisadas pelo conteúdo, não apenas pela extensão
- Detecção 100% local, sem consumo de API

### Detecção de Sistemas
- **Prioridade 1**: Magic numbers e headers dos arquivos (SEGA SEGASATURN, PS-X EXE, Nintendo, etc.)
- **Prioridade 2**: Análise de tamanho do arquivo (PS2 > 1GB, PS1 200-700MB, etc.)
- **Prioridade 3**: Nomes de pastas como fallback (ps2, snes, genesis, etc.)
- Extensões genéricas (.iso, .bin, .chd) são analisadas pelo conteúdo, não apenas pela extensão
- Detecção 100% local, sem consumo de API

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
