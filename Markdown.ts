import { Aresta, ElementoAresta, ElementoNó, Graphit, Id, Nó } from './Graphit';
import { readFileSync } from 'fs';

type PrintType = {
  nível?: number;
  origem?: Id;
};

export class Markdown {
  constructor(private graphit: Graphit) {}

  imprimir(id: Id, { nível = 0, origem }: PrintType = {}) {
    if (nível > 1) return;

    const elemento = this.graphit.getValor(id);
    if (elemento.tipo === 'nó') {
      this.imprimirNó(elemento, nível, id);
    } else if (elemento.tipo === 'aresta') {
      this.imprimirAresta(elemento, { nível, origem });
    }
  }

  private imprimirNó(elemento: ElementoNó, nível: number, id: string) {
    this.print('Nó', elemento);

    // Impressão do título
    if (nível === 0) this.print(`# ${elemento.valor}`);

    for (const arestaId of elemento.arestas) {
      this.imprimir(arestaId, { nível: nível + 1, origem: id });
    }
  }

  private imprimirAresta(
    elemento: ElementoAresta,
    { nível, origem }: PrintType & { nível: number }
  ) {
    if (!origem) return this.print('Origem indefinida', elemento);

    this.print('Aresta', elemento);

    const { v1, v2, label1, label2, arestas } = elemento;
    if (!label2) return this.print('Label 2 indefinido', elemento);

    //Definição do label
    const labelId = v1 == origem ? label1 : label2;
    const label = this.graphit.getValor(labelId);

    //Definição do destino
    const destinoId = v1 == origem ? v2 : v1;
    const destino = this.graphit.getValor(destinoId);

    if (label.tipo === 'nó' && destino.tipo === 'nó') {
      this.imprimirLinha(label.valor, destino.valor);

      const diferenteDesta = (arestaId: string) => arestaId !== elemento.id;
      const arestasDestino = destino.arestas.filter(diferenteDesta);
      if (arestasDestino.length) this.print({ arestasDestino });
    } else {
      return this.print('Label ou destino não é nó', { label, destino });
    }
  }

  private imprimirLinha(label: string, valor: string) {
    console.log(`- ${label}: ${valor}`);
  }

  private print(...args: any[]) {
    console.log(...args);
  }

  imprimirNãoVisitados() {
    // console.log("# Não visitados");
    // for (let key in this.db) {
    //   if (!this.db[key]) {
    //     console.log(`- ${key}: ${this.getText(key)}`);
    //   }
    // }
  }
}
