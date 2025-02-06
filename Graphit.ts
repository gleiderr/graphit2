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

  private nextId() {
    return (this._nextId++).toString(36);
  }

  private novoNó(valor: string): Id {
    const id = this.nextId();
    this.db[id] = { valor, expressões: [] };
    return id;
  }

  private novaExpressão(nós: Id[], props?: ExpressãoProps): Id {
    const id = this.nextId();
    this.db[id] = { nós, expressões: [], props };
    nós.forEach(nó => this.db[nó].expressões.push(id));
    return id;
  }

  get(id: Id): Termo | Expressão {
    if (!this.db[id]) throw new Error(`Nó não encontrado ${id}`);
    return this.db[id];
  }

  buscarNó(valor: string): Id | undefined {
    return Object.keys(this.db).find(id =>
      'valor' in this.db[id] ? this.db[id].valor === valor : false,
    );
  }

  /**
   * Busca por expressões que contenham exatamente os mesmos nós passados por parâmetro e na mesma ordem.
   * @param nós
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
   * Busca expressões que contenham todos ids passados por parâmetro em qualquer ordem.
   * @param nós
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

  addListener(on: 'afterExpressão', callback: (id: Id) => void) {
    return this.listeners[on].push(callback) - 1;
  }

  removeListener(on: 'afterExpressão', index: number) {
    this.listeners[on].splice(index, 1);
  }

  /**
   * Retorna o id da expressão cujos nós coincidem com os valores informados.
   * Se não encontrar cria uma nova expressão reaproveitando os nós existentes
   * e cria novos nós sempre que necessário.
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
   * Move expressão de uma posição para outra.
   * @param nó
   * @param origem
   * @param destino
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
   * Exclui expressão.
   * Lança excessão se o id não pertencer a uma expressão.
   * Lança excessão se a expressão pertencer a outras expressões.
   * @param id Identificador da expressão a ser removida.
   */
  excluirExpressão(id: Id) {
    const elemento = this.get(id);
    if (!('nós' in elemento))
      throw new Error(`O elemento ${id} não é uma expressão`);

    if (elemento.expressões.length > 0)
      throw new Error(`A expressão ${id} pertence a outras expressões`);

    elemento.nós.forEach(nó => this.desvincularExpressão(nó, id));

    delete this.db[id];
  }

  /**
   * Remove expressão de um nó.
   * // TODO: Corrigir esse comentário
   * @param nó
   * @param expressão
   */
  private desvincularExpressão(nó: Id, expressão: Id) {
    const elemento = this.get(nó);

    const index = elemento.expressões.indexOf(expressão);
    if (index == -1) {
      throw new Error(`Expressão "${expressão}" não pertence ao nó "${nó}"`);
    }

    elemento.expressões.splice(index, 1);

    // Se não houver mais expressões relacionadas ao nó, remove-o
    if ('valor' in elemento && elemento.expressões.length === 0) {
      delete this.db[nó];
    }
  }

  tokens(s: string) {
    return s
      .split(/(\s+|[,.;:()"]|\?)/) // TODO: incluir hífen como token
      .map(s => s.trim())
      .filter(Boolean);
  }

  /**
   * Executa a operação inversa de tokenize().
   * Ou seja, recebe um arranjo de strings e retorna uma string.
   */
  undotokenize(nós: string[]) {
    return nós
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:-])/g, '$1');
  }

  /**
   * Descreve vértice do grafo criando uma estrutura de árvore, percorrendo
   * as expressões em largura.
   */
  descrever(id: Id): Descrição {
    this.visitados = new Set<Id>(id);

    const _1ºelemento = this.descreverElemento(id);

    const fila: Descrição[] = [_1ºelemento];
    while (fila.length) {
      const descriçãoCorrente = fila.shift()!;
      const vértice = this.db[descriçãoCorrente.id];

      vértice.expressões.forEach((id: Id) => {
        if (this.visitados.has(id)) return;
        this.visitados.add(id);

        const expressão = this.get(id) as Expressão;
        const nós = expressão.nós.map(this.descreverElemento.bind(this));

        const descriçãoExpressão: Descrição = { id, nós, expressões: [] };
        descriçãoCorrente.expressões.push(descriçãoExpressão);

        fila.push(descriçãoExpressão);
      });
    }

    return _1ºelemento;
  }

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
   *
   * @param arquivo
   */
  async salvar(arquivo: string) {
    const dados = await prettier.format(JSON.stringify(this.db), {
      parser: 'json',
    });
    writeFileSync(arquivo, dados);
  }

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
