import { Expressão, Id, Termo } from './Graphit';
import { Esquema, Markdown } from './Markdown';

export const esquemaBíblia: Esquema = {
  resetVisitados: false,
  nívelInicial: 0,

  descendentes(informação: Termo | Expressão): Id[] {
    return informação.contém;
  },

  getValor(markdown, informação) {
    const valor = markdown.graphit.getValor(informação);

    const refIds = getReferências(markdown, informação);
    if (refIds.length > 0) {
      const referências = refIds
        .map(i => markdown.graphit.get(i))
        .map(i => `${i.id}#${markdown.graphit.getValor(i)}`);
      return (
        valor + `<!-- (${[...markdown.escritos]}) ${referências.join('|')} -->`
      );
    }
    return valor;
  },
};

function getReferências(
  markdown: Markdown,
  informação: Termo | Expressão,
  ignorar = new Set<Id>()
): string[] {
  const referências = new Set<Id>();
  const stack = [informação];

  while (stack.length > 0) {
    const atual = stack.pop()!;
    if (ignorar.has(atual.id)) continue;

    ignorar.add(atual.id);

    atual.contidaEm.forEach(i => referências.add(i));
    if ('pertence_a' in atual) {
      atual.pertence_a.forEach(i => referências.add(i));
    } else {
      atual.subexpressãoDe.forEach(i => referências.add(i));
    }

    [...referências]
      .filter(i => !ignorar.has(i))
      .filter(i => !markdown.escritos.has(i))
      .map(i => markdown.graphit.get(i))
      .forEach(i => stack.push(i));
  }

  return [...referências].filter(i => !markdown.escritos.has(i));
}
