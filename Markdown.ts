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
// TODO: Reduzir as chamadas de getValor()

type PrintType = { nível?: number; origem?: Id };

export class Markdown {
  debug = false;
  visitados: Set<Id> = new Set();

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
      const aresta = this.graphit.getValor(arestaId) as ElementoAresta;
      this.imprimirAresta(aresta, { nível, origem });
    }
  }

  private imprimirAresta(
    aresta: ElementoAresta,
    { nível, origem: idOrigem }: PrintType & { nível: number }
  ) {
    if (!idOrigem) return this.print('Origem indefinida', aresta);

    const { id, v1, v2, label1, label2, arestas: arestasDaAresta } = aresta;

    //Definição do label
    const utilizaLabel1 = v1 == idOrigem;
    const labelId = utilizaLabel1 || !label2 ? label1 : label2;

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

    const inverter = !utilizaLabel1 && !label2;
    this.imprimirLinha(nível, aresta, origem, label, destino, inverter);
    for (const arestaId of arestasDaAresta) {
      this.imprimir(arestaId, { nível: nível + 1, origem: id });
    }
  }

  private imprimirLinha(
    nível: number,
    aresta: ElementoAresta,
    origem: Elemento,
    label: Elemento,
    destino: Elemento,
    inverter: boolean
  ) {
    this.setVisitado(aresta);

    const indentação = '  '.repeat(nível);

    if (label.tipo != 'nó') {
      this.print(`${indentação}- Label diferente de nó`, label);
      return;
    }

    // Nada para imprimir nesse caso
    if (destino.tipo != 'nó') return;

    if (!this.debug) {
      let linha: string;
      if (inverter && origem.tipo != 'nó') linha = 'Não sei o que fazer';
      else if (inverter && origem.tipo == 'nó')
        linha = `${destino.valor}: ${label.valor} ${origem.valor}`;
      else if (origem.tipo == 'nó' && nível > 0 && !inverter)
        linha = `${origem.valor}: ${label.valor} ${destino.valor}`;
      else linha = `${label.valor}: ${destino.valor}`;

      this.print(`${indentação}- ${linha}`);

      for (const arestaDestino of destino.arestas) {
        this.imprimir(arestaDestino, {
          nível: nível + 1,
          origem: destino.id,
        });
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

  setVisitado(elemento: Elemento) {
    if (elemento.tipo == 'aresta') {
      this.visitados.add(elemento.id);
      this.visitados.add(elemento.v1);
      this.visitados.add(elemento.v2);
      this.visitados.add(elemento.label1);
      if (elemento.label2) this.visitados.add(elemento.label2);
    } else {
      this.visitados.add(elemento.id);
    }
  }

  getNãoVisitados() {
    const índices = new Set(this.graphit.índices);
    const nãoVisitados = new Set(
      [...índices].filter(x => !this.visitados.has(x))
    );

    return nãoVisitados;
  }
}
