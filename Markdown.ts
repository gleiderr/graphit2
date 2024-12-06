import {
  Aresta,
  Elemento,
  ElementoAresta,
  ElementoNó,
  Graphit,
  Id,
  Nó,
} from './Graphit';
import { readFileSync } from 'fs';

type PrintType = {
  nível?: number;
  origem?: Id;
};

export class Markdown {
  debug = false;
  constructor(private graphit: Graphit) {}

  imprimir(id: Id, { nível = 0, origem }: PrintType = {}) {
    if (nível > 2) return;

    const elemento = this.graphit.getValor(id);
    if (elemento.tipo === 'nó') {
      this.imprimirNó(elemento, nível, id);
    } else if (elemento.tipo === 'aresta') {
      this.imprimirAresta(elemento, { nível, origem });
    }
  }

  private imprimirNó(elemento: ElementoNó, nível: number, id: string) {
    // Impressão do título
    if (nível === 0) {
      this.debug
        ? this.print(`# ${elemento.valor}`, elemento)
        : this.print(`# ${elemento.valor}`);
    }

    for (const arestaId of elemento.arestas) {
      this.imprimir(arestaId, { nível: nível + 1, origem: id });
    }
  }

  private imprimirAresta(
    aresta: ElementoAresta,
    { nível, origem }: PrintType & { nível: number }
  ) {
    if (!origem) return this.print('Origem indefinida', aresta);

    //if (nível == 2) this.print('Aresta', elemento);

    const { id, v1, v2, label1, label2, arestas } = aresta;

    //Definição do label
    const labelId = v1 == origem ? label1 : label2;

    //Imprime se for necessária uma definição do label 2
    if (!labelId) return this.print('Label 2 indefinido', aresta);

    const label = this.graphit.getValor(labelId);

    //Definição do destino
    const destinoId = v1 == origem ? v2 : v1;
    const destino = this.graphit.getValor(destinoId);

    if (label.tipo === 'nó' && destino.tipo === 'nó') {
      this.imprimirLinha(nível, aresta, label, destino);
      for (const arestaId of arestas) {
        this.imprimir(arestaId, { nível: nível + 1, origem: id });
      }
    } else {
      return this.print('Label ou destino não é um nó', { label, destino });
    }
  }

  private imprimirLinha(
    nível: number,
    origem: Elemento,
    label: ElementoNó,
    destino: ElementoNó,
    ...outros: any
  ) {
    const diferenteOrigem = (arestaId: string) => arestaId !== origem.id;
    const arestasDestino = destino.arestas.filter(diferenteOrigem);

    const indentação = '  '.repeat(nível - 1);
    const linha = this.debug
      ? `${indentação}- (${origem.id}) ${label.valor}: ${destino.valor}`
      : `${indentação}- ${label.valor}: ${destino.valor}`;

    this.debug ? this.print(linha, arestasDestino) : this.print(linha);

    if (this.debug && origem.tipo === 'aresta') {
      this.print(indentação, '', origem.arestas);
    }
  }

  private print(...args: any[]) {
    console.log(...args);
  }
}
