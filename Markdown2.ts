import { Descrição, DescriçãoAresta } from './Graphit2';

class Markdown2 {
  prefixo?: (
    profundidade: number,
    elemento: DescriçãoAresta,
    origem?: Descrição,
  ) => string;
  sufixo?: (
    profundidade: number,
    aresta: DescriçãoAresta,
    origem?: Descrição,
  ) => string;

  filterOut: (descrição: DescriçãoAresta) => boolean = () => false;

  constructor() {}

  /**
   * A partir da descrição, monta a estrutura markdown.
   * Se a descrição for realizada a partir de um nó, o título será o valor do nó.
   * Se a descrição for realizada a partir de uma aresta, o título será o valor do nó de origem.
   * As linhas são montadas a partir das arestas da descrição inicial.
   */
  toMarkdown(descrição: Descrição): string {
    const primeiraLinha = this.getLinha(0, descrição);
    const linhas = this.montarLinhas(descrição);

    if ('valor' in descrição) return `# ${primeiraLinha}\n${linhas}`;

    return `${primeiraLinha}\n${linhas}`;
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
    const linhas = aresta.arestas
      .filter(aresta => !this.filterOut(aresta))
      .map(subAresta => this.montarLinha(profundidade + 1, subAresta, aresta));

    return [linha, ...linhas].join('\n');
  }

  private getLinha(
    profundidade: number,
    elemento: Descrição,
    origem?: Descrição,
  ): string {
    if ('valor' in elemento) return elemento.valor;

    const valores = elemento.nós.map((nó, i) => this.getValor(nó, i, origem));

    const indentação = '  '.repeat(profundidade);
    const prefixo =
      !this.prefixo ?
        `${indentação}- `
      : this.prefixo(profundidade, elemento, origem);
    const sufixo =
      !this.sufixo ? '' : this.sufixo(profundidade, elemento, origem);

    const linha = valores
      .join(' ') // Concatena valores com espaço
      .replace(/^[,\s]+/, '') // Remove espaços em branco e vírgulas no início da linha
      .replace(/^\w/, c => c.toUpperCase()); // Torna maíuscula primeira letra da linha

    return `${prefixo}${linha}${sufixo}`;
  }

  private getValor = (nó: Descrição, i: number, origem?: Descrição): string => {
    // Se o primeiro nó for a aresta de origem, não imprime-o
    if (i === 0 && origem && nó.id === origem.id) return '';
    if ('valor' in nó) return nó.valor;

    const aresta = nó;
    const nós = aresta.nós.map((nó, i) => this.getValor(nó, i, origem));
    return nós.join(' ');
  };
}

export const markdown = new Markdown2();
