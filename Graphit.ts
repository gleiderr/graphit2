import { readFileSync, writeFileSync } from 'fs';
import { Tokenizer } from './Tokenizer';

type ExpressãoProps = {
  /** Texto para ser tokenizado e relacionado à expressão */
  contém: string[];
};

export type Id = string;

/**
 * Representação de um termo.
 */
export type Termo = {
  /** Id do termo. */
  id: Id;
  /** Valor do termo propriamente dito. */
  valor: string;
  /** Lista de expressões a que o termo pertence. */
  pertence_a: Id[];
  /** Lista de Ids de informações contidas neste termo. */
  contém: Id[];
};

/**
 * Representação de uma expressão.
 */
export type Expressão = {
  /** Id da expressão. */
  id: Id;
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
 * Graphit é um manipulador de expressões e termos.
 * Ele facilita a identificação relacionamentos entre termos e expressões.
 *
 * As expressões comportam-se como conjuntos de termos ou expressões.
 * Os termos comportam-se como elementos desses conjuntos.
 */
export class Graphit {
  private db: { [key: string]: Omit<Termo, 'id'> | Omit<Expressão, 'id'> } = {};
  private _nextId = 0;
  private tokenizer = new Tokenizer();

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
  private novoTermo(valor: string): Termo {
    const id = this.nextId();
    const novoTermo = { valor, pertence_a: [] };
    this.db[id] = novoTermo;
    return { id, ...novoTermo };
  }

  /**
   * Cria uma nova expressão com os ids dos nós fornecidos.
   *
   * @param {Id[]} termos - Ids dos nós que compõem a expressão.
   * @param {ExpressãoProps} [props] - Propriedades adicionais da expressão.
   * @returns {Id} Id da nova expressão.
   */
  private novaExpressão(termos: Id[], props?: ExpressãoProps): Expressão {
    const novaExpressãoId = this.nextId();
    const novaExpressão = {
      termos: termos,
      contidaEm: [],
      subexpressões: [],
      termosOcultos: [],
      expressõesOcultas: [],
      props,
    };

    this.db[novaExpressãoId] = novaExpressão;
    termos.forEach(termoId => {
      const termo = this.get(termoId) as Termo;
      this.definePertencimento(novaExpressãoId, termo);
    });

    return { id: novaExpressãoId, ...novaExpressão };
  }

  private definePertencimento(expressãoId: Id, termo: Termo) {
    termo.pertence_a.push(expressãoId);
  }

  /**
   * Obtém termo nó ou expressão pelo Id.
   * @param {Id} id - O Id do nó ou expressão.
   * @returns {Termo | Expressão} O nó ou expressão correspondente.
   * @throws {Error} Se o nó ou expressão não for encontrado.
   */
  get(id: Id): Termo | Expressão {
    if (!this.db[id]) throw new Error(`Nó não encontrado: ${id}`);
    return { id, ...this.db[id] };
  }

  /**
   *
   * @param expressão
   * @param campo Qualquer um dos campos da expressão: 'termos', 'subexpressões', 'termosOcultos', 'expressõesOcultas' ou 'contidaEm'
   * @param valor
   * @param operação
   */
  update(
    expressão: Expressão,
    campo: keyof Omit<Expressão, 'id'>,
    valor: Id,
    operação: 'add' = 'add'
  ) {
    const expressãoDB = this.db[expressão.id] as Omit<Expressão, 'id'>;
    if (!expressãoDB)
      throw new Error(`Expressão não encontrada: ${expressão.id}`);
    if (!(campo in expressãoDB)) throw new Error(`Campo inválido: ${campo}`);

    if (operação === 'add') {
      if (!Array.isArray(expressãoDB[campo]))
        throw new Error(`Campo ${campo} não é um array`);

      expressãoDB[campo].push(valor);
      return;
    }

    throw new Error(`Operação inválida: ${operação}`);
  }

  /**
   * Busca um nó pelo valor fornecido.
   * @param {string} valor - Valor do nó a ser buscado.
   * @returns {Id | undefined} Id do nó encontrado ou undefined se não encontrado.
   */
  private buscarTermo(valor: string): Termo | undefined {
    const termoId = Object.keys(this.db).find(
      id => 'valor' in this.db[id] && this.db[id].valor === valor
    );

    if (!termoId) return undefined;
    return { id: termoId, ...this.db[termoId] } as Termo;
  }

  /**
   * Busca por expressões que atendam ao filtro especificado.
   *
   * @param {Id[]} termosIds - Ids dos termos a serem buscados.
   * @returns {Id[]} Ids das expressões encontradas.
   */
  private buscarExpressões(
    termosIds: Id[],
    condição: 'igual' | 'subexpressão' = 'igual'
  ): Expressão[] {
    const termosStr = `,${termosIds.join(',')},`;

    // Verifica se os termos atendem à condição especificada
    const verificação = {
      igual: (str: string) => str === termosStr,
      subexpressão: (str: string) => str.includes(termosStr),
    };

    const retorno = Object.keys(this.db)
      .filter(id => 'termos' in this.db[id]) // Filtra apenas expressões
      .map(id => ({ id, ...this.db[id] } as Expressão)) // Mapeia para incluir o Id
      .map(expressão => ({ expressão, str: `,${expressão.termos.join(',')},` })) // Cria objeto auxiliar com string com os termos da expressão
      .filter(obj =>
        verificação[condição] ? verificação[condição](obj.str) : false
      ) // Filtra expressões que atendem à condição
      .map(obj => obj.expressão); // Retorna as expressões encontradas

    if (condição === 'igual' && retorno.length > 1) {
      // Garante que não haja mais de uma expressão igual
      throw new Error('Mais de uma expressão encontrada');
    }

    return retorno;
  }

  /**
   * Obtém o ID de um termo existente pelo seu valor ou cria um novo termo.
   * @param {string} texto - Valor do termo a ser buscado ou criado.
   * @returns {Id} Id do termo.
   */
  termo(texto: string): Termo {
    if (!texto || !texto.trim()) {
      throw new Error('Texto inválido: não pode ser vazio ou apenas espaços.');
    }
    return this.buscarTermo(texto) || this.novoTermo(texto);
  }

  /**
   * Obtém o ID de uma expressão existente pelos IDs dos seus nós ou cria uma nova expressão.
   * @param {Id[]} termosIds - IDs dos nós que compõem a expressão.
   * @param {ExpressãoProps} [props] - Propriedades adicionais da expressão.
   * @returns {Id} Id da expressão.
   * @throws {Error} Se mais de uma expressão for encontrada.
   */
  private getExpressão(termosIds: Id[], props?: ExpressãoProps): Expressão {
    const expressões = this.buscarExpressões(termosIds);

    if (expressões.length === 0) {
      const expressão = this.novaExpressão(termosIds, props);
      this.relacionarSubexpressões(expressão);
      return expressão;
    } else {
      return expressões[0];
    }
  }

  /**
   * Relaciona o conteúdo mandatório a partir de uma lista de textos contendo termos ou expressões.
   *
   * @param {string[]} contém - Lista de textos que serão relacionados como termos ou expressões ocultas.
   */
  private relacionarConteúdoMandatório(expressão: Expressão, contém: string[]) {
    const conjuntoTermos = new Set<Id>();
    const conjuntoExpressões = new Set<Id>();

    // Identifica os termos e expressões mandatórios
    contém.forEach(texto => {
      const termos = this.tokenize(texto).map(token => this.termo(token));
      if (termos.length === 1) {
        // Se somente um termo, adiciona-o ao conjunto de termos
        conjuntoTermos.add(termos[0].id);
      } else if (termos.length > 1) {
        // Se mais de um termo, busca ou cria uma expressão e adiciona-a ao conjunto de expressões
        conjuntoExpressões.add(this.getExpressão(termos.map(t => t.id)).id);
      }
    });

    // Define os termos ocultos
    [...conjuntoTermos]
      .filter(termo => !expressão.termos.includes(termo))
      .forEach(oculto =>
        this.update(expressão, 'termosOcultos', oculto, 'add')
      );
    expressão.termosOcultos.forEach(termoId => {
      const termo = this.get(termoId) as Termo;
      this.definePertencimento(expressão.id, termo);
    });

    // Define as expressões ocultas
    [...conjuntoExpressões]
      .filter(exprId => !expressão.subexpressões.includes(exprId)) // Filtra subexpressões já existentes
      .forEach(oculta => this.update(expressão, 'expressõesOcultas', oculta));
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
    { contém }: ExpressãoProps = { contém: [] }
  ): Expressão | Termo {
    if (!texto || !texto.trim()) {
      throw new Error('Não são permitidas expressões vazias');
    }

    // Transforma 'texto' em um conjunto de termos que podem ser uma palavra ou uma pontuação
    const termos = this.tokenize(texto);

    // Se apenas um termo, retorna o termo correspondente
    if (termos.length === 1) return this.termo(termos[0]);

    // Busca os termos existentes ou cria novos termos
    const ids = termos.map(t => this.termo(t).id);

    const expressão = this.getExpressão(ids);

    this.relacionarConteúdoMandatório(expressão, contém);

    return expressão;
  }

  /**
   * Identifica se há na expressão alguma subexpressão já cadastrada.
   * Se houver, relaciona a subexpressão à expressão.
   *
   * @param {Id} expressãoId - Id da expressão a ser relacionada.
   */
  private relacionarSubexpressões(expressão: Expressão) {
    this.buscarExpressões(expressão.termos, 'subexpressão')
      .filter(superExpr => superExpr.id !== expressão.id) // Ignora a própria expressão
      .forEach(superExpressão => {
        this.relacionaSubexpressão(expressão, superExpressão);
      });

    // Percorre os termos da expressão, buscando subexpressões.
    // A cada iteração reduz o número de termos a serem verificados até o limite de 2 termos.
    for (let n = expressão.termos.length - 1; n >= 2; n--) {
      // Verifica todas as subexpressões de tamanho 'n' dentro da expressão principal.
      for (let início = 0; início < expressão.termos.length - n + 1; início++) {
        const termosSubexpressão = expressão.termos.slice(início, início + n);

        const subExpressões = this.buscarExpressões(termosSubexpressão);
        if (subExpressões.length === 0) continue;

        this.relacionaSubexpressão(subExpressões[0], expressão);
      }
    }
  }

  private relacionaSubexpressão(subExpressão: Expressão, expressão: Expressão) {
    if (!expressão.subexpressões.includes(subExpressão.id)) {
      expressão.subexpressões.push(subExpressão.id);
      this.update(subExpressão, 'contidaEm', expressão.id); // Update to reflect the current expression
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
      if (index === -1) {
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
  tokenize(s: string): string[] {
    return this.tokenizer.tokenize(s);
  }

  /**
   * Executa a operação inversa de tokenize().
   * Ou seja, recebe um arranjo de strings e retorna uma string com os tokens unidos.
   *
   * @param {string[]} nós - Tokens a serem unidos.
   * @returns {string} texto resultante.
   */
  detokenize(nós: string[]): string {
    return this.tokenizer.detokenize(nós);
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
