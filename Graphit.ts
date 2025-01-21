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

  buscarArestaByIds(nós: Id[]): Id | undefined {
    return Object.keys(this.db).find(id =>
      'nós' in this.db[id] ?
        this.db[id].nós.every((nó, i) => nó === nós[i])
      : false,
    );
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
    const id = this.buscarArestaByIds(ids) || this.novaAresta(ids, props);

    if (!this.listening) {
      this.listening = true;
      this.listeners.afterAresta.forEach(listener => listener(id));
      this.listening = false;
    }

    return { id };
  }

  /**
   * Move aresta de uma posição para outra.
   * @param s
   * @returns
   */
  moveAresta(nó: Id, origem: number, destino: number) {
    const elemento = this.get(nó);
    elemento.arestas.splice(destino, 0, elemento.arestas.splice(origem, 1)[0]);
  }

  tokens(s: string) {
    return s
      .split(/(\s+|[,.;:]|\?)/) // TODO: incluir hífen como token
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
    this._nextId = Object.keys(this.db).length;
  }
}

export const graphit = new Graphit();
export const aresta = graphit.aresta.bind(graphit);
export const tokens = graphit.tokens.bind(graphit);
