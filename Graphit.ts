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

type QuatroIds = [{ id: Id }, { id: Id }, { id: Id }, { id: Id }];
type CincoIds = [{ id: Id }, { id: Id }, { id: Id }, { id: Id }, { id: Id }];

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

  inserirAresta(
    v1: { id: Id } | string,
    v2: { id: Id } | string,
    label1: { id: Id } | string,
    label2: { id: Id } | string
  ): CincoIds;
  inserirAresta(
    v1: { id: Id } | string,
    v2: { id: Id } | string,
    label1: { id: Id } | string
  ): QuatroIds;

  inserirAresta(
    v1: { id: Id } | string,
    v2: { id: Id } | string,
    label1: { id: Id } | string,
    label2?: { id: Id } | string
  ): CincoIds | QuatroIds {
    if (typeof v1 == 'string') v1 = { id: this.inserirNó(v1) };
    if (typeof v2 == 'string') v2 = { id: this.inserirNó(v2) };
    if (typeof label1 == 'string') label1 = { id: this.inserirNó(label1) };
    if (typeof label2 == 'string') label2 = { id: this.inserirNó(label2) };

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

  getElemento(id: Id): Elemento {
    return { id, ...this.db[id] };
  }

  async salvar(arquivo: string) {
    await writeFile(arquivo, JSON.stringify(this.db));
    console.log('Dados salvos com sucesso!');
  }
}

export let graphit = new Graphit();
