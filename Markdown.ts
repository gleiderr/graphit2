import { Graphit, Id, Termo } from './Graphit';

type Stats = {
  termos: Id[];
  termosOcultos: Id[];
  expressões: Id[];
  expressõesOcultas: Id[];
};

type Texto = {
  texto: string;
  tipo: 'título' | 'lista' | 'parágrafo' | 'citação';
};

export class Markdown {
  constructor(private graphit: Graphit) {}

  analisar(texto: string): Stats {
    const termos = new Set<Id>();
    const termosOcultos = new Set<Id>();
    const expressões = new Set<Id>();
    const expressõesOcultas = new Set<Id>();

    const dependências: Texto[] = [];
    texto.split('\n').forEach(linha => {
      linha = linha.trim();
      if (linha.length === 0) return; // Ignora linhas vazias

      const dependência = dependências.pop();
      const stats = this.analisarLinha(linha, dependência);

      if (dependências.length == 0) {
        dependências.push({ texto: stats.texto, tipo: stats.tipo });
      } else if (dependência) {
        dependências.push(dependência); // adiciona dependência se estiver definida
      }

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

  private analisarLinha(linha: string, dependencia?: Texto): Stats & Texto {
    let termos: Id[] = [];
    let termosOcultos: Id[] = [];
    let expressões: Id[] = [];
    let expressõesOcultas: Id[] = [];

    const { tipo, texto } = this.analizarTexto(linha);

    if (this.graphit.tokenize(texto).length === 1) {
      const { id, pertence_a } = this.graphit.termo(texto);
      termos = [id];
      expressões = pertence_a;
    } else {
      const contém = dependencia?.tipo === 'título' ? [dependencia.texto] : [];

      const expressão = this.graphit.expressão(texto, { contém });
      termos = [...expressão.termos];
      termosOcultos = [...expressão.termosOcultos];
      expressões = [expressão.id, ...expressão.subexpressões];
      expressõesOcultas = [...expressão.expressõesOcultas];
    }

    return {
      termos,
      termosOcultos,
      expressões,
      expressõesOcultas,
      texto,
      tipo,
    };
  }

  analizarTexto(texto: string): Texto {
    // Verifica se a linha é um título, lista ou citação
    const marksRegex = /\s*(#{1,6}|-|>|\d+\.)\s+(.+)/;
    const match = texto.match(marksRegex);

    if (match) {
      texto = match[2];
      if (match[1].startsWith('>')) return { texto, tipo: 'citação' };
      if (match[1].startsWith('#')) return { texto, tipo: 'título' };
      if (match[1].startsWith('-') || /^\d+\.$/.test(match[1])) {
        return { texto, tipo: 'lista' };
      }
    }

    return { texto, tipo: 'parágrafo' };
  }

  toMarkdown(texto: string): string {
    const tokens = this.graphit.tokenize(texto);
    const nó =
      tokens.length === 1
        ? this.graphit.termo(texto)
        : this.graphit.expressão(texto);

    if ('valor' in nó) {
      return `# ${nó.valor}\n\n`;
    } else {
      const valores = nó.termos.map(termoId => {
        const termo = this.graphit.get(termoId) as Termo;
        return termo.valor;
      });

      return `# ${this.graphit.detokenize(valores)}\n\n`;
    }
  }
}
