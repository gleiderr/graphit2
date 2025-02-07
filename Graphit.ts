import { readFileSync, writeFileSync } from 'fs';
import * as prettier from 'prettier';

type ExpressãoProps = { label: string };

export type Id = string;

type Termo = { valor: string; expressões: Id[] };
type Expressão = { nós: Id[]; expressões: Id[]; props?: ExpressãoProps };

// TODO: remover obrigatoriedade de `expressões` em `Descrição`?
export type DescriçãoExpressão = {
  id: Id;
  nós: Descrição[];
  expressões: DescriçãoExpressão[];
};
export type DescriçãoTermo = {
  id: Id;
  valor: string;
  expressões: DescriçãoExpressão[];
};
export type Descrição = DescriçãoTermo | DescriçãoExpressão;

/**
 * Implementação para manipulação de textos.
 *
 * Talvez seja uma representação de um hipergrafo híbrido. Tanto expressões
 * como termos são vértices do grafo que podem ser conectados por expressões.
 * Nesse caso expressões são na verdade hiperarestas que conectam dois ou mais nós.
 */
class Graphit {
  private db: { [key: string]: Termo | Expressão } = {};
  private listeners: { [key in 'afterExpressão']: ((id: Id) => void)[] } = {
    afterExpressão: [],
  };
  private _nextId = 0;
  private listening: boolean = false;

  visitados: Set<Id> = new Set();

  get índices() {
    return Object.keys(this.db);
  }

  /**
   * Retorna o próximo Id disponível.
   * @returns {string} O próximo Id.
   */
  private nextId(): Id {
    return (this._nextId++).toString(36);
  }

  /**
   * Cria um novo nó com o valor fornecido.
   * @param {string} valor - O valor do novo nó.
   * @returns {Id} O Id do novo nó.
   */
  private novoNó(valor: string): Id {
    const id = this.nextId();
    this.db[id] = { valor, expressões: [] };
    return id;
  }

  /**
   * Cria uma nova expressão com os nós fornecidos.
   * @param {Id[]} nós - Os Ids dos nós que compõem a expressão.
   * @param {ExpressãoProps} [props] - Propriedades adicionais da expressão.
   * @returns {Id} O Id da nova expressão.
   */
  private novaExpressão(nós: Id[], props?: ExpressãoProps): Id {
    const id = this.nextId();
    this.db[id] = { nós, expressões: [], props };
    nós.forEach(nó => this.db[nó].expressões.push(id));
    return id;
  }

  /**
   * Obtém um nó ou expressão pelo Id.
   * @param {Id} id - O Id do nó ou expressão.
   * @returns {Termo | Expressão} O nó ou expressão correspondente.
   * @throws {Error} Se o nó ou expressão não for encontrado.
   */
  get(id: Id): Termo | Expressão {
    if (!this.db[id]) throw new Error(`Nó não encontrado ${id}`);
    return this.db[id];
  }

  /**
   * Busca um nó pelo valor fornecido.
   * @param {string} valor - O valor do nó a ser buscado.
   * @returns {Id | undefined} O Id do nó encontrado ou undefined se não encontrado.
   */
  buscarNó(valor: string): Id | undefined {
    return Object.keys(this.db).find(id =>
      'valor' in this.db[id] ? this.db[id].valor === valor : false,
    );
  }

  /**
   * Busca por expressões que contenham exatamente os mesmos nós passados por parâmetro e na mesma ordem.
   * @param {Id[]} nós - Os Ids dos nós a serem buscados.
   * @returns {Id[]} Os Ids das expressões encontradas.
   */
  private buscarExpressõesExatas(nós: Id[]): Id[] {
    const expressões: Id[] = [];
    for (const id of Object.keys(this.db)) {
      const elemento = this.db[id];
      if ('nós' in elemento) {
        if (elemento.nós.length === nós.length) {
          const temMesmosIds = elemento.nós.every((nó, i) => nó === nós[i]);
          if (temMesmosIds) expressões.push(id);
        }
      }
    }

    return expressões;
  }

