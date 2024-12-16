import { writeFile } from 'fs/promises';

export type Id = string;

export type Nó = {
  tipo: 'nó';
  valor: string;
  arestas: Id[];
};

export type Aresta = {
  tipo: 'aresta';
  v1: Id;
  v2: Id;
  label1: Id;
  label2?: Id;
  arestas: Id[];
};

export type ElementoAresta = { id: Id } & Aresta;
export type ElementoNó = { id: Id } & Nó;
export type Elemento = ElementoAresta | ElementoNó;

type TrêsNós = [{ id: Id } | string, { id: Id } | string, { id: Id } | string];
type QuatroNós = [
  { id: Id } | string,
  { id: Id } | string,
  { id: Id } | string,
  { id: Id } | string
];

type QuatroIds = [{ id: Id }, { id: Id }, { id: Id }, { id: Id }];
type CincoIds = [{ id: Id }, { id: Id }, { id: Id }, { id: Id }, { id: Id }];

type Reuse = {
  reuseV1?: boolean;
  reuseV2?: boolean;
  reuseL1?: boolean;
  reuseL2?: boolean;
};

//Classe para manipular
export class Graphit {
  _nextId = 0;
  private db: { [key: string]: Nó | Aresta };

  private memóriaDeArestas: (QuatroIds | CincoIds)[] = [];

  constructor() {
    //Recupera de Bíblia.json
    this.db = {}; //require("./Bíblia.json");
  }

  get índices() {
    return Object.keys(this.db);
  }

  inserirNó(valor: string): Id {
    const id = this.nextId();
    this.db[id] = { tipo: 'nó', valor: valor, arestas: [] };
    return id;
  }

  private nextId() {
    return (this._nextId++).toString(36);
  }

  iniciarMemória() {
    this.memóriaDeArestas = [];
  }

  getMemória() {
    return this.memóriaDeArestas;
  }

  inserirAresta(elementos: TrêsNós, reuse?: Reuse): QuatroIds;
  inserirAresta(elementos: QuatroNós, reuse?: Reuse): CincoIds;
  inserirAresta(
    elementos: TrêsNós | QuatroNós,
    { reuseV1, reuseV2, reuseL1, reuseL2 }: Reuse = {}
  ): QuatroIds | CincoIds {
    let [v1, v2, label1, label2] = elementos;

    if (typeof v1 == 'string') v1 = this.defineNó(v1, reuseV1);
    if (typeof v2 == 'string') v2 = this.defineNó(v2, reuseV2);
    if (typeof label1 == 'string') label1 = this.defineNó(label1, reuseL1);
    if (typeof label2 == 'string') label2 = this.defineNó(label2, reuseL2);

    const novoId = this.nextId();
    this.db[novoId] = {
      tipo: 'aresta',
      v1: v1.id,
      v2: v2.id,
      label1: label1.id,
      label2: label2?.id,
      arestas: [],
    };

    this.db[v1.id].arestas.push(novoId);
    this.db[v2.id].arestas.push(novoId);
    this.db[label1.id].arestas.push(novoId);
    if (label2) this.db[label2.id].arestas.push(novoId);

    const ids: QuatroIds | CincoIds = label2
      ? [{ id: novoId }, v1, v2, label1, label2]
      : [{ id: novoId }, v1, v2, label1];

    this.memóriaDeArestas = [...this.memóriaDeArestas, ids];
    return ids;
  }

  private defineNó(valor: string, reuse?: boolean): { id: Id } {
    const nós = this.buscarNó(valor);
    if (nós.length == 1) {
      if (reuse === undefined) console.warn('Outro nó encontrado', nós[0]);
      if (reuse) return { id: nós[0].id };
    } else if (nós.length > 1) console.warn('Outros nós encontrados', nós);

    return { id: this.inserirNó(valor) };
  }

  buscarNó(valor: string): ElementoNó[] {
    let nós: ElementoNó[] = [];
    for (const id of this.índices) {
      const elemento = this.getElemento(id);
      if (elemento.tipo == 'nó' && elemento.valor == valor) {
        nós = [...nós, elemento];
      }
    }

    return nós;
  }

  getElemento(id: Id): Elemento {
    return { id, ...this.db[id] };
  }

  async salvar(arquivo: string) {
    await writeFile(arquivo, JSON.stringify(this.db));
    console.log('Dados salvos com sucesso!');
  }
}

export let graphit = new Graphit();
