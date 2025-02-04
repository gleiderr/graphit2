import { readFileSync, writeFileSync } from 'fs';
import * as prettier from 'prettier';

type ArestaProps = { label: string };

export type Id = string;

type Nó = { valor: string; arestas: Id[] };
type Aresta = { nós: Id[]; arestas: Id[]; props?: ArestaProps };

// TODO: remover obrigatoriedade de `arestas` em `Descrição`?
export type DescriçãoAresta = {
  id: Id;
  nós: Descrição[];
  arestas: DescriçãoAresta[];
};
export type DescriçãoNó = { id: Id; valor: string; arestas: DescriçãoAresta[] };
export type Descrição = DescriçãoNó | DescriçãoAresta;

/**
 * Implementa hipergrafo híbrido para manipulação de textos.
 * Tanto arestas como nós são vértices do grafo que podem ser conectados por arestas.
 * Arestas são na verdade hiperarestas que conectam dois ou mais nós.
 */
class Graphit {
  private db: { [key: string]: Nó | Aresta } = {};
  private listeners: { [key in 'afterAresta']: ((id: Id) => void)[] } = {
    afterAresta: [],
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
    this.db[id] = { valor, arestas: [] };
    return id;
  }

  private novaAresta(nós: Id[], props?: ArestaProps): Id {
    const id = this.nextId();
    this.db[id] = { nós, arestas: [], props };
    nós.forEach(nó => this.db[nó].arestas.push(id));
    return id;
  }

  get(id: Id): Nó | Aresta {
    if (!this.db[id]) throw new Error(`Nó não encontrado ${id}`);
    return this.db[id];
  }

  buscarNó(valor: string): Id | undefined {
    return Object.keys(this.db).find(id =>
      'valor' in this.db[id] ? this.db[id].valor === valor : false,
    );
  }

  /**
   * Busca por arestas que contenham exatamente os mesmos nós passados por parâmetro e na mesma ordem.
   * @param nós
   */
  private buscarArestasExatas(nós: Id[]): Id[] {
    const arestas: Id[] = [];
    for (const id of Object.keys(this.db)) {
      const elemento = this.db[id];
      if ('nós' in elemento) {
        if (elemento.nós.length === nós.length) {
          const temMesmosIds = elemento.nós.every((nó, i) => nó === nós[i]);
          if (temMesmosIds) arestas.push(id);
        }
      }
    }

    return arestas;
  }

  /**
   * Busca arestas que contenham todos ids passados por parâmetro em qualquer ordem.
   * @param nós
   */
  filtrarArestas({ contém }: { contém: Id[] }): Id[] {
    const arestas: Id[] = [];
    for (const id of Object.keys(this.db)) {
      const elemento = this.db[id];
      if ('nós' in elemento) {
        const temTodosIds = contém.every(id => elemento.nós.includes(id));
        if (temTodosIds) arestas.push(id);
      }
    }
    return arestas;
  }

  buscarArestaByLabel(label: string): Id | undefined {
    return Object.keys(this.db).find(id =>
      'props' in this.db[id] ? this.db[id].props?.label === label : false,
    );
  }

  addListener(on: 'afterAresta', callback: (id: Id) => void) {
    return this.listeners[on].push(callback) - 1;
  }

  removeListener(on: 'afterAresta', index: number) {
    this.listeners[on].splice(index, 1);
  }

  /**
   * Retorna o id da aresta cujos nós coincidem com os valores informados.
   * Se não encontrar cria uma nova aresta reaproveitando os nós existentes
   * e cria novos nós sempre que necessário.
   */
  aresta(
    nós: string | (string | { id: Id })[],
    props?: ArestaProps,
  ): { id: Id } {
    if (typeof nós === 'string') {
      // Transforma 's' em um conjunto de termos que podem ser uma palavra ou uma pontuação
      nós = this.tokens(nós);
    }
    const ids = nós.map(nó =>
      typeof nó === 'object' ? nó.id : this.buscarNó(nó) || this.novoNó(nó),
    );

    const arestas = this.buscarArestasExatas(ids);
    if (arestas.length > 1) throw new Error('Mais de uma aresta encontrada');

    const id = arestas[0] || this.novaAresta(ids, props);

    if (!this.listening) {
      this.listening = true;
      this.listeners.afterAresta.forEach(listener => listener(id));
      this.listening = false;
    }

    return { id };
  }

