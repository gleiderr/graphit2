import { writeFile } from "fs/promises";

export type Id = { id: string };

export type Nó = {
  tipo: "nó";
  valor: string;
  arestas: string[];
};

export type Aresta = {
  tipo: "aresta";
  v1: string;
  label: string;
  v2: string;
  arestas: string[];
};

export type ElementoAresta = Id & {
  tipo: "aresta";
  v1: Id;
  label: Id;
  v2: Id;
  arestas: string[];
};

export type Elemento = (Id & Nó) | ElementoAresta;

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
    return { id };
  }

  // TODO: implementar aresta de volta para toda aresta
  inserirAresta(v1: Id, label: Id, v2: Id): Id {
    let id = Object.keys(this.db).length.toString(36);

    this.db[id] = {
      tipo: "aresta",
      v1: v1.id,
      v2: v2.id,
      label: label.id,
      arestas: [],
    };

    this.db[v1.id].arestas.push(id);
    this.db[v2.id].arestas.push(id);
    this.db[label.id].arestas.push(id);

    return { id };
  }

  getValor({ id }: Id): Elemento {
    if (this.db[id].tipo === "nó") {
      const valor = this.db[id].valor;
      const arestas = this.db[id].arestas;
      return { id, tipo: "nó", valor, arestas };
    } else {
      const v1 = { id: this.db[id].v1 };
      const label = { id: this.db[id].label };
      const v2 = { id: this.db[id].v2 };
      const arestas = this.db[id].arestas;
      return { id, tipo: "aresta", v1, label, v2, arestas };
    }
  }

  async salvar(arquivo: string) {
    await writeFile(arquivo, JSON.stringify(this.db));
    console.log("Dados salvos com sucesso!");
  }
}
