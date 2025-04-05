import { readFileSync, writeFileSync } from 'fs';
import { Tokenizer } from './Tokenizer';

type ExpressãoProps = {
  /** Texto para ser tokenizado e relacionado à expressão */
  contém: string[];
};

export type Id = string;

type Informação = {
  /** Id da informação */
  id: Id;
  /** Lista de Ids de informações contidas nesta informação. */
  contém: Id[];
  /** Lista de Ids de informações que contêm esta informação. */
  contidaEm: Id[];
};

/**
 * Representação de um termo.
 */
export type Termo = {
  /** Valor do termo propriamente dito. */
  valor: string;
  /** Conjunto de Ids de expressões a que o termo pertence. */
  pertence_a: Id[];
} & Informação;

/**
 * Representação de uma expressão.
 */
export type Expressão = {
  /** Lista de Ids dos termos pertencentes a esta expressão. */
  termos: Id[];
  /** Conjunto de Ids de expressões contidas nesta expressão. */
  subexpressões: Id[];
  /** Conjunto de Ids de expressões que contêm esta expressão. */
  subexpressãoDe: Id[];
} & Informação;

/**
 * Graphit é um manipulador informações representadas por expressões e termos.
 * Ele facilita a identificação relacionamentos entre informações.
 *
 * As expressões comportam-se como conjuntos de termos ou expressões.
 * Os termos comportam-se como elementos desses conjuntos.
 * Expressões e termos são representações de informações.
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
   * @returns {Termo} O novo termo criado.
   */
  private novoTermo(valor: string): Termo {
    const id = this.nextId();
    const novoTermo = { valor, pertence_a: [], contém: [], contidaEm: [] };
    this.db[id] = novoTermo;
    return { id, ...novoTermo };
  }

  /**
   * Cria uma nova expressão com os ids dos termos fornecidos.
   *
   * @param {Id[]} termos - Ids dos termos que compõem a expressão.
   * @returns {Expressão} A nova expressão criada.
   */
  private novaExpressão(termos: Id[]): Expressão {
    const novaExpressãoId = this.nextId();
    const novaExpressão = {
      termos: termos,
      subexpressões: [],
      subexpressãoDe: [],
      contém: [],
      contidaEm: [],
    };

    this.db[novaExpressãoId] = novaExpressão;
    termos.forEach(termoId => {
      const termo = this.get(termoId) as Termo;
      this.update(termo, 'pertence_a', novaExpressãoId);
    });

    return { id: novaExpressãoId, ...novaExpressão };
  }

  /**
   * Obtém informação pelo Id.
   * @param {Id} id - O Id da informação.
   * @returns {Termo | Expressão} Termo ou expressão correspondente.
   * @throws {Error} Se a informação não for encontrada.
   */
  get(id: Id): Termo | Expressão {
    if (!this.db[id]) throw new Error(`Informação não encontrada: ${id}`);
    return { id, ...this.db[id] };
  }

  /**
   * Atualiza um campo de uma informação existente.
   * @param informação - A informação a ser atualizada.
   * @param campo - Qualquer um dos campos da informação.
   * @param valor - O novo valor a ser atribuído.
   * @param operação - A operação a ser realizada.
   */
  update<Info extends Expressão | Termo>(
    informação: Info,
    campo: keyof Omit<Info, 'id'>,
    valor: Id,
    operação: 'add' = 'add'
  ) {
    const infoDB = this.db[informação.id] as Omit<Info, 'id'>;
    if (!infoDB) {
      throw new Error(`Informação não encontrada: ${informação.id}`);
    }

    if (!(campo in infoDB)) {
      throw new Error(`Campo inválido: ${String(campo)}`);
    }

    if (operação === 'add') {
      if (!Array.isArray(infoDB[campo])) {
        throw new Error(`Campo ${String(campo)} não é um array`);
      }

      if (
        campo === 'pertence_a' ||
        campo === 'subexpressões' ||
        campo === 'subexpressãoDe'
      ) {
        if (!infoDB[campo].includes(valor)) {
          // Se o valor não estiver presente, adiciona-o
          infoDB[campo].push(valor);
        }
      } else {
        infoDB[campo].push(valor);
      }

      return;
    }

    throw new Error(`Operação inválida: ${operação}`);
  }

  /**
   * Busca um termo pelo valor fornecido.
   * @param {string} valor - Valor do termo a ser buscado.
   * @returns {Id | undefined} Id do termo encontrado ou undefined se não encontrado.
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
      .filter(obj => verificação[condição](obj.str)) // Filtra expressões que atendem à condição
      .map(obj => obj.expressão); // Retorna as expressões encontradas

    if (condição === 'igual' && retorno.length > 1) {
      // Garante que não haja mais de uma expressão igual
      throw new Error('Mais de uma expressão encontrada');
    }

    return retorno;
  }

  // TODO: Tornar termo() em private
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
   * Obtém uma expressão existente identificada a partir dos IDs dos seus termos
   * ou cria uma nova expressão.
   *
   * @param {Id[]} termosIds - IDs dos nós que compõem a expressão.
   * @returns {Id} Id da expressão.
   */
  private getExpressão(termosIds: Id[]): Expressão {
    const expressões = this.buscarExpressões(termosIds);

    if (expressões.length === 0) {
      const expressão = this.novaExpressão(termosIds);
      this.relacionarSubexpressões(expressão);
      return expressão;
    } else {
      return expressões[0];
    }
  }

  /**
   * Relaciona o conteúdo a partir de uma lista de textos.
   *
   * @param {string[]} contém - Lista de textos que serão relacionados à informação.
   */
  private relacionarConteúdo(informação: Expressão | Termo, contém: string[]) {
    contém
      .map(texto => this.informação(texto))
      .forEach(conteúdo => {
        this.update(informação, 'contém', conteúdo.id, 'add');
        this.update(conteúdo, 'contidaEm', informação.id, 'add');
      });
  }

  /**
   * Retorna o Id da expressão cujos nós coincidem com os valores informados.
   * Se não encontrar, cria uma nova expressão ou termo reaproveitando os nós existentes
   * e cria novos nós sempre que necessário.
   *
   * @param {string} texto - Uma string a ser separada em termos.
   * @returns {Expressão | Termo} Expressão ou termo.
   *
   * @throws {Error} Se a expressão for vazia.
   */
  informação(
    texto: string,
    { contém }: ExpressãoProps = { contém: [] }
  ): Expressão | Termo {
    if (!texto || !texto.trim()) {
      throw new Error('Não são permitidas expressões vazias');
    }

    // Transforma 'texto' em um conjunto de termos que podem ser uma palavra ou uma pontuação
    const termos = this.tokenize(texto);

    // Se apenas um termo, retorna o termo correspondente
    let informação: Termo | Expressão;
    if (termos.length === 1) {
      informação = this.termo(termos[0]);
    } else {
      // Busca os termos existentes ou cria novos termos
      const ids = termos.map(t => this.termo(t).id);
      informação = this.getExpressão(ids);
    }

    this.relacionarConteúdo(informação, contém);

    return informação;
  }

  /**
   * Identifica se há na expressão alguma subexpressão já cadastrada
   * ou se ela mesma é uma subexpressão de uma expressão já cadastrada.
   *
   * Se houver, relaciona a subexpressão à expressão.
   *
   * @param {Expressão} expressão - A expressão a ser analisada.
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

        const subExpressão = subExpressões[0];
        this.relacionaSubexpressão(subExpressão, expressão);
      }
    }
  }

  private relacionaSubexpressão(subExpressão: Expressão, expressão: Expressão) {
    this.update(expressão, 'subexpressões', subExpressão.id);
    this.update(subExpressão, 'subexpressãoDe', expressão.id);
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
