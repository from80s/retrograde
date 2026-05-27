const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'systems_metadata.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const curated = {
  'sega_32x': {
    curiosities: [
      'O 32X era tão poderoso que a Sega chegou a chamá-lo de "console de 32 bits" antes do Saturn, causando confusão no mercado.',
      'Apenas 40 títulos foram lançados oficialmente para o 32X nos Estados Unidos.',
      'O 32X foi descontinuado menos de dois anos após seu lançamento, sendo um dos maiores fracassos comerciais da Sega.'
    ],
    emulators: ['Kega Fusion', 'Picodrive (RetroArch)']
  },
  'nintendo_3ds': {
    curiosities: [
      'O 3DS vendeu mais de 75 milhões de unidades mundialmente, tornando-se um dos portáteis mais vendidos da história.',
      'O recurso de realidade aumentada vinha incluído com cartões AR que interagiam com jogos como o cartão de arremesso de Pokémon.',
      'O SpotPass usava conexão Wi-Fi para receber conteúdos automaticamente mesmo com o console em modo de espera.'
    ],
    emulators: ['Citra', 'Ryujinx (parcial)']
  },
  'arcade': {
    curiosities: [
      'O primeiro jogo de arcade comercialmente bem-sucedido foi "Computer Space" (1971), mas foi "Pong" (1972) da Atari que popularizou o formato.',
      'O Japão possui uma cultura de arcade única com fliperamas de vários andares em bairros como Akihabara, Tóquio.',
      'O Neo Geo MVS permitia que operadores trocassem cartuchos em um mesmo gabinete, algo revolucionário para a época.'
    ],
    emulators: ['MAME', 'FinalBurn Neo', 'FB Alpha']
  },
  'atari_2600': {
    curiosities: [
      'O Atari 2600 foi originalmente chamado de "Atari Video Computer System" (VCS) até 1982.',
      'O infame jogo "E.T. the Extra-Terrestrial" (1982) é creditado como um dos principais fatores da crise dos videogames de 1983.',
      'Seu processador MOS 6507 rodava a apenas 1.19 MHz, menos potente que calculadoras modernas.'
    ],
    emulators: ['Stella', 'Z26']
  },
  'atari_5200': {
    curiosities: [
      'O Atari 5200 tinha controle com teclado numérico e joystick analógico (sem autocentragem), algo avançado para 1982.',
      'Era backward-compatible com jogos do Atari 2600 através de um adaptador vendido separadamente.',
      'Seu design foi inspirado no computador Atari 400, compartilhando a mesma arquitetura interna.'
    ],
    emulators: ['Atari800', 'Altirra', 'MAME']
  },
  'atari_7800': {
    curiosities: [
      'O Atari 7800 foi o primeiro console da Atari com total compatibilidade com o Atari 2600 nativamente (sem adaptador).',
      'Foi anunciado em 1984 mas só lançado em 1986 devido à venda da Atari para a Jack Tramiel.',
      'Seu processador gráfico MARIA era capaz de exibir até 256 cores, muito superior ao Atari 2600.'
    ],
    emulators: ['ProSystem', 'MAME']
  },
  'atari_jaguar': {
    curiosities: [
      'O Atari Jaguar foi anunciado como o primeiro console "64-bit" do mundo, embora apenas duas de suas unidades de processamento fossem realmente de 64 bits.',
      'Seu controle tinha um teclado numérico completo de 12 teclas, algo bizarro para um console de videogame.',
      'Vendeu menos de 250 mil unidades, sendo um dos maiores fracassos comerciais da história dos games.'
    ],
    emulators: ['Virtual Jaguar', 'Phoenix', 'MAME']
  },
  'commodore_amiga': {
    curiosities: [
      'O Amiga 1000 foi lançado em 1985 com capacidades multimídia very superiores a qualquer outro computador pessoal da época.',
      'O sistema operacional AmigaOS foi um dos primeiros com true preemptive multitasking para computadores domésticos.',
      'A "Amiga Demo Scene" foi uma das comunidades criativas mais influentes, produzindo demos que empurravam o hardware ao limite.'
    ],
    emulators: ['WinUAE', 'FS-UAE', 'PUAE (RetroArch)']
  },
  'atari_800': {
    curiosities: [
      'A linha Atari 800 foi projetada com chips dedicados para gráficos (ANTIC, GTIA) e som (POKEY), liberando o processador principal.',
      'O sistema operacional do Atari 800 ficava em cartucho, permitindo diferentes versões e atualizações.',
      'Foi usado pela NASA como estação de trabalho gráfica para processar imagens de satélite.'
    ],
    emulators: ['Atari800', 'Altirra']
  },
  'sony_playstation': {
    curiosities: [
      'O PlayStation nasceu de uma parceria fracassada entre Sony e Nintendo para criar um CD-ROM para o SNES.',
      'Foi o primeiro console a vender mais de 100 milhões de unidades, estabelecendo a Sony como gigante dos games.',
      'Seu controle com dois manípulos (Dual Analog em 1997, depois DualShock) tornou-se o padrão da indústria.'
    ],
    emulators: ['DuckStation', 'ePSXe', 'PCSX-Redux', 'Mednafen', 'Beetle PSX (RetroArch)']
  },
  'snes': {
    curiosities: [
      'O SNES vendeu 49 milhões de unidades mundialmente, dominando a geração 16-bit ao lado do Mega Drive.',
      'Usava a técnica de "Mode 7" para criar efeitos de rotação e scaling em 2D, como visto em Super Mario Kart e F-Zero.',
      'O chip Super FX embutido em cartuchos como Star Fox permitia processamento 3D auxiliar.'
    ],
    emulators: ['Snes9x', 'zsnes', 'bsnes', 'Mesen 2', 'Snes9x (RetroArch)']
  },
  'amstrad_cpc': {
    curiosities: [
      'O Amstrad CPC foi projetado como um sistema completo (monitor + CPU + gravador cassete) "tudo-em-um", rivalizando com o ZX Spectrum e Commodore 64.',
      'O nome CPC vinha de "Colour Personal Computer" mas também era vendido em versões monocromáticas (CPC664).',
      'Sua biblioteca de jogos inclui títulos icônicos como "Chase HQ" e "RoboCop", populares no mercado europeu.'
    ],
    emulators: ['WinAPE', 'Caprice32', 'Arnold', 'CrocoDS']
  },
  'dreamcast': {
    curiosities: [
      'O Dreamcast foi o primeiro console da sexta geração e o último da Sega, lançado em 1998 no Japão.',
      'Inovava com modem de 56k embutido para jogos online e navegação na internet, algo pioneiro em consoles.',
      'Apesar de seu fim precoce em 2001, possui uma biblioteca cult com jogos como Shenmue, SoulCalibur e Jet Set Radio.'
    ],
    emulators: ['Flycast', 'Redream', 'Demul', 'Reicast (RetroArch)']
  },
  'fairchild_channel_f': {
    curiosities: [
      'O Fairchild Channel F foi o primeiro console da história a usar cartuchos programáveis (ROM), revolucionando a indústria.',
      'Seu controle incorporava um joystick que também funcionava como "paddle", e o console tinha capacidade gráfica de 4 bits.',
      'Foi lançado em 1976, um ano antes do Atari 2600, mas não conseguiu o mesmo sucesso comercial.'
    ],
    emulators: ['MAME', 'MESS']
  },
  'gamecube': {
    curiosities: [
      'O GameCube foi o primeiro console da Nintendo a usar mídia óptica (discos mini-DVD de 8 cm).',
      'Usava um processador PowerPC 750CXe (Gekko) a 485 MHz, fruto da parceria IBM-Nintendo que culminaria no Wii e Wii U.',
      'O controle do GameCube, com seu design ergonômico único, é até hoje usado em torneios de Super Smash Bros. Melee.'
    ],
    emulators: ['Dolphin']
  },
  'colecovision': {
    curiosities: [
      'O ColecoVision oferecia a experiência de arcade mais fiel de sua época, com ports quase idênticos aos fliperamas.',
      'Vinha com o clássico "Donkey Kong" incluído na memória, cortesia da licença com a Nintendo.',
      'Seu módulo de expansão permitia jogar cartuchos do Atari 2600, mas foi removido por ação judicial.'
    ],
    emulators: ['MAME', 'ColEm', 'blueMSX']
  },
  'dos': {
    curiosities: [
      'O MS-DOS (Microsoft Disk Operating System) foi o sistema operacional padrão para PCs entre 1981 e meados dos anos 90.',
      'Jogos DOS exigiam configurações manuais de IRQ, DMA e endereços de memória para placas de som como Sound Blaster.',
      'Títulos clássicos como DOOM, Civilization e Monkey Island foram desenvolvidos originalmente para DOS.'
    ],
    emulators: ['DOSBox', 'DOSBox Staging', 'DOSBox-X']
  },
  'commodore_64': {
    curiosities: [
      'O Commodore 64 é o computador doméstico mais vendido da história, com mais de 12 milhões de unidades.',
      'Seu chip de som SID (Sound Interface Device) era tão avançado que possui uma cena musical ativa até hoje (SID music).',
      'Seu processador MOS 6510 rodava a apenas 1 MHz, mas arquitetura eficiente permitia jogos impressionantes para a época.'
    ],
    emulators: ['VICE', 'CCS64', 'Frodo']
  },
  'sony_psp': {
    curiosities: [
      'O PSP foi o primeiro portátil a usar UMD (Universal Media Disc), uma mídia óptica proprietária de 1.8 GB.',
      'Sua tela widescreen de 4.3 polegadas era considerada enorme para um portátil em 2004.',
      'A Sony vendeu mais de 80 milhões de unidades do PSP, tornando-o o portátil mais bem-sucedido fora da Nintendo.'
    ],
    emulators: ['PPSSPP']
  },
  'pc88': {
    curiosities: [
      'O PC-88 foi um dos primeiros computadores japoneses a suportar gráficos coloridos, tornando-se referência para jogos eroge e visual novels.',
      'A série PC-8801 foi fabricada pela NEC e dominou o mercado japonês nos anos 80, rivalizando com o MSX.',
      'Jogos como "The Revenge of the Sunfish" e "Hydlide" foram lançados originalmente para PC-88.'
    ],
    emulators: ['MAME', 'Neko Project II', 'XM8']
  },
  'pc98': {
    curiosities: [
      'O PC-98 da NEC foi o computador pessoal dominante no Japão durante as décadas de 80 e 90, com uma biblioteca massiva de jogos exclusivos.',
      'Muitos jogos clássicos da franquia Touhou Project foram originalmente lançados para PC-98.',
      'Usava uma resolução de vídeo de 640x400, superior ao padrão VGA da época.'
    ],
    emulators: ['Neko Project II', 'T98-Next', 'MAME']
  },
  'daphne': {
    curiosities: [
      'Daphne é um emulador especializado para jogos laserdisc, que usavam filmes pré-gravados em vez de gráficos gerados por computador.',
      'Jogos como Dragon\'s Lair e Space Ace usavam discos laserdisc para reproduzir animações de alta qualidade.',
      'O processo de emulação é único pois precisa sincronizar o vídeo com as decisões do jogador em tempo real.'
    ],
    emulators: ['Daphne', 'Singe (Daphne)']
  },
  'apple_ii': {
    curiosities: [
      'O Apple II foi um dos primeiros computadores pessoais com suporte a gráficos coloridos e som integrado.',
      'A planilha eletrônica VisiCalc, criada originalmente para Apple II, foi o "aplicativo matador" que justificou a compra do computador para empresas.',
      'Steve Wozniak projetou o Apple II quase sozinho, escrevendo o sistema operacional e o interpretador BASIC integrado.'
    ],
    emulators: ['AppleWin', 'MAME', 'LinApple']
  },
  'doom': {
    curiosities: [
      'O termo "Doom" neste contexto refere-se ao motor de jogo (Doom Engine) e seus derivados rodando em plataformas clássicas.',
      'O Doom original foi tão influente que popularizou o gênero FPS e estabeleceu padrões como deathmatch multiplayer.',
      'O código-fonte do Doom foi liberado sob licença GPL em 1997, gerando incontáveis ports para praticamente qualquer plataforma existente.'
    ],
    emulators: ['GZDoom', 'PrBoom+', 'Chocolate Doom', 'Crispy Doom']
  },
  'nintendo_ds': {
    curiosities: [
      'O Nintendo DS vendeu impressionantes 154 milhões de unidades, tornando-se o console mais vendido da Nintendo (até o Switch).',
      'Sua tela dupla (sendo uma touchscreen) permitiu inovações como em "The World Ends With You" e "Phoenix Wright".',
      'O conector Game Boy Advance na parte inferior permitia usar cartuchos GBA como acessórios em alguns jogos.'
    ],
    emulators: ['DeSmuME', 'MelonDS', 'Drastic (Android)', 'MelonDS (RetroArch)']
  },
  'sharp_x1': {
    curiosities: [
      'O Sharp X1 foi um computador japonês dos anos 80 conhecido por sua arquitetura única e jogos exclusivos.',
      'Utilizava um sistema de cores peculiar com paletas separadas para texto e gráficos.',
      'Possuía uma biblioteca considerável de jogos, muitos deles da desenvolvedora Game Arts.'
    ],
    emulators: ['MAME', 'X1 Millennium', 'XM8']
  },
  'fds': {
    curiosities: [
      'O Famicom Disk System usava diskettes Quick Disk de 2.8 polegadas com capacidade de 128 KB por lado.',
      'Os diskettes permitiam saves nativos, algo revolucionário para a época, já que os cartuchos do NES não tinham bateria interna.',
      'As estações de diskettes (Disk Writer) instaladas em lojas permitiam regravar jogos por 500 ienes, funcionando como uma loja digital antecipada.'
    ],
    emulators: ['Mesen', 'FCEUX', 'Nestopia']
  },
  'vectrex': {
    curiosities: [
      'O Vectrex é o único console doméstico que usava um monitor vetorial (como osciloscópio) em vez de raster.',
      'Vinha com um jogo integrado (Mine Storm) e seu display era monocromático, mas usava overlays de plástico colorido para simular cores.',
      'Seu controlador analógico tinha um botão no topo e era armazenado no próprio console.'
    ],
    emulators: ['ParaJVE', 'DVE', 'MAME']
  },
  'game_boy': {
    curiosities: [
      'O Game Boy vendeu mais de 118 milhões de unidades (somando todas as variantes), incluindo o Pocket e Color.',
      'Seu processador Z80-like rodava a apenas 4.19 MHz e a tela era um LCD reflexivo sem backlight monocromático de 4 tons de cinza.',
      'Tetris, o jogo mais associado ao Game Boy, foi o principal responsável pelo sucesso do portátil.'
    ],
    emulators: ['Gambatte', 'BGB', 'VisualBoyAdvance', 'mGBA', 'Gambatte (RetroArch)']
  },
  'game_boy_advance': {
    curiosities: [
      'O GBA era retrocompatível com jogos de Game Boy e Game Boy Color, formando a maior biblioteca de jogos de qualquer portátil até então.',
      'O modelo SP (2003) introduziu tela iluminada frontalmente e bateria recarregável de íon-lítio, corrigindo a maior crítica ao modelo original.',
      'Seu processador ARM7TDMI de 32 bits a 16.78 MHz permitia ports impressionantes de jogos de SNES e PlayStation.'
    ],
    emulators: ['mGBA', 'VisualBoyAdvance-M', 'Medusa (RetroArch)']
  },
  'game_boy_color': {
    curiosities: [
      'O Game Boy Color foi o primeiro portátil da Nintendo com tela colorida (LCD TFT de 56×256 pixels).',
      'Oferecia retrocompatibilidade total com a biblioteca do Game Boy original, com opção de aplicar paletas de 10 cores.',
      'Possuía um processador atualizado que rodava jogos exclusivos com gráficos coloridos e sem as limitações do GB original.'
    ],
    emulators: ['Gambatte', 'BGB', 'SameBoy', 'TGB Dual']
  },
  'sega_genesis': {
    curiosities: [
      'O Sega Genesis (Mega Drive) foi o primeiro console verdadeiramente 16-bit, lançado em 1988 no Japão, um ano antes do SNES.',
      'Seu processador Motorola 68000 a 7.67 MHz era significativamente mais rápido que o Z80 do Master System.',
      'O marketing "Genesis does what Nintendon\'t" da Sega nos EUA é considerado uma das campanhas mais agressivas e memoráveis da história dos videogames.'
    ],
    emulators: ['Kega Fusion', 'BlastEm', 'Gens', 'Picodrive (RetroArch)', 'Genesis Plus GX (RetroArch)']
  },
  'game_gear': {
    curiosities: [
      'O Game Gear consumia 6 pilhas AA que duravam apenas 3-4 horas, tornando seu uso portátil bastante limitado.',
      'Era essencialmente um Master System portátil com tela colorida, podendo jogar a mesma biblioteca via adaptador.',
      'A Sega lançou um módulo de TV para o Game Gear, transformando-o em uma mini TV portátil.'
    ],
    emulators: ['Kega Fusion', 'SMS Plus', 'Genesis Plus GX (RetroArch)']
  },
  'playstation_2': {
    curiosities: [
      'O PlayStation 2 é o console mais vendido da história com mais de 155 milhões de unidades.',
      'Seu Emotion Engine foi tão poderoso que governos compraram unidades para simulações científicas e militares.',
      'O PS2 também funcionava como leitor de DVD, algo que ajudou a popularizar o formato e justificava seu preço agressivo.'
    ],
    emulators: ['PCSX2']
  },
  'intellivision': {
    curiosities: [
      'O Intellivision foi o primeiro console a competir diretamente com o Atari 2600, com gráficos superiores e som mais rico.',
      'Seu controle circular com discos numerados de 0-9 e teclas laterais era único e considerado complexo para a época.',
      'A Mattel criou um serviço de download de jogos via linha telefônica (PlayCable) em 1981, um precursor dos serviços digitais.'
    ],
    emulators: ['Nostalgia', 'MAME', 'jzIntv']
  },
  'atari_jaguar_cd': {
    curiosities: [
      'O Jaguar CD foi um periférico lançado em 1995 que adicionava leitor de CD-ROM ao Atari Jaguar.',
      'Apenas 13 jogos foram lançados no formato CD para o Jaguar, tornando-o uma das bibliotecas mais raras da história.',
      'O periférico era notório por seu design em forma de "vaso sanitário" e por exigir um cartucho "boot" especial.'
    ],
    emulators: ['Virtual Jaguar']
  },
  'atari_lynx': {
    curiosities: [
      'O Atari Lynx foi o primeiro portátil com tela colorida LCD e iluminação de fundo (backlit), algo revolucionário em 1989.',
      'Permitia conectividade entre 8 jogadores via "ComLynx", uma interface serial proprietária.',
      'Era tecnicamente superior ao Game Boy da Nintendo, mas seu alto preço e baixa duração de bateria limitaram seu sucesso.'
    ],
    emulators: ['Handy', 'Mednafen', 'Felix']
  },
  'sega_naomi': {
    curiosities: [
      'A NAOMI (New Arcade Operation Machine Idea) era a placa de arcade da Sega que sucedeu a Model 3, baseada no hardware do Dreamcast.',
      'Utilizava cartões GD-ROM como mídia, com capacidade de 1 GB, e podia ser ligada em rede para jogos multiplayer.',
      'Jogos como Crazy Taxi e Virtua Tennis rodavam em placas NAOMI e eram ports quase idênticos aos de Dreamcast.'
    ],
    emulators: ['Flycast', 'Demul']
  },
  'game_and_watch': {
    curiosities: [
      'O Game & Watch foi criado por Gunpei Yokoi e seu conceito de "tecnologia madura" influenciou toda a filosofia de design da Nintendo.',
      'Cada modelo tinha um único jogo em LCD segmentado (não pixels), com molduras decorativas que imitavam o tema do jogo.',
      'O direcional em formato de "cruz" (D-Pad) foi inventado por Yokoi para o Game & Watch, tornando-se padrão da indústria.'
    ],
    emulators: ['MAME', 'Handheld Electronic (RetroArch)']
  },
  'pokemon_mini': {
    curiosities: [
      'O Pokémon Mini foi o menor console da história da Nintendo, com apenas 7,4 cm de largura.',
      'Seu display LCD monocromático de 96×64 pixels e vibração integrada eram avançados para um brinquedo de 2001.',
      'Apesar do tamanho, recebeu 10 jogos oficiais, todos envolvendo minigames do universo Pokémon.'
    ],
    emulators: ['PokeMini', 'MAME']
  },
  'atari_st': {
    curiosities: [
      'O Atari ST foi o primeiro computador pessoal com interface gráfica colorida integrada (GEM) a um preço acessível.',
      'Sua porta MIDI integrada tornou-o o computador preferido de músicos e estúdios de gravação nos anos 80/90.',
      'O Cubase, um dos primeiros DAWs (Digital Audio Workstations), foi lançado originalmente para Atari ST.'
    ],
    emulators: ['Hatari', 'Steem SSE', 'Aranym']
  },
  'msx': {
    curiosities: [
      'O MSX foi um padrão de computador doméstico criado pela Microsoft (Kazuhiko Nishi) e ASCII Corporation, com vários fabricantes.',
      'Metal Gear (1987) foi lançado originalmente para MSX2, antes de suas versões para NES e outros sistemas.',
      'No Japão e Coreia, o MSX foi extremamente popular, com uma vasta biblioteca de jogos e softwares educacionais.'
    ],
    emulators: ['blueMSX', 'openMSX', 'C-BIOS', 'MSX.emu']
  },
  'msx2': {
    curiosities: [
      'O MSX2 melhorou significativamente o MSX original com resolução de vídeo de 512×212 e paleta de 512 cores.',
      'Sua biblioteca inclui clássicos como Snatcher (Hideo Kojima) e Aleste, com gráficos comparáveis ao PC Engine.',
      'O padrão MSX2 foi amplamente adotado no Japão, Brasil, Coreia e Europa, com fabricantes como Sony, Panasonic e Philips.'
    ],
    emulators: ['blueMSX', 'openMSX', 'C-BIOS']
  },
  'nintendo_64': {
    curiosities: [
      'O Nintendo 64 foi o primeiro console com controle analógico (tridimensional) integrado ao gamepad.',
      'Manteve o uso de cartuchos (em vez de CD), o que limitava armazenamento mas eliminava loading times.',
      'Super Mario 64 estabeleceu o padrão de design para jogos 3D que influencia desenvolvedores até hoje.'
    ],
    emulators: ['Project64', 'Mupen64Plus', 'RMG', 'Parallel RDP (RetroArch)']
  },
  'nintendo_switch': {
    curiosities: [
      'O Nintendo Switch vendeu mais de 130 milhões de unidades, tornando-se o console mais vendido da Nintendo e terceiro da história.',
      'Seu conceito híbrido (portátil + dock) foi inspirado no Nintendo DS e no Wii U, combinando o melhor de ambos.',
      'The Legend of Zelda: Breath of the Wild foi um título de lançamento e é considerado um dos maiores jogos já feitos.'
    ],
    emulators: ['Ryujinx', 'Yuzu', 'SuYU']
  },
  'neo_geo': {
    curiosities: [
      'O Neo Geo AES (console doméstico) custava $650 em 1990, com cartuchos chegando a $300, sendo considerado um console de luxo.',
      'A placa de arcade MVS permitia que até 6 jogos diferentes fossem inseridos em um mesmo gabinete simultaneamente.',
      'A SNK continuou lançando jogos para Neo Geo até 2004 — mais de uma década após o auge do console.'
    ],
    emulators: ['FinalBurn Neo', 'MAME', 'NeoCD', 'NeoGeo EMU']
  },
  'nes': {
    curiosities: [
      'O NES revitalizou a indústria dos videogames após a crise de 1983, estabelecendo novas regras de licenciamento para terceiros.',
      'O famoso "Super Mario Bros." foi incluído como pack-in, tornando-se o jogo mais vendido do console (40 milhões de cópias).',
      'A Nintendo implementou o sistema de bloqueio 10NES, um chip de criptografia que impedia cartuchos não licenciados.'
    ],
    emulators: ['Mesen', 'FCEUX', 'Nestopia', 'Mesen 2', 'FCEUmm (RetroArch)']
  },
  'neo_geo_pocket_color': {
    curiosities: [
      'O Neo Geo Pocket Color foi lançado em 1999 como sucessor do NGPC monocromático, com tela colorida de 256×256.',
      'Oferecia um stick analógico miniaturizado (click-stick) no canto inferior direito, único entre portáteis.',
      'A SNK licenciou o portátil para empresas como Sega, mas o fim da SNK em 2001 interrompeu seu desenvolvimento.'
    ],
    emulators: ['NeoPop', 'Mednafen', 'Beetle NGPC (RetroArch)']
  },
  'neo_geo_pocket': {
    curiosities: [
      'O Neo Geo Pocket original foi lançado apenas em preto-e-branco e teve vida curta, substituído pelo NGPC Color menos de um ano depois.',
      'A SNK lançou o portátil para competir com o Game Boy Color, mas seu lançamento no ocidente foi limitado.',
      'Apenas 7 jogos foram lançados para o NGPC monocromático antes do modelo colorido assumir.'
    ],
    emulators: ['NeoPop', 'Mednafen']
  },
  'lowres_nx': {
    curiosities: [
      'O LowRes NX é um console caseiro de código aberto baseado no microcontrolador Teensy, com resolução de 64×64 pixels.',
      'Seu desenvolvimento foi inspirado em computadores 8-bit e consoles clássicos, com limitações criativas intencionais.',
      'Os jogos são escritos em C++ usando uma API simples, ideal para aprendizado de desenvolvimento de jogos.'
    ],
    emulators: ['LowRes NX Emulator (oficial)']
  },
  'sinclair_zx81': {
    curiosities: [
      'O ZX81 sucedeu o ZX80 e foi um dos computadores mais baratos de seu tempo, vendido como kit para montar por £49.95.',
      'Usava o processador Z80A a 3.25 MHz, o mesmo que alimentava o Game Boy e muitos outros sistemas.',
      'Seu teclado de membrana era notoriamente desconfortável, mas o preço acessível tornou-o um sucesso de vendas no Reino Unido.'
    ],
    emulators: ['EightyOne', 'ZX81 (RetroArch)', 'VB81']
  },
  'pico8': {
    curiosities: [
      'O PICO-8 é uma "fantasy console" criada por Joseph White (Lexaloffle) com resolução de 128×128 pixels e paleta de 16 cores.',
      'As limitações propositais (32 KB de código, 4 canais de som, 64 sprites) estimulam a criatividade de desenvolvedores.',
      'Jogos como Celeste foram originalmente criados para PICO-8 em game jams antes de se tornarem sucessos comerciais.'
    ],
    emulators: ['PICO-8 (nativo)', 'Retro8 (RetroArch)', 'Picolove']
  },
  'pc_engine': {
    curiosities: [
      'O PC Engine (TurboGrafx-16) foi o primeiro console 16-bit do mundo, lançado em 1987 no Japão pela NEC e Hudson Soft.',
      'Era incrivelmente compacto para a época, usando o formato "HuCard" similar a um cartão de crédito.',
      'Seu chip gráfico HuC6270 permitia 482 cores simultâneas de uma paleta de 512, superior ao NES da época.'
    ],
    emulators: ['Mednafen', 'BizHawk', 'Ootake', 'Beetle PCE (RetroArch)']
  },
  'playstation_3': {
    curiosities: [
      'O PlayStation 3 usava o processador Cell (PowerPC-based) de 8 núcleos, tão complexo que muitos desenvolvedores tinham dificuldade de programar para ele.',
      'A Sony vendeu o PS3 com prejuízo inicial de $250 por unidade, apostando no retorno via royalties de jogos.',
      'O console foi usado em supercomputação: um cluster de PS3 foi usado pela Força Aérea dos EUA para processamento de radar.'
    ],
    emulators: ['RPCS3']
  },
  'sony_playstation_2': {
    curiosities: [
      'O PS2 foi lançado em 2000 com suporte a DVD, tornando-se um dos players de DVD mais baratos do mercado e impulsionando suas vendas.',
      'Seu Emotion Engine era tão flexível que foi usado no desenvolvimento do Supercomputer Cell do PS3.',
      'A biblioteca do PS2 contém mais de 4.000 títulos, uma das maiores de qualquer console.'
    ],
    emulators: ['PCSX2']
  },
  'wii_u': {
    curiosities: [
      'O Wii U vendeu apenas 13 milhões de unidades, sendo o console mais fracassado da Nintendo (até então).',
      'Seu GamePad com tela de 6.2 polegadas permitia jogo assimétrico entre o tablet e a TV.',
      'Muitos de seus jogos first-party (Mario Kart 8, Splatoon) foram relançados no Switch como "Deluxe", vendendo muito mais.'
    ],
    emulators: ['Cemu']
  },
  'sega_saturn': {
    curiosities: [
      'O Sega Saturn tinha uma arquitetura complexa com dois CPUs Hitachi SH-2 e 6 outros processadores dedicados.',
      'Foi um fracasso comercial no ocidente (9 milhões vendidos) mas fez sucesso no Japão, especialmente com jogos de luta e bullet hell.',
      'O cancelamento precoce do Sonic X-treme para Saturn é considerado um dos fatores que levaram a Sega a sair do mercado de consoles.'
    ],
    emulators: ['Mednafen', 'SSF', 'Yabause', 'Kronos', 'Beetle Saturn (RetroArch)']
  },
  'zx_spectrum': {
    curiosities: [
      'O ZX Spectrum foi o computador mais vendido no Reino Unido nos anos 80 e sua biblioteca de jogos é considerada uma das mais criativas.',
      'Seu display de 256×192 pixels com atributos de cor por bloco de 8×8 causava o famoso "color clash", onde sprites mudavam de cor em contato com fundos.',
      'Sir Clive Sinclair, seu criador, também desenvolveu o C5, um veículo elétrico pessoal que foi um fracasso comercial.'
    ],
    emulators: ['Fuse', 'ZEsarUX', 'Spectaculator', 'Fuse (RetroArch)']
  },
  'sega_sg1000': {
    curiosities: [
      'O SG-1000 foi o primeiro console da Sega, lançado em 1983 no Japão, no mesmo dia que o Famicom da Nintendo.',
      'Era essencialmente um SC-3000 (computador) sem teclado, usando o processador Z80A.',
      'Seus controles usavam conectores de 9 pinos que se tornariam padrão para toda a linha Sega (Master System, Genesis).'
    ],
    emulators: ['MAME', 'blueMSX', 'Genesis Plus GX (RetroArch)']
  },
  'master_system': {
    curiosities: [
      'O Master System vendeu muito bem no Brasil (quase 8 milhões), onde a Tectoy o produziu localmente até os anos 2000.',
      'Era tecnicamente superior ao NES em vários aspectos (mais RAM, mais cores), mas perdeu a guerra de vendas para o console da Nintendo.',
      'O Brasil foi o único país onde o Master System superou o NES em vendas, graças à agressiva distribuição da Tectoy.'
    ],
    emulators: ['Kega Fusion', 'Meka', 'SMS Plus', 'Genesis Plus GX (RetroArch)']
  },
  'bbc_micro': {
    curiosities: [
      'O BBC Micro foi encomendado pela BBC para o projeto "BBC Computer Literacy Project", educando uma geração de programadores ingleses.',
      'Foi o computador onde a palavra "micro" no nome referia-se ao processador 6502, o mesmo do Apple II.',
      'A lendária desenvolvedora Acorn usou o BBC Micro para prototipar a arquitetura ARM, que hoje domina o mercado mobile.'
    ],
    emulators: ['BeebEm', 'B-Em', 'Model B (RetroArch)']
  },
  'scummvm': {
    curiosities: [
      'ScummVM não é um sistema, mas um motor de reimplementação que permite rodar aventuras gráficas clássicas em sistemas modernos.',
      'Originalmente criado para rodar jogos SCUMM da LucasArts (Monkey Island, Day of the Tentacle), hoje suporta centenas de engines.',
      'O nome vem de "Script Creation Utility for Maniac Mansion Virtual Machine", o engine usado por Maniac Mansion.'
    ],
    emulators: ['ScummVM (aplicativo nativo)']
  },
  'watara_supervision': {
    curiosities: [
      'O Watara Supervision foi um portátil chinês lançado em 1992 para competir com o Game Boy.',
      'Seu display LCD de 160×160 pixels era monocromático, com 4 tons de cinza, similar ao Game Boy.',
      'Apenas cerca de 60 jogos foram lançados, muitos deles clones de sucessos do NES e Game Boy.'
    ],
    emulators: ['MAME', 'Potator']
  },
  'tic80': {
    curiosities: [
      'O TIC-80 é uma "fantasy computer" gratuita e de código aberto com resolução de 240×136 pixels e 16 cores.',
      'Suporta múltiplas linguagens de programação: Lua, Javascript, MoonScript, Fennel, Wren, Squirrel e Python.',
      'Jogos criados no TIC-80 podem ser exportados como HTML para jogar no navegador.'
    ],
    emulators: ['TIC-80 (nativo)']
  },
  'pcfx': {
    curiosities: [
      'O PC-FX foi o último console da NEC, lançado em 1994 como sucessor do PC Engine.',
      'Usava exclusivamente CD-ROM como mídia e tinha foco em jogos com animações FMV (full motion video).',
      'Foi um fracasso comercial, com apenas 62 jogos lançados e estimativas de menos de 100 mil unidades vendidas.'
    ],
    emulators: ['Mednafen', 'BizHawk', 'MAME']
  },
  'virtual_boy': {
    curiosities: [
      'O Virtual Boy foi o console mais fracassado da Nintendo, vendendo apenas 770 mil unidades em 1995-1996.',
      'Usava um display estereoscópico LED monocromático (vermelho) que projetava imagens 3D em cada olho.',
      'A Nintendo o descontinuou menos de um ano após o lançamento, e Gunpei Yokoi (seu criador) deixou a Nintendo logo depois.'
    ],
    emulators: ['Mednafen', 'VBjin', 'Beetle VB (RetroArch)']
  },
  'playstation_vita': {
    curiosities: [
      'O PS Vita usava um cartão de memória proprietário da Sony, notoriamente caro e que limitava a adoção do portátil.',
      'Possuía tela OLED (no modelo 1000) de 5 polegadas com 960×544 pixels, a melhor de qualquer portátil em 2011.',
      'Seu touchpad traseiro permitia interações únicas como em Tearaway e Uncharted: Golden Abyss.'
    ],
    emulators: ['Vita3k', 'Ryujinx (parcial)']
  },
  'wasm4': {
    curiosities: [
      'WASM-4 é uma "fantasy console" moderna que usa WebAssembly como formato de jogo.',
      'Sua resolução é de 160×160 pixels com paleta de 4 cores, lembrando consoles portáteis clássicos.',
      'Os jogos podem ser escritos em Rust, Go, C/C++, AssemblyScript ou qualquer linguagem que compile para WebAssembly.'
    ],
    emulators: ['WASM-4 (nativo)', 'Navegador (WebAssembly)']
  },
  'wii': {
    curiosities: [
      'O Wii vendeu mais de 101 milhões de unidades, tornando-se o console mais vendido da Nintendo em sua época.',
      'Seu controle remoto (Wii Remote) com sensor de movimento popularizou os controles motion entre o público casual.',
      'O Wii era retrocompatível com todos os jogos de GameCube e usava o processador PowerPC Broadway de 729 MHz.'
    ],
    emulators: ['Dolphin']
  },
  'wonderswan': {
    curiosities: [
      'O WonderSwan foi o último console projetado por Gunpei Yokoi antes de sua morte em 1997.',
      'Foi lançado pela Bandai e tinha tela LCD monocromática de 224×144 pixels com 4 tons de cinza.',
      'No Japão, o WonderSwan vendeu bem graças a jogos licenciados de anime como One Piece e Gundam.'
    ],
    emulators: ['Mednafen', 'BizHawk', 'Cygne', 'Beetle WS (RetroArch)']
  },
  'wonderswan_color': {
    curiosities: [
      'O WonderSwan Color foi lançado em 2000 com tela colorida e retrocompatibilidade com todos os jogos do WonderSwan original.',
      'A Bandai conseguiu uma parceria com a Square para lançar ports de Final Fantasy I, II, IV e uma versão exclusiva de Final Fantasy X.',
      'Apesar do sucesso no Japão, nunca foi lançado oficialmente no ocidente.'
    ],
    emulators: ['Mednafen', 'BizHawk', 'Cygne', 'Beetle WS (RetroArch)']
  },
  'xbox_360': {
    curiosities: [
      'O Xbox 360 sofreu com o problema do "Red Ring of Death", uma falha de hardware que afetou milhões de unidades e custou $1 bilhão à Microsoft.',
      'O Kinect, lançado em 2010 para o Xbox 360, foi o periférico mais vendido da história (24 milhões em 60 dias).',
      'O Xbox Live Arcade revitalizou o mercado de jogos indie com títulos como Braid, Limbo e Super Meat Boy.'
    ],
    emulators: ['Xenia']
  },
  'xbox': {
    curiosities: [
      'O Xbox original foi o primeiro console da Microsoft, lançado em 2001 para competir com PS2 e GameCube.',
      'Seu processador Intel Pentium III de 733 MHz e GPU GeForce 3 derivada o tornavam o console mais potente de sua geração.',
      'O jogo "Halo: Combat Evolved" foi o título mais vendido do console e estabeleceu a franquia que definiu a marca Xbox.'
    ],
    emulators: ['Cxbx-Reloaded', 'XQEMU']
  },
  'apple_iigs': {
    curiosities: [
      'O Apple IIGS foi o último modelo da linha Apple II, lançado em 1986 com som e gráficos significativamente melhorados.',
      'O "GS" no nome significava "Graphics & Sound", destacando as capacidades multimídia do computador.',
      'Usava um processador 65C816 a 2.8 MHz (o mesmo do SNES) e era compatível com software Apple II e IIe.'
    ],
    emulators: ['GSport', 'KEGS', 'MAME']
  },
  '3do': {
    curiosities: [
      'O 3DO Interactive Multiplayer foi criado por Dave Needle e RJ Mical (ex-engenheiros da Atari) e licenciado para vários fabricantes.',
      'Seu processador ARM60 RISC de 32 bits a 12.5 MHz era potente para 1993, mas o preço de $699 assustava consumidores.',
      'A 3DO Company faliu em 2003, mas seu nome vive no padrão de discos "3DO" usado em alguns jogos de PC.'
    ],
    emulators: ['Phoenix', 'Opera', '4DO', 'FreeDO']
  },
  'coleco_adam': {
    curiosities: [
      'O Coleco Adam foi um computador doméstico lançado em 1983 que também rodava cartuchos de ColecoVision e Atari 2600.',
      'Usava um gravador de cassete digital (Digital Data Drive) como armazenamento, proprietário e notoriamente lento.',
      'Foi um fracasso comercial, estimulado por recalls e problemas de fabricação, resultando na saída da Coleco do mercado de computadores.'
    ],
    emulators: ['MAME', 'ColEm', 'ADAMem']
  },
  'amiga_cd32': {
    curiosities: [
      'O Amiga CD32 foi o primeiro console de 32 bits da Europa e o sucessor espiritual do Amiga 1200 como console.',
      'Era essencialmente um Amiga 1200 sem teclado, usando o processador Motorola 68EC020 a 14 MHz.',
      'A Commodore faliu logo após seu lançamento em 1993, limitando severamente sua distribuição e biblioteca de jogos.'
    ],
    emulators: ['WinUAE', 'FS-UAE']
  },
  'vic20': {
    curiosities: [
      'O Commodore VIC-20 foi o primeiro computador da história a vender mais de 1 milhão de unidades.',
      'Seu processador MOS 6502 rodava a apenas 1.02 MHz e vinha com apenas 5 KB de RAM (3.5 KB utilizáveis).',
      'O VIC-20 era vendido por $299 e vinha com uma porta para conexão de TV, joystick e gravador cassete.'
    ],
    emulators: ['VICE', 'MAME']
  },
  'mame': {
    curiosities: [
      'MAME (Multiple Arcade Machine Emulator) é um dos projetos de software livre mais antigos e ambiciosos, emulando milhares de placas de arcade.',
      'O lema do projeto MAME é "documentar o hardware", priorizando precisão acima da performance de emulação.',
      'Iniciado por Nicola Salmoria em 1997, o MAME já emulou mais de 35.000 ROMs de diferentes placas de arcade.'
    ],
    emulators: ['MAME', 'MAMEUI', 'RetroArch (MAME Core)']
  },
  'neo_geo_cd': {
    curiosities: [
      'O Neo Geo CD foi lançado em 1994 como alternativa mais barata aos cartuchos do AES/MVS, mas com longos tempos de loading.',
      'Os CD-ROMs eram regraváveis e vendidos a um preço muito menor que os cartuchos, mas a lentidão do leitor (1x) prejudicava a experiência.',
      'A SNK lançou versões top-loading (1994), front-loading (1995) e CDZ (1996, com leitor 2x) para tentar corrigir os problemas.'
    ],
    emulators: ['NeoCD', 'FinalBurn Neo', 'MAME']
  },
  'pc_engine_cd': {
    curiosities: [
      'O PC Engine CD (CD-ROM²) foi o primeiro console a usar CD-ROM como mídia de jogos, lançado em 1988 no Japão.',
      'O sistema era um periférico que se acoplava ao PC Engine, usando um leitor de CD que consumia 6 pilhas AA.',
      'Jogos em CD permitiam voice acting, cutscenes animadas e trilha sonora em áudio digital, algo revolucionário para 1988.'
    ],
    emulators: ['Mednafen', 'BizHawk', 'Beetle PCE (RetroArch)']
  },
  'sega_cd': {
    curiosities: [
      'O Sega CD (Mega-CD) foi um periférico para o Genesis/Mega Drive que adicionava um leitor de CD-ROM de 1x.',
      'Usava um processador Motorola 68000 adicional a 12.5 MHz como coprocessador, tornando-o mais potente que o Genesis sozinho.',
      'Apesar de jogos como Sonic CD e Snatcher, a biblioteca era repleta de títulos FMV de baixa qualidade.'
    ],
    emulators: ['Kega Fusion', 'Picodrive (RetroArch)', 'Genesis Plus GX (RetroArch)']
  },
  'sharp_x68000': {
    curiosities: [
      'O Sharp X68000 foi o computador pessoal mais poderoso de sua época no Japão, com gráficos comparáveis a arcades de 1990.',
      'Usava dois processadores Hitachi HD68000 (um principal, um para I/O) a 10 MHz e resolução de 1024×512 pixels.',
      'Foi o sistema escolhido pela Capcom para desenvolvimento de jogos CPS-1 e CPS-2, sendo usado nas versões caseiras de Street Fighter II.'
    ],
    emulators: ['XM6', 'MAME', 'PX68K (RetroArch)']
  },
  'supergrafx': {
    curiosities: [
      'O SuperGrafx foi um upgrade do PC Engine lançado em 1989 com processador gráfico adicional HuC6270 para maior desempenho.',
      'Apenas 7 jogos foram lançados exclusivamente para SuperGrafx, tornando-o um dos consoles com menor biblioteca da história.',
      'Os jogos SuperGrafx são compatíveis com PC Engine, mas rodam com melhorias gráficas apenas no hardware SuperGrafx.'
    ],
    emulators: ['Mednafen', 'BizHawk', 'Beetle PCE (RetroArch)']
  },
  'sufami_turbo': {
    curiosities: [
      'O SuFami Turbo foi um periférico para o Super Famicom (SNES) que permitia conectar dois cartuchos simultaneamente.',
      'Apenas 5 cartuchos SuFami Turbo foram lançados, tornando-o um dos acessórios mais raros da Nintendo.',
      'A Bandai, que desenvolveu o sistema, criou jogos como "SD Gundam G NEXT" que usavam o slot extra para dados adicionais.'
    ],
    emulators: ['Snes9x', 'bsnes', 'Mesen 2']
  }
};

// ID aliases for systems whose JSON ids differ from the curated keys
const ID_ALIAS = {
  'amiga': 'commodore_amiga',
  'pc_88': 'pc88',
  'pc_98': 'pc98',
  'famicom_disk_system': 'fds',
  'game_&_watch': 'game_and_watch',
  'pokémon_mini': 'pokemon_mini',
  'pico_8': 'pico8',
  'sinclair_zx_spectrum': 'zx_spectrum',
  'sega_sg_1000': 'sega_sg1000',
  'tic_80': 'tic80',
  'pc_fx': 'pcfx',
  'wasm_4': 'wasm4',
  'commodore_amiga_cd32': 'amiga_cd32',
  'commodore_vic_20': 'vic20',
};

// Process all systems
data.systems = data.systems.map(system => {
  const key = ID_ALIAS[system.id] || system.id;
  const c = curated[key];
  if (c) {
    system.curiosities = c.curiosities;
    system.emulators = c.emulators;
  } else {
    system.curiosities = [];
    system.emulators = [];
  }
  return system;
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log(`Updated ${data.systems.length} systems.`);
console.log(`Systems with curated data: ${Object.keys(curated).length}`);
