# Memória Permanente

## Idioma
- Todos os comentários adicionados no código devem ser escritos em **pt-br** (português brasileiro).

## Padrão de Componentes
- **Styled Components** para todos os componentes. Separar estilos (`styles.ts`) da lógica (`Component.tsx`).
- Nunca usar `<style>` inline ou CSS-in-JS dentro do JSX. Todo estilo deve ficar em arquivos `styles.ts` separados.
- NENHUMA lógica de negócio, hooks ou estados do componente pode ser alterada ou perdida ao refactorar. O comportamento deve permanecer exatamente o mesmo.
- Componentes criados seguem o padrão: `src/components/NomeDoComponente/Component.tsx` + `styles.ts`.
