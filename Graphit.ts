import { writeFile } from "fs/promises";

export type Id = string;

export type Nó = {
  tipo: "nó";
  valor: string;
  arestas: Id[];
};

export type Aresta = {
  tipo: "aresta";
  v1: Id;
  label1: Id;
  label2: Id;
  v2: Id;
  arestas: Id[];
};

export type ElementoAresta = { id: Id } & Aresta;
export type ElementoNó = { id: Id } & Nó;
export type Elemento = ElementoAresta | ElementoNó;

//Classe para manipular
export class Graphit {
  private db: {
    [key: string]: Nó | Aresta;
  };
  constructor() {
    //Recupera de Bíblia.json
    this.db = {}; //require("./Bíblia.json");
  }

  inserirNó(valor: string): Id {
    let id = Object.keys(this.db).length.toString(36);

    this.db[id] = { tipo: "nó", valor: valor, arestas: [] };
    return id;
  }

  inserirAresta(v1: Id, label1: Id, label2: Id, v2: Id): Id {
    let id = Object.keys(this.db).length.toString(36);

    this.db[id] = { tipo: "aresta", v1, v2, label1, label2, arestas: [] };

    this.db[v1].arestas.push(id);
    this.db[v2].arestas.push(id);
    this.db[label1].arestas.push(id);
    this.db[label2].arestas.push(id);

    return id;
  }

  getValor(id: Id): Elemento {
    return { id, ...this.db[id] };
  }

  async salvar(arquivo: string) {
    await writeFile(arquivo, JSON.stringify(this.db));
    console.log("Dados salvos com sucesso!");
  }
}
