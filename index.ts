type Elemento = {
  id: number;
};

//Classe para manipular
class Graphit {
  db: {
    [key: string]:
      | { tipo: "nó"; valor: string; índice: number[] }
      | {
          tipo: "aresta";
          v1: number;
          v2: number;
          label: number;
          índice: number[];
        };
  };
  constructor() {
    //Recupera de Bíblia.json
    this.db = {}; //require("./Bíblia.json");
  }

  inserirNó(valor: string): Elemento {
    let id = Object.keys(this.db).length;
    //id = id.toString(36); //TODO: Converte id em base 36

    this.db[id] = { tipo: "nó", valor: valor, índice: [] };
    return { id };
  }

  inserirAresta(v1: Elemento, v2: Elemento, label: Elemento): Elemento {
    let id = Object.keys(this.db).length;
    //id = id.toString(36); //TODO: Converte id em base 36

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

  salvar() {
    const fs = require("fs");
    fs.writeFile("./Bíblia2.json", JSON.stringify(this.db), (err: any) => {
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

let graphit = new Graphit();
console.log(graphit.listarNós());
console.log(graphit.listarArestas());

const versículo = graphit.inserirNó(
  "No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos."
);
const Asa = graphit.inserirNó("Asa");
const Baasa = graphit.inserirNó("Baasa");
const Aías = graphit.inserirNó("Aías");
const Judá = graphit.inserirNó("Judá");
const filhoDe = graphit.inserirNó("filho de");
const reiDe = graphit.inserirNó("rei de");
const Israel = graphit.inserirNó("Israel");
const Tirza = graphit.inserirNó("Tirza");
const coroadoEm = graphit.inserirNó("coroado em");
const durante = graphit.inserirNó("durante");
const anos24 = graphit.inserirNó("24 anos");
const inicio = graphit.inserirNó("início");
const terceiroAnoDoReinadoDeAsa = graphit.inserirNó("3º ano do reinado de Asa");

graphit.inserirAresta(Asa, Judá, reiDe);
graphit.inserirAresta(Baasa, Aías, filhoDe);
graphit.inserirAresta(Baasa, Israel, reiDe);
graphit.inserirAresta(Baasa, Tirza, coroadoEm);
graphit.inserirAresta(Baasa, anos24, durante);
graphit.inserirAresta(Baasa, terceiroAnoDoReinadoDeAsa, inicio);

graphit.salvar();

console.log(graphit.listarNós());
//graphit.inserirAresta("1", "2", "teste");
console.log(graphit.listarArestas());