  /**
   * Busca expressões que contenham todos os Ids passados por parâmetro em qualquer ordem.
   * @param {Object} params - Parâmetros de busca.
   * @param {Id[]} params.contém - Os Ids dos nós a serem buscados.
   * @returns {Id[]} Os Ids das expressões encontradas.
   */
  filtrarExpressões({ contém }: { contém: Id[] }): Id[] {
    const expressões: Id[] = [];
    for (const id of Object.keys(this.db)) {
      const elemento = this.db[id];
      if ('nós' in elemento) {
        const temTodosIds = contém.every(id => elemento.nós.includes(id));
        if (temTodosIds) expressões.push(id);
      }
    }
    return expressões;
  }

  /**
   * Adiciona um listener para um evento específico.
   * @param {'afterExpressão'} on - O evento para o qual adicionar o listener.
   * @param {function(Id): void} callback - A função de callback a ser chamada quando o evento ocorrer.
   * @returns {number} O índice do listener adicionado.
   */
  addListener(on: 'afterExpressão', callback: (id: Id) => void): number {
    return this.listeners[on].push(callback) - 1;
  }

  /**
   * Remove um listener de um evento específico.
   * @param {'afterExpressão'} on - O evento do qual remover o listener.
   * @param {number} index - O índice do listener a ser removido.
   */
  removeListener(on: 'afterExpressão', index: number) {
    this.listeners[on].splice(index, 1);
  }

  /**
   * Retorna o Id da expressão cujos nós coincidem com os valores informados.
   * Se não encontrar, cria uma nova expressão reaproveitando os nós existentes
   * e cria novos nós sempre que necessário.
   * @param {string | (string | { id: Id })[]} nós - Uma string a ser tokenizada, ou um arranjo de termos ou um arranjo de ids.
   * @param {ExpressãoProps} [props] - Propriedades adicionais da expressão.
   * @returns {{ id: Id }} O Id da expressão.
   * @throws {Error} Se mais de uma expressão for encontrada.
   */
  expressão(
    nós: string | (string | { id: Id })[],
    props?: ExpressãoProps,
  ): { id: Id } {
    if (typeof nós === 'string') {
      // Transforma 's' em um conjunto de termos que podem ser uma palavra ou uma pontuação
      nós = this.tokens(nós);
    }
    const ids = nós.map(nó =>
      typeof nó === 'object' ? nó.id : this.buscarNó(nó) || this.novoNó(nó),
    );

    const expressões = this.buscarExpressõesExatas(ids);
    if (expressões.length > 1)
      throw new Error('Mais de uma expressão encontrada');

    const id = expressões[0] || this.novaExpressão(ids, props);

    if (!this.listening) {
      this.listening = true;
      this.listeners.afterExpressão.forEach(listener => listener(id));
      this.listening = false;
    }

    return { id };
  }

  /**
   * Move uma expressão de uma posição para outra.
   * @param {Id} nó - O Id do nó.
   * @param {number | Id} origem - A posição ou Id de origem.
   * @param {number | Id} destino - A posição ou Id de destino.
   * @throws {Error} Se a origem ou destino forem inválidos.
   */
  moverExpressão(nó: Id, origem: number | Id, destino: number | Id) {
    const elemento = this.get(nó);

    const getIndex = (id: Id) => {
      const index = elemento.expressões.indexOf(id);
      if (index >= 0) return index;
      else throw new Error(`Expressão "${id}" não pertence ao nó "${nó}"`);
    };

    origem = typeof origem === 'number' ? origem : getIndex(origem);
    destino = typeof destino === 'number' ? destino : getIndex(destino);

    if (origem >= elemento.expressões.length) {
      throw new Error(`Índice de origem "${origem}" é inválido`);
    }
    if (destino >= elemento.expressões.length) {
      throw new Error(`Índice de destino "${destino}" é inválido`);
    }

    elemento.expressões.splice(
      destino,
      0,
      elemento.expressões.splice(origem, 1)[0],
    );
  }

  /**
   * Exclui uma expressão.
   * Lança exceção se o Id não pertencer a uma expressão.
   * Lança exceção se a expressão pertencer a outras expressões.
   * @param {Id} expressãoId - O Id da expressão a ser removida.
   * @throws {Error} Se o elemento não for uma expressão ou se a expressão pertencer a outras expressões.
   */
  excluirExpressão(expressãoId: Id) {
    const expressão = this.get(expressãoId);
    if (!('nós' in expressão))
      throw new Error(`O elemento ${expressãoId} não é uma expressão`);

    if (expressão.expressões.length > 0)
      throw new Error(
        `A expressão ${expressãoId} pertence a outras expressões`,
      );

    expressão.nós.forEach(nó => this.removerNó(nó, expressãoId));

    delete this.db[expressãoId];
  }

