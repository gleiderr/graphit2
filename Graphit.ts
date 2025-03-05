import { readFileSync, writeFileSync } from 'fs';

type ExpressãoProps = { contém: string[] };

export type Id = string;

/**
 * Representa um termo existente no sistema.
 *
 * @typedef {Object} Termo
 * @property {string} valor - O valor do termo propriamente dito.
 * @property {Id[]} pertence_a - Lista de expressões a que o termo pertence.
 * @property {Id[]} predecessores - Lista de expressões que precedem este termo.
 * @property {Id[]} sucessores - Lista de expressões que seguem este termo.
 */
type Termo = {
  valor: string;
  pertence_a: Id[];
};

/**
 * Representa uma expressão existente no sistema.
 *
 * @typedef {Object} Expressão
 * @property {Id[]} nós - Conjunto de Ids de termos ou expressões pertencentes à expressão.
 * @property {Id[]} expressões - Lista de expressões relacionadas.
 * @property {ExpressãoProps} [props] - Propriedades opcionais para a expressão.
 */
type Expressão = {
  contém: Id[];
  contémOculto: Id[];
  contidaEm: Id[];
  props?: ExpressãoProps;
};

/**
 * Representação de uma expressão com os valores de seus nós e expressões relacionados.
 */
export type DescriçãoExpressão = {
  /** Identificador da expressão. */
  id: Id;
  /** Lista de nós pertencentes à expressão. */
  contém: Descrição[];
  /** Lista de nós pertencentes à expressão, mas que são ocultos. */
  contémOculto: Descrição[];
  /** Lista de expressões que contêm esta expressão. */
  contidaEm: DescriçãoExpressão[];
  /** Propriedades opcionais para a expressão. */
  props?: ExpressãoProps;
};

/**
 * Representação de um termo com seu valor e descrição das expressões relacionadas.
 * @typedef {Object} DescriçãoTermo
 * @property {Id} id - Id do termo.
 * @property {string} valor - Valor do termo.
 * @property {DescriçãoExpressão[]} expressões - Descrição das expressões relacionadas ao termo.
 */
export type DescriçãoTermo = {
  id: Id;
  valor: string;
  pertence_a: DescriçãoExpressão[];
};

/**
 * Descrição de um termo ou expressão.
 */
export type Descrição = DescriçãoTermo | DescriçãoExpressão;

/**
 * Graphit é um manipulador de expressões e termos.
 * Ele facilita a identificação relacionamentos entre termos e expressões.
 *
 * As expressões comportam-se como conjuntos de termos ou expressões.
 * Os termos comportam-se como elementos desses conjuntos.
 */
class Graphit {
  private db: { [key: string]: Termo | Expressão } = {};
  // private listeners: { [key in 'afterExpressão']: ((id: Id) => void)[] } = {
  //   afterExpressão: [],
  // };
  private _nextId = 0;
  //private listening: boolean = false;

  visitados: Set<Id> = new Set();

  get índices() {
    return Object.keys(this.db);
  }

  /**
   * Retorna o próximo Id disponível.
   *
   * @returns {string} O próximo Id.
   */
  private nextId(): Id {
    return (this._nextId++).toString(36);
  }

  /**
   * Cria um novo termo com o valor fornecido.
   *
   * @param {string} valor - Valor do novo termo.
   * @returns {Id} Id do novo termo.
   */
  private novoTermo(valor: string): Id {
    const id = this.nextId();
    this.db[id] = { valor, pertence_a: [] };
    return id;
  }

