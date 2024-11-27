type Elemento = {
  id: string;
};

type Nó = { tipo: "nó"; valor: string; arestas: string[]; visitado?: boolean };

type Aresta = {
  tipo: "aresta";
  v1: string;
  label: string;
  v2: string;
  arestas: string[];
  visitado?: boolean;
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
      console.log(`# ${this.getText(elemento.id, true)}`);

      for (const id of nó.arestas) {
        const { v1, label, v2, arestas } = this.db[id] as Aresta;
        this.db[id] = { ...this.db[id], visitado: true };

        if (v1 == elemento.id) {
          const Label = this.getText(label, true);
          const V2 = this.getText(v2, true);
          console.log(`- ${Label}: ${V2}`);

          for (const id2 of arestas) {
            const { v1, label, v2 } = this.db[id2] as Aresta;
            this.db[id2] = { ...this.db[id2], visitado: true };
            const Label = this.getText(label, true);
            const V2 = this.getText(v2, true);
            console.log(`  ${Label}: ${V2}`);
          }
        }
      }
      console.log();
    } else {
      throw new Error("Elemento não é um nó");
    }
  }

  marcaNãoVisitados() {
    for (let key in this.db) {
      this.db[key] = { ...this.db[key], visitado: false };
    }
  }

  imprimirNãoVisitados() {
    console.log("# Não visitados");

    for (let key in this.db) {
      if (!this.db[key].visitado) {
        console.log(`- ${key}: ${this.getText(key)}`);
      }
    }
  }

  private getText(
    id: string,
    setVisitado: boolean = false
  ): string | undefined {
    const elemento = this.db[id];
    if (setVisitado) elemento.visitado = true;

    if (elemento.tipo == "nó") return elemento.valor;
    if (elemento.tipo == "aresta") {
      const v1 = this.getText(elemento.v1, setVisitado);
      const label = this.getText(elemento.label, setVisitado);
      const v2 = this.getText(elemento.v2, setVisitado);
      return `[${v1}], [${label}] [${v2}]`;
    }
  }

  salvar() {
    const fs = require("fs");
    fs.writeFile("./Bíblia.json", JSON.stringify(this.db), (err: any) => {
      if (err) throw err;
      console.log("Dados salvos com sucesso!");
    });
  }
}
