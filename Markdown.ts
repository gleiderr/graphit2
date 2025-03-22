import { Expressão, Graphit, Id, Termo } from './Graphit';

type Stats = {
  termos: Id[];
  termosOcultos: Id[];
  expressões: Id[];
  expressõesOcultas: Id[];
};

export class Markdown {
  constructor(private graphit: Graphit) {}

  analisar(texto: string): Stats {
    const termos = new Set<Id>();
    const termosOcultos = new Set<Id>();
    const expressões = new Set<Id>();
    const expressõesOcultas = new Set<Id>();

    texto.split('\n').forEach(linha => {
      linha = linha.trim();
      if (linha.length === 0) return; // Ignora linhas vazias

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

  private analisarLinha(linha: string): Stats {
    const marksRegex = /\s*(#{1,6}|-|>|\d+\.)\s+(.+)/;
    const match = linha.match(marksRegex);
    let termos: Id[] = [];
    let termosOcultos: Id[] = [];
    let expressões: Id[] = [];
    let expressõesOcultas: Id[] = [];

    const texto = match ? match[2] : linha;
    if (this.graphit.tokenize(texto).length === 1) {
      const { id, pertence_a } = this.graphit.termo(texto);
      termos = [id];
      expressões = pertence_a;
    } else {
      const expressão = this.graphit.expressão(texto);
      termos = [...expressão.termos];
      termosOcultos = [...expressão.termosOcultos];
      expressões = [expressão.id, ...expressão.subexpressões];
      expressõesOcultas = [...expressão.expressõesOcultas];
    }

    return { termos, termosOcultos, expressões, expressõesOcultas };
  }

  markdown(nó: Termo | Expressão): string {
    if ('valor' in nó) {
      return `# ${nó.valor}\n\n`;
    } else {
      return 'this.graphit.get(nó.id).valor';
    }
  }
}