  /**
   * Cria uma nova expressão com os ids dos nós fornecidos.
   *
   * @param {Id[]} nós - Ids dos nós que compõem a expressão.
   * @param {ExpressãoProps} [props] - Propriedades adicionais da expressão.
   * @returns {Id} Id da nova expressão.
   */
  private novaExpressão(nós: Id[], props?: ExpressãoProps): Id {
    const novaExpressãoId = this.nextId();
    this.db[novaExpressãoId] = {
      contém: nós,
      contidaEm: [],
      contémOculto: [],
      props,
    };

    const relacionaExpressão = (nó: Id) => {
      const elemento = this.get(nó);
      if ('pertence_a' in elemento) {
        elemento.pertence_a.push(novaExpressãoId);
      } else {
        elemento.contidaEm.push(novaExpressãoId);
      }
    };

    nós.forEach(relacionaExpressão);

    return novaExpressãoId;
  }

  /**
   * Obtém um nó ou expressão pelo Id.
   * @param {Id} id - O Id do nó ou expressão.
   * @returns {Termo | Expressão} O nó ou expressão correspondente.
   * @throws {Error} Se o nó ou expressão não for encontrado.
   */
  private get(id: Id): Termo | Expressão {
    if (!this.db[id]) throw new Error(`Nó não encontrado: ${id}`);
    return this.db[id];
  }

  /**
   * Busca um nó pelo valor fornecido.
   * @param {string} valor - Valor do nó a ser buscado.
   * @returns {Id | undefined} Id do nó encontrado ou undefined se não encontrado.
   */
  private buscarTermo(valor: string): Id | undefined {
    return Object.keys(this.db).find(
      id => 'valor' in this.db[id] && this.db[id].valor === valor
    );
  }

  /**
   * Busca por expressões que atendam ao filtro especificado.
   *
   * @param {Id[]} nós - Ids dos nós a serem buscados.
   * @returns {Id[]} Ids das expressões encontradas.
   */
  private buscarExpressões(nós: Id[]): Id[] {
    const ids = Object.keys(this.db);

    const idsMesmosTermos = ids.filter(id => {
      const elemento = this.db[id];
      if ('contém' in elemento && elemento.contém.length === nós.length) {
        return nós.every(nóId => elemento.contém.includes(nóId));
      }
      return false;
    });

    const idsMesmaOrdem = idsMesmosTermos.filter(id => {
      const elemento = this.db[id];
      if ('contém' in elemento) {
        for (let i = 0; i < elemento.contém.length; i++) {
          if (elemento.contém[i] !== nós[i]) return false;
        }
        return true;
      }
      return false;
    });

    return idsMesmaOrdem;
  }

  /**
   * Retorna o Id da expressão cujos nós coincidem com os valores informados.
   * Se não encontrar, cria uma nova expressão reaproveitando os nós existentes
   * e cria novos nós sempre que necessário.
   *
   * @param {string} texto - Uma string a ser separada em termos.
   * @param {ExpressãoProps} [props] - Propriedades adicionais da expressão.
   * @returns {{ id: Id }} O Id da expressão.
   *
   * @throws {Error} Se a expressão for vazia ou contiver apenas um termo.
   * @throws {Error} Se mais de uma expressão for encontrada.
   */
  expressão(texto: string, props?: ExpressãoProps): { id: Id } {
    if (!texto || !texto.trim())
      throw new Error('Não são permitidas expressões vazias');

    // Transforma 'texto' em um conjunto de termos que podem ser uma palavra ou uma pontuação
    const tokens = this.termos(texto);

    if (tokens.length < 2)
      throw new Error('Não são permitidas expressões com apenas um termo');

    // Busca os termos existentes ou cria novos termos
    const ids = tokens.map(
      token => this.buscarTermo(token) || this.novoTermo(token)
    );

    const expressões = this.buscarExpressões(ids);
    if (expressões.length > 1)
      throw new Error('Mais de uma expressão encontrada');

    const id = expressões[0] || this.novaExpressão(ids, props);

    return { id };
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
    if (!('contém' in expressão))
      throw new Error(`O elemento ${expressãoId} não é uma expressão`);

    if (expressão.contidaEm.length > 0)
      throw new Error(
        `A expressão ${expressãoId} está contidaEm outras expressões`
      );

    expressão.contém.forEach(nó => this.removerNó(nó, expressãoId));

    delete this.db[expressãoId];
  }

