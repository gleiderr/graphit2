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

// TODO: Limitar caminho pelo grafo em função das arestas visitadas
// TODO: Criar estratégia para imprimir referências
// TODO: Caminhar no grafo também a partir dos nós
// TODO: Impressão de nós não visitados

type PrintType = { nível?: number; origem?: Id };

export class Markdown {
  debug = false;
  visitados: Set<Id> = new Set();

  constructor(private graphit: Graphit) {}

  imprimir(id: Id, { nível = 0, origem }: PrintType = {}) {
    if (nível > 10) return;

    const elemento = this.graphit.getValor(id);
    if (elemento.tipo === 'nó') {
      this.imprimirNó(elemento, nível, id);
    } else if (elemento.tipo === 'aresta') {
      this.imprimirAresta(elemento, { nível, origem });
    }
  }

  private imprimirNó(elemento: ElementoNó, nível: number, origem: string) {
    // Impressão do título
    if (nível === 0) {
      this.visitados.add(elemento.id);

      this.debug
        ? this.print(`# ${elemento.valor}`, elemento)
        : this.print(`# ${elemento.valor}`);
    } else {
      this.print('Nó', elemento);
    }

    for (const arestaId of elemento.arestas) {
      this.imprimir(arestaId, { nível: nível + 1, origem });
    }
  }

  private imprimirAresta(
    aresta: ElementoAresta,
    { nível, origem: idOrigem }: PrintType & { nível: number }
  ) {
    if (!idOrigem) return this.print('Origem indefinida', aresta);

    const { id, v1, v2, label1, label2, arestas } = aresta;

    //Definição do label
    const utilizaLabel1 = v1 == idOrigem;
    const labelId = utilizaLabel1 || !label2 ? label1 : label2;
    const inverter = !utilizaLabel1 && !label2;

    const label = this.graphit.getValor(labelId);

    //Definição da origem e do destino
    let destino, origem;
    if (v1 == idOrigem) {
      origem = this.graphit.getValor(v1);
      destino = this.graphit.getValor(v2);
    } else {
      origem = this.graphit.getValor(v2);
      destino = this.graphit.getValor(v1);
    }

    if (label.tipo === 'nó' && destino.tipo === 'nó') {
      this.imprimirLinha(nível, aresta, origem, label, destino, inverter);
      for (const arestaId of arestas) {
        this.imprimir(arestaId, { nível: nível + 1, origem: id });
      }
    } else {
      return this.print('Label ou destino não é um nó', {
        label,
        destino: destino,
      });
    }
  }

  private imprimirLinha(
    nível: number,
    aresta: ElementoAresta,
    origem: Elemento,
    label: ElementoNó,
    destino: ElementoNó,
    invertido: boolean
  ) {
    const indentação = '  '.repeat(nível - 1);

    this.visitados.add(aresta.id);
    this.visitados.add(aresta.v1);
    this.visitados.add(aresta.v2);
    this.visitados.add(aresta.label1);
    if (aresta.label2) this.visitados.add(aresta.label2);

    if (!this.debug) {
      if (invertido) {
        if (origem.tipo != 'nó') {
          this.print(`${indentação}- Não sei o que fazer com isso`);
          return;
        } else {
          const linha = `${indentação}- ${destino.valor} ${label.valor} ${origem.valor}`;
          this.print(linha);
        }
      } else {
        const linha = `${indentação}- ${label.valor}: ${destino.valor}`;
        this.print(linha);
      }
    } else {
      const diferenteOrigem = (arestaId: string) => arestaId !== aresta.id;
      const arestasDestino = destino.arestas.filter(diferenteOrigem);

      const linha = `${indentação}- (${aresta.id}) ${label.valor}: ${destino.valor}`;
      this.print(linha, arestasDestino);
      this.print(indentação, '', aresta.arestas);
    }
  }

  private print(...args: any[]) {
    console.log(...args);
  }

  getNãoVisitados() {
    const índices = new Set(this.graphit.índices);
    const nãoVisitados = new Set(
      [...índices].filter(x => !this.visitados.has(x))
    );

    return nãoVisitados;
  }
}