  /**
   * Move aresta de uma posição para outra.
   * @param nó
   * @param origem
   * @param destino
   */
  moverAresta(nó: Id, origem: number | Id, destino: number | Id) {
    const elemento = this.get(nó);

    const getIndex = (id: Id) => {
      const index = elemento.arestas.indexOf(id);
      if (index >= 0) return index;
      else throw new Error(`Aresta "${id}" não pertence ao nó "${nó}"`);
    };

    origem = typeof origem === 'number' ? origem : getIndex(origem);
    destino = typeof destino === 'number' ? destino : getIndex(destino);

    if (origem >= elemento.arestas.length) {
      throw new Error(`Índice de origem "${origem}" é inválido`);
    }
    if (destino >= elemento.arestas.length) {
      throw new Error(`Índice de destino "${destino}" é inválido`);
    }

    elemento.arestas.splice(destino, 0, elemento.arestas.splice(origem, 1)[0]);
  }

  /**
   * Exclui aresta.
   * Lança excessão se o id não pertencer a uma aresta.
   * Lança excessão se a aresta pertencer a outras arestas.
   * @param id Identificador da aresta a ser removida.
   */
  excluirAresta(id: Id) {
    const elemento = this.get(id);
    if (!('nós' in elemento))
      throw new Error(`O elemento ${id} não é uma aresta`);

    if (elemento.arestas.length > 0)
      throw new Error(`A aresta ${id} pertence a outras arestas`);

    elemento.nós.forEach(nó => this.desvincularAresta(nó, id));

    delete this.db[id];
  }

  /**
   * Remove aresta de um nó.
   * @param nó
   * @param aresta
   */
  private desvincularAresta(nó: Id, aresta: Id) {
    const elemento = this.get(nó);

    const index = elemento.arestas.indexOf(aresta);
    if (index == -1) {
      throw new Error(`Aresta "${aresta}" não pertence ao nó "${nó}"`);
    }

    elemento.arestas.splice(index, 1);

    // Se não houver mais arestas relacionadas ao nó, remove-o
    if ('valor' in elemento && elemento.arestas.length === 0) {
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
   * Descreve vértice do grafo criando uma estrutura de árvore, percorrendo as arestas em largura. O limite da profundidade das buscas é definido pelo parâmetro `profundidade`. Há também um critério de parada por nós específicos definido por `pararEm`.
   */
  descrever(id: Id): Descrição {
    this.visitados = new Set<Id>(id);

    const _1ºelemento = this.descreverElemento(id);

    const fila: Descrição[] = [_1ºelemento];
    while (fila.length) {
      const descriçãoCorrente = fila.shift()!;
      const vértice = this.db[descriçãoCorrente.id];

      vértice.arestas.forEach((id: Id) => {
        if (this.visitados.has(id)) return;
        this.visitados.add(id);

        const aresta = this.get(id) as Aresta;
        const nós = aresta.nós.map(this.descreverElemento.bind(this));

        const descriçãoAresta: Descrição = { id, nós, arestas: [] };
        descriçãoCorrente.arestas.push(descriçãoAresta);

        fila.push(descriçãoAresta);
      });
    }

    return _1ºelemento;
  }

  private descreverElemento(id: Id): Descrição {
    const elemento = this.get(id);
    this.visitados.add(id);

    if ('valor' in elemento) {
      return { id, valor: elemento.valor, arestas: [] };
    } else {
      const nós = elemento.nós.map(this.descreverElemento.bind(this));
      return { id, nós, arestas: [] };
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
export const aresta = graphit.aresta.bind(graphit);
export const tokens = graphit.tokens.bind(graphit);
