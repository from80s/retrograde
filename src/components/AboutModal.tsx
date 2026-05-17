import { motion } from 'framer-motion';
import { X, Github, Code, Award, Heart } from 'lucide-react';
import RetroGradeLogo from '../../assets/images/RetroGrade.png';

interface AboutModalProps {
  onClose: () => void;
  version: string;
}

export function AboutModal({ onClose, version }: AboutModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass rounded-2xl w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-100">Sobre</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-center">
          <img src={RetroGradeLogo} alt="RetroGrade" className="w-32 h-auto mx-auto" />
          
          <div className="space-y-2">
            <p className="text-zinc-300 text-sm leading-relaxed">
              RetroGrade é um curador inteligente de bibliotecas de jogos retrô, 
              projetado para ajudar você a organizar, limpar e preservar apenas os melhores clássicos da sua coleção.
            </p>
            <p className="text-xs text-zinc-500 font-mono">v{version}</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center gap-2 text-zinc-400">
              <Heart className="w-4 h-4 text-retro-danger" />
              <span>Criado por <span className="text-zinc-200 font-medium">Thiago Teles</span></span>
            </div>
            
            <a
              href="https://github.com/from80s/retrograde"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-retro-primary hover:underline transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Repositório no GitHub</span>
            </a>

            <a
              href="https://github.com/from80s/retrograde/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 hover:underline transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>MIT License</span>
            </a>
          </div>

          <div className="bg-zinc-800/30 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-center gap-2">
              <Code className="w-4 h-4" />
              Tecnologias
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {['Electron', 'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-zinc-700/50 rounded-lg text-xs text-zinc-300 border border-zinc-600/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
