import { writeFile } from 'fs/promises';
import * as prettier from 'prettier';

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
  l1?: Id;
  l2?: Id;
  arestas: Id[];
};

export type ElementoAresta = { id: Id } & Aresta;
export type ElementoNó = { id: Id } & Nó;
export type Elemento = ElementoAresta | ElementoNó;

type DoisNós = [{ id: Id } | string, { id: Id } | string];
type TrêsNós = [{ id: Id } | string, { id: Id } | string, { id: Id } | string];
type QuatroNós = [
  { id: Id } | string,
  { id: Id } | string,
  { id: Id } | string,
  { id: Id } | string,
];

type TrêsIds = [{ id: Id }, { id: Id }, { id: Id }];
type QuatroIds = [{ id: Id }, { id: Id }, { id: Id }, { id: Id }];
type CincoIds = [{ id: Id }, { id: Id }, { id: Id }, { id: Id }, { id: Id }];

type Reuse = {
  reuseV1?: boolean;
  reuseV2?: boolean;
  reuseL1?: boolean;
  reuseL2?: boolean;
  reuseAresta?: boolean;
};

//Classe para manipular
export class Graphit {
  _nextId = 0;
  private db: { [key: string]: Nó | Aresta };

  private memóriaDeArestas: (TrêsIds | QuatroIds | CincoIds)[] = [];

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

  inserirAresta(elementos: DoisNós, reuse?: Reuse): TrêsIds;
  inserirAresta(elementos: TrêsNós, reuse?: Reuse): QuatroIds;
  inserirAresta(elementos: QuatroNós, reuse?: Reuse): CincoIds;
  inserirAresta(
    elementos: DoisNós | TrêsNós | QuatroNós,
    { reuseV1, reuseV2, reuseL1, reuseL2, reuseAresta }: Reuse = {},
  ): TrêsIds | QuatroIds | CincoIds {
    let [v1, v2, l1, l2] = elementos;

    if (typeof v1 == 'string') v1 = this.defineNó(v1, reuseV1);
    if (typeof v2 == 'string') v2 = this.defineNó(v2, reuseV2);
    if (typeof l1 == 'string') l1 = this.defineNó(l1, reuseL1);
    if (typeof l2 == 'string') l2 = this.defineNó(l2, reuseL2);

    const novoId = this.defineAresta(v1.id, v2.id, l1?.id, l2?.id, reuseAresta);

    this.db[v1.id].arestas.push(novoId);
    this.db[v2.id].arestas.push(novoId);
    if (l1) this.db[l1.id].arestas.push(novoId);
    if (l2) this.db[l2.id].arestas.push(novoId);

    const ids: TrêsIds | QuatroIds | CincoIds =
      l1 && l2 ? [{ id: novoId }, v1, v2, l1, l2]
      : l1 ? [{ id: novoId }, v1, v2, l1]
      : [{ id: novoId }, v1, v2];

    this.memóriaDeArestas = [...this.memóriaDeArestas, ids];
    return ids;
  }

  private defineAresta(v1: Id, v2: Id, l1?: Id, l2?: Id, reuse?: boolean): Id {
    const arestas = this.buscarAresta(v1, v2, l1, l2);
    if (arestas.length == 1) {
      if (reuse === undefined) console.warn('Aresta igual', arestas[0]);
      if (reuse) return arestas[0].id;
    } else if (arestas.length > 1) {
      console.warn('Mais de uma aresta igual', arestas);
    }

    const id = this.nextId();
    this.db[id] = { tipo: 'aresta', v1, v2, l1, l2, arestas: [] };
    return id;
  }

  private defineNó(valor: string, reuse?: boolean): { id: Id } {
    const nós = this.buscarNó(valor);
    if (nós.length == 1) {
      if (reuse === undefined) console.warn('Nó igual', nós[0]);
      if (reuse) return { id: nós[0].id };
    } else if (nós.length > 1) console.warn('Mais de um nó igual', nós);

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

  buscarAresta(v1: Id, v2: Id, l1?: Id, l2?: Id): ElementoAresta[] {
    let arestas: ElementoAresta[] = [];
    for (const id of this.índices) {
      const elemento = this.getElemento(id);
      if (
        elemento.tipo == 'aresta' &&
        elemento.v1 == v1 &&
        elemento.v2 == v2 &&
        (elemento.l1 == l1 || !l1) &&
        (elemento.l2 == l2 || !l2)
      ) {
        arestas = [...arestas, elemento];
      }
    }

    return arestas;
  }

  reordenar(elemento: Id, origem: number, destino: number) {
    const { arestas } = this.db[elemento];

    // Remove aresta da origem e insere no destino
    const aresta = arestas.splice(origem, 1)[0];
    arestas.splice(destino, 0, aresta);
  }

  getElemento(id: Id): Elemento {
    return { id, ...this.db[id] };
  }

  async salvar(arquivo: string) {
    const dados = await prettier.format(JSON.stringify(this.db), {
      parser: 'json',
    });
    await writeFile(arquivo, dados);
    console.log('Dados salvos com sucesso!');
  }
}

export const graphit = new Graphit();
