import { Descrição, DescriçãoAresta } from './Graphit';

class Markdown {
  prefixo?: (nível: number, elemento: Descrição, origem?: Descrição) => string;

  sufixo?: (nível: number, elemento: Descrição, origem?: Descrição) => string;

  onGetLinha?: (nível: number, elemento: Descrição, origem?: Descrição) => void;

  filterOut?: (descrição: DescriçãoAresta) => boolean = () => false;

  constructor() {}

  /**
   * A partir da descrição, monta a estrutura markdown.
   * Se a descrição for realizada a partir de um nó, o título será o valor do nó.
   * Se a descrição for realizada a partir de uma aresta, o título será o valor do nó de origem.
   * As linhas são montadas a partir das arestas da descrição inicial.
   */
  toMarkdown(descrição: Descrição, { debug = false } = {}): string {
    const primeiraLinha = this.getLinha(0, descrição, undefined, { debug });
    const linhas = this.montarLinhas(descrição, { debug });

    return [primeiraLinha, ...linhas].join('\n');
  }

  private montarLinhas(
    descrição: Descrição,
    { debug }: { debug: boolean },
  ): string[] {
    const linhas = descrição.arestas
      .filter(aresta => this.filterOut && !this.filterOut(aresta))
      .map(aresta => this.montarLinha(0, aresta, descrição, { debug }))
      .flat();
    return linhas;
  }

  private montarLinha(
    nível: number,
    aresta: DescriçãoAresta,
    origem: Descrição,
    { debug }: { debug: boolean },
  ): string[] {
    const linha = this.getLinha(nível, aresta, origem, { debug });
    const linhas = aresta.arestas
      .filter(aresta => this.filterOut && !this.filterOut(aresta))
      .map(subAresta =>
        this.montarLinha(nível + 1, subAresta, aresta, { debug }),
      )
      .flat();

    return [linha, ...linhas];
  }

  private getLinha(
    nível: number,
    elemento: Descrição,
    origem?: Descrição,
    { debug = false } = {},
  ): string {
    this.onGetLinha?.(nível, elemento, origem);

    let linha;
    if ('valor' in elemento) {
      linha = elemento.valor;
    } else {
      const valores = elemento.nós.map((nó, i) => this.getValor(nó, i, origem));

      linha = valores
        .join(' ') // Concatena valores com espaço
        .replace(/^[,\s]+/, '') // Remove espaços em branco e vírgulas no início da linha
        .replace(/^\w/, c => c.toUpperCase()); // Torna maíuscula primeira letra da linha
    }

    const indent = '  '.repeat(nível);
    // Se existir uma origem então pressupõe-se uma lista, senão um título
    const prefixoPadrão = () => (origem ? `${indent}- ` : '# ');

    const prefixo = this.prefixo?.(nível, elemento, origem) ?? prefixoPadrão();
    const sufixo = !this.sufixo ? '' : this.sufixo(nível, elemento, origem);

    const id = debug ? ` {${elemento.id}}` : '';

    return `${prefixo}${linha}${sufixo}${id}`;
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

export const markdown = new Markdown();
