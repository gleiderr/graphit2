import { Expressão, Graphit, Id, Termo } from './Graphit';

export class Markdown {
  constructor(private graphit: Graphit) {}

  analisar(texto: string): {
    termos: Id[];
    termosOcultos: Id[];
    expressões: Id[];
    expressõesOcultas: Id[];
  } {
    const termos = new Set<Id>();
    const termosOcultos = new Set<Id>();
    const expressões = new Set<Id>();
    const expressõesOcultas = new Set<Id>();

    texto.split('\n').forEach(linha => {
      const stats = this.analisarLinha(linha);

      stats.termos.forEach(termo => termos.add(termo));
      stats.termosOcultos.forEach(termo => termosOcultos.add(termo));
      stats.expressões.forEach(expressão => expressões.add(expressão));
      stats.expressõesOcultas.forEach(expressão =>
        expressõesOcultas.add(expressão)
      );
    });

    return {
      termos: Array.from(termos),
      termosOcultos: Array.from(termosOcultos),
      expressões: Array.from(expressões),
      expressõesOcultas: Array.from(expressõesOcultas),
    };
  }

  private analisarLinha(linha: string): {
    termos: Id[];
    termosOcultos: Id[];
    expressões: Id[];
    expressõesOcultas: Id[];
  } {
    if (linha.startsWith('# ')) {
      // Se for um título, remove o '# ' e registra o restante
      const título = linha.slice(2).trim();
      if (this.graphit.tokenize(título).length === 1) {
        const { id, pertence_a } = this.graphit.termo(título);
        return {
          termos: [id],
          expressões: pertence_a,
          termosOcultos: [],
          expressõesOcultas: [],
        };
      } else {
        const expressão = this.graphit.expressão(título);
        return {
          termos: expressão.termos,
          expressões: [expressão.id, ...expressão.subexpressões],
          termosOcultos: expressão.termosOcultos,
          expressõesOcultas: expressão.expressõesOcultas,
        };
      }
    }
    return {
      termos: [],
      termosOcultos: [],
      expressões: [],
      expressõesOcultas: [],
    };
  }

  markdown(nó: Termo | Expressão): string {
    if ('valor' in nó) {
      return `# ${nó.valor}\n\n`;
    } else {
      return 'this.graphit.get(nó.id).valor';
    }
  }
}
