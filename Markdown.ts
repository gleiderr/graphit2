import { Expressão, Graphit, Termo } from './Graphit';

type Linha = {
  tipo: TipoLinha; // Tipo do nó (título, lista, parágrafo, etc.)
  nível: number;
  conteúdo: string;
  children: Linha[];
};

type TipoLinha = 'title' | 'list' | 'paragraph';

const esquemaPadrão = {
  resetVisitados: false, // Reinicia os visitados a cada chamada
  descendentes: (informação: Termo | Expressão) => {
    return informação.contém;
  },
};

export class Markdown {
  /** Conjunto para armazenar os id das informações visitadas */
  private visitados = new Set<string>();

  constructor(private graphit: Graphit) {}

  /**
   * Lê o texto em formato markdown e retorna as informações processadas.
   * @param texto Texto em formato markdown a ser lido
   * @returns Informações processadas do texto markdown
   */
  public ler(texto: string) {
    const linhas = this.parse(texto);
    return linhas.map(linha => {
      const informação = this.graphit.informação(linha.conteúdo, {
        contém: linha.children.map(subLinha => subLinha.conteúdo),
      });

      this.analisarSublinhas(linha);
      return informação;
    });
  }

  /**
   * Método para transcriver informações do Graphit para o formato Markdown.
   * @param informações Informações a serem transcritas para o formato Markdown.
   */
  public escrever(informações: (Termo | Expressão)[], esquema = esquemaPadrão) {
    if (esquema.resetVisitados) {
      this.visitados = new Set(); // Reinicia o conjunto de visitados
    }

    const texto = informações
      .map(i => this.getLinha(i, 0, esquema))
      .map(linha => this.getTexto(linha))
      .join('\n');
    return `${texto}\n`;
  }

  private getLinha(
    informação: Termo | Expressão,
    nível: number,
    esquema = esquemaPadrão
  ): Linha {
    this.visitados.add(informação.id); // Marca a informação como visitada

    const children = esquema
      .descendentes(informação)
      .filter(id => !this.visitados.has(id)) // Filtra informações não visitadas
      .map(i => this.graphit.get(i))
      .map(i => this.getLinha(i, nível + 1, esquema)); // Chama recursivamente para cada descendente

    return {
      tipo: this.determinarTipo(nível),
      nível,
      conteúdo: this.graphit.getValor(informação),
      children,
    };
  }

  private determinarTipo(nível: number): TipoLinha {
    // Determina o tipo da linha com base no nível
    if (nível === 0) return 'title';
    if (nível === 1) return 'paragraph';
    return 'list';
  }

  private getTexto(linha: Linha): string {
    let texto = '';

    if (linha.tipo === 'title') {
      texto = `# ${linha.conteúdo}`;
    } else if (linha.tipo === 'paragraph') {
      texto = `\n${linha.conteúdo}`;
    } else if (linha.tipo === 'list') {
      const identação = '  '.repeat(linha.nível - 2);
      texto = `${identação}- ${linha.conteúdo}`;
    } else throw new Error('Tipo de linha não mapeado');

    if (linha.children.length === 0) return texto;

    const subTextos = linha.children
      .map(subLinha => this.getTexto(subLinha))
      .join('\n');

    return `${texto}\n${subTextos}`;
  }

  /**
   * Método recursivo para analisar sublinhas e adicionar informações identificadas ao Graphit.
   *
   * @param linha Linha a ser analisada
   */
  private analisarSublinhas(linha: Linha) {
    linha.children.forEach(subLinha => {
      if (subLinha.children.length === 0) return;
      this.graphit.informação(subLinha.conteúdo, {
        contém: subLinha.children.map(subSubLinha => subSubLinha.conteúdo),
      });
      this.analisarSublinhas(subLinha);
    });
  }

  /**
   * Lê o texto em formato markdown e retorna a classificação hierárquica de cada linha processada.
   *
   * @param markdownText Texto em formato markdown a ser analisado
   * @returns Informações processadas do texto markdown
   */
  private parse(markdownText: string): Linha[] {
    const lines = markdownText.split('\n');
    const hierarchy: Linha[] = [];
    let stack: Linha[] = [];

    lines.forEach(line => {
      const linha = line.trimEnd();

      if (!linha) return; // Ignora linhas vazias

      const linePattern = /^(?:\s*>)?( *)(#{1,6}\s+|-\s+|\*\s+|\d+\.\s+|)(.*)/;
      const match = linha.match(linePattern);
      if (!match) throw new Error(`Linha inválida "${linha}"`);

      const identação = match[1]; // Espaços em branco no início da linha
      const marker = match[2].trim(); // Marcador (título, lista, etc.)
      const conteúdo = match[3].trim(); // Conteúdo da linha
      if (!conteúdo) return; // Ignora linhas sem conteúdo

      const tipo = this.tipoLinha(marker);
      const nível = this.nivelLinha(identação, tipo);

      const novaLinha: Linha = { tipo, nível, conteúdo, children: [] };

      if (nível === 0) {
        stack = [novaLinha]; // Reinicia a pilha para o novo nível
      } else {
        // remove da pilha os nós que não são do nível atual ou superior
        while (stack.length > 0 && stack[stack.length - 1].nível >= nível) {
          stack.pop();
        }

        stack.push(novaLinha);
      }

      // Adiciona o novo nó à hierarquia se for o único nó na pilha
      if (stack.length === 1) hierarchy.push(stack[0]);
      else if (stack.length > 1) {
        const parent = stack[stack.length - 2];
        parent.children.push(novaLinha); // Adiciona o novo nó como filho do nó pai
      }
    });

    return hierarchy;
  }

  /**
   * Determina o tipo da linha com base no marcador.
   *
   * @param marker Marcador da linha (título, lista, etc.)
   * @returns Tipo da linha
   */
  private tipoLinha(marker: string): TipoLinha {
    if (marker.match(/#{1,6}/)) return 'title';
    if (marker.match(/^-|\*|\d+\./)) return 'list';
    return 'paragraph';
  }

  /**
   * Determina o nível da linha com base na identação e no tipo.
   * @param identação Espaços em branco no início da linha
   * @param tipo Tipo da linha
   * @returns Nível da linha
   */
  private nivelLinha(identação: string, tipo: TipoLinha) {
    // Títulos estão sempre no nível 0
    if (tipo === 'title') return 0;

    // Listas possuem nível 2 + quantidade de identações
    if (tipo === 'list') return 2 + identação.length / 2;

    // Todo o resto é considerado parágrafo
    // Parágrafos possuem nível 1
    return 1;
  }
}