  /**
   * Remove uma expressão de um nó.
   * @param {Id} nóId - O Id do nó.
   * @param {Id} expressãoId - O Id da expressão a ser removida.
   * @throws {Error} Se a expressão não pertencer ao nó.
   */
  private removerNó(nóId: Id, expressãoId: Id) {
    const nó = this.get(nóId);
    const expressão = this.get(expressãoId) as Expressão;

    if (!expressão.contém.includes(nóId)) {
      throw new Error(`Expressão "${expressãoId}" não contém o nó "${nóId}"`);
    }

    if ('pertence_a' in nó) {
      const index = nó.pertence_a.indexOf(expressãoId);
      if (index == -1) {
        throw new Error(`Nó "${nóId}" não contém a expressão "${expressãoId}"`);
      }

      expressão.contém = expressão.contém.filter(id => id !== nóId); // Remove o nó da expressão
      nó.pertence_a.splice(index, 1); // Remove a expressão do nó
    }

    // Se não houver mais expressões relacionadas ao nó, remove-o
    if ('valor' in nó && nó.pertence_a.length === 0) {
      delete this.db[nóId];
    }
  }

  /**
   * Transforma uma string em um conjunto de tokens.
   * @param {string} s - A string a ser tokenizada.
   * @returns {string[]} Os tokens resultantes.
   */
  private termos(s: string): string[] {
    return s
      .split(/(\s+|[-,.;:()"]|\?)/) // Divide a string em tokens
      .map(s => s.trim()) // Remove espaços em branco
      .filter(Boolean); // Remove tokens vazios
  }

  /**
   * Executa a operação inversa de tokenize().
   * Ou seja, recebe um arranjo de strings e retorna uma string.
   *
   * @param {string[]} nós - Tokens a serem unidos.
   * @returns {string} texto resultante.
   */
  private texto(nós: string[]): string {
    return nós
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:-])/g, '$1');
  }

  /**
   * Descreve um nó criando uma estrutura de árvore, percorrendo
   * as expressões em profundidade.
   *
   * @param {Id} id - O Id do nó a ser descrito.
   * @returns {Descrição} A descrição do nó.
   */
  descrever(id: Id): Descrição {
    this.visitados = new Set<Id>(id); // Limpa o conjunto de visitados, mantendo o id inicial

    const constróiDescrição = (id: Id): Descrição => {
      const descrição = this.descreverNó(id);

      const nó = this.get(id);
      const expressões = 'pertence_a' in nó ? nó.pertence_a : nó.contém;

      const adicionarExpressão = (expressãoId: Id) => {
        if (this.visitados.has(expressãoId)) return;
        this.visitados.add(expressãoId);

        const subDescrição = constróiDescrição(
          expressãoId
        ) as DescriçãoExpressão;
        const array =
          'pertence_a' in descrição
            ? descrição.pertence_a
            : descrição.contidaEm;
        array.push(subDescrição);
      };

      expressões.forEach(adicionarExpressão);

      return descrição;
    };

    return constróiDescrição(id);
  }

  /**
   * Descreve um elemento do grafo.
   * @param {Id} id - O Id do elemento a ser descrito.
   * @returns {Descrição} A descrição do elemento.
   */
  private descreverNó(id: Id): Descrição {
    const nó = this.get(id);
    this.visitados.add(id);

    if ('valor' in nó) {
      return { id, valor: nó.valor, pertence_a: [] };
    } else {
      const contém = nó.contém.map(this.descreverNó.bind(this));
      return { id, contém, contémOculto: [], contidaEm: [] };
    }
  }

  /**
   * Salva o banco de dados em um arquivo.
   * @param {string} arquivo - O caminho do arquivo onde os dados serão salvos.
   */
  async salvar(arquivo: string) {
    const dados = JSON.stringify(this.db, null, 2);
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
