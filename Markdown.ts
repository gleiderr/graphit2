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

// TODO: Criar estratégia para imprimir referências
// TODO: Impressão de nós não visitados
// TODO: Reduzir as chamadas de getValor()

type PrintType = { nível?: number; origem?: Id };

export class Markdown {
  constructor(private graphit: Graphit) {}

  imprimir(id: Id, { nível = 0, origem }: PrintType = {}) {
    const elemento = this.graphit.getElemento(id);
    if (elemento.tipo === 'nó') {
      this.imprimirNó(elemento, nível, id);
    } else if (elemento.tipo === 'aresta') {
      this.imprimirAresta(elemento, { nível, origem });
    }
  }

  private imprimirNó(elemento: ElementoNó, nível: number, origem: string) {
    // Impressão do título
    if (nível === 0) {
      this.setVisitado(elemento);
      this.print(`# ${elemento.valor}`);
    } else {
      this.print('Nó', elemento);
    }

    for (const arestaId of elemento.arestas) {
      const aresta = this.graphit.getElemento(arestaId) as ElementoAresta;
      this.imprimirAresta(aresta, { nível, origem });
    }
  }

  private imprimirAresta(
    aresta: ElementoAresta,
    { nível, origem: idOrigem }: PrintType & { nível: number }
  ) {
    if (this.visitados.has(aresta.id)) return;
    if (nível > 5) {
      const indentação = this.indentação(nível);
      return this.print(`${indentação}--- Chegou ao nível ${nível} ---`);
    }

    if (!idOrigem) return this.print('Origem indefinida', aresta);

    const { id, v1, v2, label1, label2 } = aresta;

    //Definição do label
    const utilizaLabel1 = v1 == idOrigem;
    const labelId = utilizaLabel1 || !label2 ? label1 : label2;

    const label = this.graphit.getElemento(labelId);

    //Definição da origem e do destino
    let destino, origem;
    if (v1 == idOrigem) {
      origem = this.graphit.getElemento(v1);
      destino = this.graphit.getElemento(v2);
    } else {
      origem = this.graphit.getElemento(v2);
      destino = this.graphit.getElemento(v1);
    }

    if (label.tipo != 'nó') {
      const indentação = this.indentação(nível);
      this.print(`${indentação}- Label diferente de nó`, label);
      return;
    }

    // Nada para imprimir nesse caso
    if (destino.tipo != 'nó') return;

    const inverter = !utilizaLabel1 && !label2;
    this.imprimirLinha(nível, aresta, origem, label, destino, inverter);
    this.setVisitado(aresta);

    // Imprime arestas do nó de destino
    for (const arestaId of destino.arestas) {
      const novaAresta = this.graphit.getElemento(arestaId) as ElementoAresta;
      this.imprimirAresta(novaAresta, { nível: nível + 1, origem: destino.id });
    }

    // Imprime arestas da aresta
    for (const arestaId of aresta.arestas) {
      const novaAresta = this.graphit.getElemento(arestaId) as ElementoAresta;
      this.imprimirAresta(novaAresta, { nível: nível + 1, origem: aresta.id });
    }
  }

  private imprimirLinha(
    nível: number,
    aresta: ElementoAresta,
    origem: Elemento,
    label: ElementoNó,
    destino: ElementoNó,
    inverter: boolean
  ) {
    const indentação = this.indentação(nível);

    let linha: string;
    if (inverter && origem.tipo != 'nó') linha = 'Não sei o que fazer';
    else if (inverter && origem.tipo == 'nó')
      linha = `${destino.valor}: ${label.valor} ${origem.valor}`;
    else if (origem.tipo == 'nó' && nível > 0 && !inverter)
      linha = `(${origem.valor}) ${label.valor}: ${destino.valor}`;
    else linha = `${label.valor}: ${destino.valor}`;

    this.print(`${indentação}- ${linha}`);
  }

  private indentação(nível: number) {
    return '  '.repeat(nível);
  }

  private print(...args: any[]) {
    console.log(...args);
  }

  private visitados: Set<Id> = new Set();

  iniciarVisitação() {
    this.visitados = new Set();
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
