import { Descrição, DescriçãoAresta } from './Graphit2';

class Markdown2 {
  constructor() {}

  /**
   * A partir da descrição, monta a estrutura markdown.
   * Se a descrição for realizada a partir de um nó, o título será o valor do nó.
   * Se a descrição for realizada a partir de uma aresta, o título será o valor do nó de origem.
   * As linhas são montadas a partir das arestas da descrição inicial.
   */
  toMarkdown(descrição: Descrição): string {
    const título = this.getTítulo(descrição);
    const linhas = this.montarLinhas(descrição);
    return `# ${título}\n${linhas}`;
  }

  montarLinhas(descrição: Descrição): string {
    const linhas = descrição.arestas.map(aresta => this.montarLinha(0, aresta));
    return linhas.join('\n');
  }

  montarLinha(profundidade: number, aresta: DescriçãoAresta): string {
    const linha = this.getLinha(profundidade, aresta);
    const linhas = aresta.arestas.map(aresta =>
      this.montarLinha(profundidade + 1, aresta),
    );

    return [linha, ...linhas].join('\n');
  }

  getLinha(profundidade: number, aresta: DescriçãoAresta) {
    const indentação = '  '.repeat(profundidade);
    const getValor = (nó: Descrição): string =>
      'valor' in nó ? nó.valor : 'aresta';
    const nós = aresta.nós.map(getValor);
    return `${indentação}- ${nós.join(' ')}`;
  }

  private getTítulo(descrição: Descrição): string {
    if ('valor' in descrição) return descrição.valor;
    return 'Título de aresta';
  }
}

export const markdown = new Markdown2();