  /**
   * Remove uma expressão de um nó.
   * @param {Id} nó - O Id do nó.
   * @param {Id} expressão - O Id da expressão a ser removida.
   * @throws {Error} Se a expressão não pertencer ao nó.
   */
  private removerNó(nó: Id, expressão: Id) {
    const Nó = this.get(nó);
    const expr = this.get(expressão) as Expressão;

    if (!expr.nós.includes(nó)) {
      throw new Error(`Expressão "${expressão}" não contém o nó "${nó}"`);
    }

    const index = Nó.expressões.indexOf(expressão);
    if (index == -1) {
      throw new Error(`Nó "${nó}" não contém a expressão "${expressão}"`);
    }

    expr.nós = expr.nós.filter(id => id !== nó); // Remove o nó da expressão
    Nó.expressões.splice(index, 1); // Remove a expressão do nó

    // Se não houver mais expressões relacionadas ao nó, remove-o
    if ('valor' in Nó && Nó.expressões.length === 0) {
      delete this.db[nó];
    }
  }

  /**
   * Transforma uma string em um conjunto de tokens.
   * @param {string} s - A string a ser tokenizada.
   * @returns {string[]} Os tokens resultantes.
   */
  tokens(s: string): string[] {
    return s
      .split(/(\s+|[,.;:()"]|\?)/) // TODO: incluir hífen como token
      .map(s => s.trim())
      .filter(Boolean);
  }

  /**
   * Executa a operação inversa de tokenize().
   * Ou seja, recebe um arranjo de strings e retorna uma string.
   * @param {string[]} nós - Os tokens a serem unidos.
   * @returns {string} A string resultante.
   */
  undotokenize(nós: string[]): string {
    return nós
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:-])/g, '$1');
  }

  /**
   * Descreve um vértice do grafo criando uma estrutura de árvore, percorrendo
   * as expressões em profundidade.
   * @param {Id} id - O Id do vértice a ser descrito.
   * @returns {Descrição} A descrição do vértice.
   */
  descrever(id: Id): Descrição {
    this.visitados = new Set<Id>(id);

    const constróiDescrição = (id: Id): Descrição => {
      const descrição = this.descreverElemento(id);

      this.get(id).expressões.forEach((id: Id) => {
        if (this.visitados.has(id)) return;
        this.visitados.add(id);

        const subDescrição = constróiDescrição(id) as DescriçãoExpressão;
        descrição.expressões.push(subDescrição);
      });

      return descrição;
    };

    return constróiDescrição(id);
  }

  /**
   * Descreve um elemento do grafo.
   * @param {Id} id - O Id do elemento a ser descrito.
   * @returns {Descrição} A descrição do elemento.
   */
  private descreverElemento(id: Id): Descrição {
    const elemento = this.get(id);
    this.visitados.add(id);

    if ('valor' in elemento) {
      return { id, valor: elemento.valor, expressões: [] };
    } else {
      const nós = elemento.nós.map(this.descreverElemento.bind(this));
      return { id, nós, expressões: [] };
    }
  }

  /**
   * Salva o banco de dados em um arquivo.
   * @param {string} arquivo - O caminho do arquivo onde os dados serão salvos.
   */
  async salvar(arquivo: string) {
    const dados = await prettier.format(JSON.stringify(this.db), {
      parser: 'json',
    });
    writeFileSync(arquivo, dados);
  }

  /**
   * Carrega o banco de dados de um arquivo.
   * @param {string} arquivo - O caminho do arquivo de onde os dados serão carregados.
   */
  carregar(arquivo: string) {
    const dados = readFileSync(arquivo, 'utf-8');
    this.db = JSON.parse(dados);

    const keys = Object.keys(this.db);
    this._nextId = Math.max(...keys.map(key => parseInt(key, 36))) + 1;
  }
}

export const graphit = new Graphit();
export const expressão = graphit.expressão.bind(graphit);
export const tokens = graphit.tokens.bind(graphit);
