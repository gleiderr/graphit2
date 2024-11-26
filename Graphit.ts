type Elemento = {
  id: string;
};

type Nó = { tipo: "nó"; valor: string; índice: string[] };

type Aresta = {
  tipo: "aresta";
  v1: string;
  label: string;
  v2: string;
  índice: string[];
};

//Classe para manipular
export class Graphit {
  db: {
    [key: string]: Nó | Aresta;
  };
  constructor() {
    //Recupera de Bíblia.json
    this.db = {}; //require("./Bíblia.json");
  }

  inserirNó(valor: string): Elemento {
    let id = Object.keys(this.db).length.toString(36);

    this.db[id] = { tipo: "nó", valor: valor, índice: [] };
    return { id };
  }

  // TODO: implementar aresta de volta para toda aresta
  inserirAresta(v1: Elemento, label: Elemento, v2: Elemento): Elemento {
    let id = Object.keys(this.db).length.toString(36);

    this.db[id] = {
      tipo: "aresta",
      v1: v1.id,
      v2: v2.id,
      label: label.id,
      índice: [],
    };

    this.db[v1.id].índice.push(id);
    this.db[v2.id].índice.push(id);
    this.db[label.id].índice.push(id);

    return { id };
  }

  imprimir(elemento: Elemento) {
    if (this.db[elemento.id].tipo == "nó") {
      const nó = this.db[elemento.id] as Nó;
      console.log(this.getValor(elemento.id));

      for (const id of nó.índice) {
        const { v1, label, v2 } = this.db[id] as Aresta;
        if (v1 == elemento.id) {
          const Label = this.getValor(label);
          const V2 = this.getValor(v2);
          console.log(`- ${Label}: ${V2}`);
        }
      }
      for (let i = 0; i < nó.índice.length; i++) {
        const id = nó.índice[i];
      }
    } else {
      // const aresta = this.db[elemento.id] as Aresta;
      // this.imprimir({ id: aresta.v1 });
      // console.log(this.db[aresta.label].valor);
      // this.imprimir({ id: aresta.v2 });
    }
  }

  private getValor(id: string) {
    const nó = this.db[id] as Nó;
    return nó.valor;
  }

  salvar() {
    const fs = require("fs");
    fs.writeFile("./Bíblia.json", JSON.stringify(this.db), (err: any) => {
      if (err) throw err;
      console.log("Dados salvos com sucesso!");
    });
  }

  buscarNó(valor: string) {
    for (let i in this.db) {
      if (this.db[i].tipo == "nó" && this.db[i].valor == valor) {
        return i;
      }
    }
    return null;
  }

  listarNós() {
    let nós = [];
    for (let i in this.db) {
      if (this.db[i].tipo == "nó") {
        nós.push(this.db[i].valor);
      }
    }
    return nós;
  }

  listarArestas() {
    let arestas = [];
    for (let i in this.db) {
      if (this.db[i].tipo == "aresta") {
        arestas.push({
          v1: this.db[i].v1,
          v2: this.db[i].v2,
          label: this.db[i].label,
        });
      }
    }
    return arestas;
  }
}
