import { readFileSync, writeFileSync } from 'fs';

type ExpressãoProps = { contém: string[] };

export type Id = string;

/**
 * Representação de um termo.
 */
type Termo = {
  /** Valor do termo propriamente dito. */
  valor: string;
  /** Lista de expressões a que o termo pertence. */
  pertence_a: Id[];
};

/**
 * Representação de uma expressão.
 */
type Expressão = {
  /** Lista de Ids dos termos pertencentes a esta expressão. */
  termos: Id[];
  /** Lista de Ids de expressões contidas nesta expressão. */
  subexpressões: Id[];
  /** Lista de Ids de termos ocultos nesta expressão. */
  termosOcultos: Id[];
  /** Lista de Ids de expressões ocultas nesta expressão. */
  expressõesOcultas: Id[];
  /** Lista de Ids de expressões que contêm esta expressão. */
  contidaEm: Id[];
  /** Propriedades opcionais para a expressão. */
  props?: ExpressãoProps;
};

/**
 * Representação de uma expressão com os valores de seus nós e expressões relacionados.
 */
export type DescriçãoExpressão = {
  /** Identificador da expressão. */
  id: Id;
  /** Lista de descrição de termos pertencentes à expressão. */
  termos: DescriçãoTermo[];
  /** Lista de subexpressões contidas nesta expressão. */
  subexpressões: DescriçãoExpressão[];
  /** Lista de termos ocultos nesta expressão. */
  termosOcultos: DescriçãoTermo[];
  /** Lista de expressões ocultas nesta expressão. */
  expressõesOcultas: DescriçãoExpressão[];
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
export class Graphit {
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
   * @param {Id[]} termos - Ids dos nós que compõem a expressão.
   * @param {ExpressãoProps} [props] - Propriedades adicionais da expressão.
   * @returns {Id} Id da nova expressão.
   */
  private novaExpressão(termos: Id[], props?: ExpressãoProps): Id {
    const novaExpressãoId = this.nextId();
    this.db[novaExpressãoId] = {
      termos: termos,
      contidaEm: [],
      subexpressões: [],
      termosOcultos: [],
      expressõesOcultas: [],
      props,
    };

    termos.forEach(termoId =>
      this.definePertencimento(novaExpressãoId, termoId)
    );

    return novaExpressãoId;
  }

  private definePertencimento(expressãoId: Id, termoId: Id) {
    const elemento = this.get(termoId) as Termo;
    elemento.pertence_a.push(expressãoId);
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
      if ('termos' in elemento && elemento.termos.length === nós.length) {
        return nós.every(nóId => elemento.termos.includes(nóId));
      }
      return false;
    });

    const idsMesmaOrdem = idsMesmosTermos.filter(id => {
      const elemento = this.db[id];
      if ('termos' in elemento) {
        for (let i = 0; i < elemento.termos.length; i++) {
          if (elemento.termos[i] !== nós[i]) return false;
        }
        return true;
      }
      return false;
    });

    return idsMesmaOrdem;
  }

  /**
   * Obtém o ID de um termo existente pelo seu valor ou cria um novo termo.
   * @param {string} texto - Valor do termo a ser buscado ou criado.
   * @returns {Id} Id do termo.
   */
  private getTermo(texto: string): Id {
    return this.buscarTermo(texto) || this.novoTermo(texto);
  }

  /**
   * Obtém o ID de uma expressão existente pelos IDs dos seus nós ou cria uma nova expressão.
   * @param {Id[]} ids - IDs dos nós que compõem a expressão.
   * @param {ExpressãoProps} [props] - Propriedades adicionais da expressão.
   * @returns {Id} Id da expressão.
   * @throws {Error} Se mais de uma expressão for encontrada.
   */
  private getExpressão(ids: Id[], props?: ExpressãoProps): Id {
    const expressões = this.buscarExpressões(ids);
    if (expressões.length > 1) {
      throw new Error('Mais de uma expressão encontrada');
    }

    if (expressões.length === 0) {
      const id = this.novaExpressão(ids, props);
      this.relacionarSubexpressões(id);
      return id;
    } else {
      return expressões[0];
    }
  }

  /**
   * Relaciona o conteúdo mandatório a partir de uma lista de textos contendo termos ou expressões.
   *
   * @param {string[]} contém - Lista de textos que serão relacionados como termos ou expressões ocultas.
   * @returns {{ termos: Id[]; expressões: Id[] }} Objeto contendo IDs dos termos e expressões ocultas.
   */
  private relacionarConteúdoMandatório(expressãoId: Id, contém: string[]) {
    const termos = new Set<Id>();
    const expressões = new Set<Id>();

    contém.forEach(texto => {
      const ids = this.termos(texto).map(t => this.getTermo(t));
      if (ids.length === 1) {
        termos.add(ids[0]);
      } else if (ids.length > 1) {
        const idExpressão = this.getExpressão(ids);
        expressões.add(idExpressão);
      }
    });

    // Remove os termos e expressões já existentes na expressão
    const expressão = this.get(expressãoId) as Expressão;
    expressão.termosOcultos = [...termos].filter(
      termo => !expressão.termos.includes(termo)
    );
    expressão.expressõesOcultas = [...expressões].filter(
      exprId => !expressão.subexpressões.includes(exprId)
    );

    expressão.termosOcultos.forEach(termoId =>
      this.definePertencimento(expressãoId, termoId)
    );
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
  expressão(
    texto: string,
    { contém = [] }: ExpressãoProps = { contém: [] }
  ): { id: Id } {
    if (!texto || !texto.trim()) {
      throw new Error('Não são permitidas expressões vazias');
    }

    // Transforma 'texto' em um conjunto de termos que podem ser uma palavra ou uma pontuação
    const termos = this.termos(texto);

    if (termos.length < 2) {
      throw new Error('Não são permitidas expressões com apenas um termo');
    }

    // Busca os termos existentes ou cria novos termos
    const ids = termos.map(t => this.getTermo(t));

    const id = this.getExpressão(ids);

    this.relacionarConteúdoMandatório(id, contém);

    return { id };
  }

  /**
   * Relaciona subexpressões a uma expressão existente.
   * @param {Id} expressãoId - O Id da expressão a ser relacionada.
   */
  private relacionarSubexpressões(expressãoId: Id) {
    const expressão = this.get(expressãoId) as Expressão;

    for (let n = expressão.termos.length - 1; n >= 2; n--) {
      for (let início = 0; início < expressão.termos.length - n + 1; início++) {
        const subExpressãoIds = expressão.termos.slice(início, início + n);

        const subExpressões = this.buscarExpressões(subExpressãoIds);
        if (subExpressões.length === 0) continue;
        if (subExpressões.length > 1) {
          throw new Error('Mais de uma expressão encontrada');
        }

        const subExpressãoId = subExpressões[0];
        if (!expressão.subexpressões.includes(subExpressãoId)) {
          expressão.subexpressões.push(subExpressãoId);
          //this.definePertencimento(expressãoId, subExpressãoId);
        }
      }
    }
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
    if (!('termos' in expressão))
      throw new Error(`O elemento ${expressãoId} não é uma expressão`);

    if (expressão.contidaEm.length > 0)
      throw new Error(
        `A expressão ${expressãoId} está contidaEm outras expressões`
      );

    expressão.termos.forEach(nó => this.removerNó(nó, expressãoId));

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

    if (!expressão.termos.includes(nóId)) {
      throw new Error(`Expressão "${expressãoId}" não contém o nó "${nóId}"`);
    }

    if ('pertence_a' in nó) {
      const index = nó.pertence_a.indexOf(expressãoId);
      if (index == -1) {
        throw new Error(`Nó "${nóId}" não contém a expressão "${expressãoId}"`);
      }

      expressão.termos = expressão.termos.filter(id => id !== nóId); // Remove o nó da expressão
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
      const expressões = 'pertence_a' in nó ? nó.pertence_a : nó.termos;

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
      const termos = nó.termos.map(this.descreverNó.bind(this));
      const subexpressões = nó.subexpressões.map(this.descreverNó.bind(this));
      const termosOcultos = nó.termosOcultos.map(this.descreverNó.bind(this));
      const expressõesOcultas = nó.expressõesOcultas.map(
        this.descreverNó.bind(this)
      );
      return {
        id,
        termos: termos as DescriçãoTermo[],
        subexpressões: subexpressões as DescriçãoExpressão[],
        termosOcultos: termosOcultos as DescriçãoTermo[],
        expressõesOcultas: expressõesOcultas as DescriçãoExpressão[],
        contidaEm: [],
      };
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
