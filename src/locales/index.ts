import { ptBr } from './pt-br';

const locale = ptBr;

export function tGenre(genre: string): string {
  return genre
    .split(',')
    .map((g) => {
      const trimmed = g.trim();
      return (locale.genres as Record<string, string>)[trimmed] || trimmed;
    })
    .join(', ');
}

export function tSystem(system: string): string {
  return (locale.systems as Record<string, string>)[system] || system;
}
