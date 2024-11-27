type Elemento = {
  id: string;
};

type Nó = { tipo: "nó"; valor: string; arestas: string[] };

type Aresta = {
  tipo: "aresta";
  v1: string;
  label: string;
  v2: string;
  arestas: string[];
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

    this.db[id] = { tipo: "nó", valor: valor, arestas: [] };
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
      arestas: [],
    };

    this.db[v1.id].arestas.push(id);
    this.db[v2.id].arestas.push(id);
    this.db[label.id].arestas.push(id);

    return { id };
  }

  imprimir(elemento: Elemento) {
    if (this.db[elemento.id].tipo == "nó") {
      const nó = this.db[elemento.id] as Nó;
      console.log(`# ${this.getValor(elemento.id)}`);

      for (const id of nó.arestas) {
        const { v1, label, v2, arestas } = this.db[id] as Aresta;
        if (v1 == elemento.id) {
          const Label = this.getValor(label);
          const V2 = this.getValor(v2);
          console.log(`- ${Label}: ${V2}`);

          for (const id2 of arestas) {
            const { v1, label, v2 } = this.db[id2] as Aresta;
            const Label = this.getValor(label);
            const V2 = this.getValor(v2);
            console.log(`  ${Label}: ${V2}`);
          }
        }
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
}
