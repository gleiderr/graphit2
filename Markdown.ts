import { Aresta, ElementoAresta, Graphit, Id, Nó } from "./Graphit";
import { readFileSync } from "fs";

export class Markdown {
  constructor(private graphit: Graphit) {}

  imprimir(id: Id) {
    const elemento = this.graphit.getValor(id);

    if (elemento.tipo == "nó") {
      console.log(`# ${elemento.valor}`);

      for (const i of elemento.arestas) {
        const aresta = this.graphit.getValor(i) as ElementoAresta;

        if (aresta.v1 == id) {
          const label = this.graphit.getValor(aresta.label1);
          const v2 = this.graphit.getValor(aresta.v2);

          if (label.tipo == "nó" && v2.tipo == "nó") {
            console.log(`- ${label.valor}: ${v2.valor}`);
            // if (label.arestas.length > 0) {
            //   console.log("Arestas label:", label.arestas);
            // }

            if (aresta.arestas.length > 0) {
              this.imprimirSubarestas(aresta);
            }
          } else {
            console.log(`Aresta 1:`, {
              ...aresta,
              v1: this.graphit.getValor(aresta.v1),
              label: this.graphit.getValor(aresta.label1),
              v2: this.graphit.getValor(aresta.v2),
            });
          }
        } else {
          console.log(`Aresta 2:`, {
            ...aresta,
            v1: this.graphit.getValor(aresta.v1),
            label: this.graphit.getValor(aresta.label1),
            v2: this.graphit.getValor(aresta.v2),
          });
        }
      }
    } else if (elemento.tipo == "aresta") {
      console.log(`Aresta: ${elemento}`);
    }

    // if (this.db[elemento.id].tipo == "nó") {

    //   for (const id of nó.arestas) {
    //     const { v1, label, v2, arestas } = this.db[id] as Aresta;
    //     this.db[id] = { ...this.db[id] };

    //     if (v1 == elemento.id) {
    //       const Label = this.getText(label, true);
    //       const V2 = this.getText(v2, true);
    //       console.log(`- ${Label}: ${V2}`);

    //       for (const id2 of arestas) {
    //         const { v1, label, v2 } = this.db[id2] as Aresta;
    //         this.db[id2] = { ...this.db[id2] };
    //         const Label = this.getText(label, true);
    //         const V2 = this.getText(v2, true);
    //         console.log(`  ${Label}: ${V2}`);
    //       }
    //     }
    //   }
    //   console.log();
    // } else {
    //   throw new Error("Elemento não é um nó");
    // }
  }

  private imprimirSubarestas(aresta: ElementoAresta) {
    const subArestas = aresta.arestas;
    for (const id of subArestas) {
      const subAresta = this.graphit.getValor(id) as ElementoAresta;
      if (subAresta.v1 == aresta.id) {
        const label = this.graphit.getValor(subAresta.label1);
        const v2 = this.graphit.getValor(subAresta.v2);

        if (label.tipo == "nó" && v2.tipo == "nó") {
          console.log(`  - ${label.valor}: ${v2.valor}`);
        } else {
          console.log("Subaresta1: ", subAresta);
        }
      } else {
        console.log("Subaresta2: ", subAresta);
      }
    }
  }

  // private getText(
  //   id: string,
  //   setVisitado: boolean = false
  // ): string | undefined {
  //   const elemento = this.db[id];

  //   if (elemento.tipo == "nó") return elemento.valor;
  //   if (elemento.tipo == "aresta") {
  //     const v1 = this.getText(elemento.v1, setVisitado);
  //     const label = this.getText(elemento.label, setVisitado);
  //     const v2 = this.getText(elemento.v2, setVisitado);
  //     return `[${v1}], [${label}] [${v2}]`;
  //   }
  // }

  imprimirNãoVisitados() {
    // console.log("# Não visitados");
    // for (let key in this.db) {
    //   if (!this.db[key]) {
    //     console.log(`- ${key}: ${this.getText(key)}`);
    //   }
    // }
  }
}
