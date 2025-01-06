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

  private montarLinhas(descrição: Descrição): string {
    const linhas = descrição.arestas.map(aresta =>
      this.montarLinha(0, aresta, descrição),
    );
    return linhas.join('\n');
  }

  private montarLinha(
    profundidade: number,
    aresta: DescriçãoAresta,
    origem: Descrição,
  ): string {
    const linha = this.getLinha(profundidade, aresta, origem);
    const linhas = aresta.arestas.map(subAresta =>
      this.montarLinha(profundidade + 1, subAresta, aresta),
    );

    return [linha, ...linhas].join('\n');
  }

  private getLinha(
    profundidade: number,
    aresta: DescriçãoAresta,
    origem: Descrição,
  ): string {
    const indentação = '  '.repeat(profundidade);

    const getValor = (nó: Descrição, i: number): string => {
      // Se o primeiro nó for a aresta de origem, não imprime-o
      if (i === 0 && nó.id === origem.id) return '';
      if ('valor' in nó) return nó.valor;

      const aresta = nó;
      const nós = aresta.nós.map(getValor);
      return nós.join(' ');
    };

    const valores = aresta.nós.map(getValor);

    const linha = valores
      .join(' ') // Concatena valores com espaço
      .replace(/^[,\s]+/, '') // Remove espaços em branco e vírgulas no início da linha
      .replace(/^\w/, c => c.toUpperCase()); // Torna maíuscula primeira letra da linha

    return `${indentação}- ${linha}`;
  }

  private getTítulo(descrição: Descrição): string {
    if ('valor' in descrição) return descrição.valor;
    return 'Título de aresta';
  }
}

export const markdown = new Markdown2();
