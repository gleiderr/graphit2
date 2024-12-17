import { appendFileSync, writeFileSync } from 'fs';
import { Elemento, ElementoAresta, ElementoNó, Graphit, Id } from './Graphit';

export class Markdown {
  onConsole = false;

  constructor(
    private graphit: Graphit,
    private labelRef: Id,
    private labelTexto: Id
  ) {}

  imprimir(id: Id, { título = 0, output = 'Bíblia.md' } = {}) {
    const elemento = this.graphit.getElemento(id);
    if (elemento.tipo !== 'nó') return this.print('Inválido: ', elemento);

    writeFileSync(output, ''); // Inicia arquivo em branco
    this.imprimirNó(elemento, título);

    this.imprimirVersículos();
  }

  private imprimirNó(nó: ElementoNó, nívelTítulo: number) {
    this.setVisitado(nó);

    // Impressão do título
    const hashs = '#'.repeat(nívelTítulo + 1);
    this.print(`${hashs} ${nó.valor}`);

    for (const arestaId of nó.arestas) {
      const aresta = this.graphit.getElemento(arestaId) as ElementoAresta;
      this.imprimirAresta(aresta, { nível: 0, origem: nó });
    }
  }

  private imprimirAresta(
    aresta: ElementoAresta,
    { nível, origem }: { nível: number; origem: Elemento }
  ) {
    if (this.visitados.has(aresta.id)) return;
    if (nível > 5) {
      const indentação = this.indentação(nível);
      return this.print(`${indentação}--- Chegou ao nível ${nível} ---`);
    }

    const { label, inverter } = this.getLabel(origem, aresta);
    if (label.tipo != 'nó') {
      return this.print(`${this.indentação(nível)}- Diferente de nó`, label);
    }

    // Definição do destino
    const destinoId = aresta.v1 == origem.id ? aresta.v2 : aresta.v1;
    const destino = this.graphit.getElemento(destinoId);
    if (destino.tipo != 'nó') return; // Nada para imprimir nesse caso

    const { arestasReferência, nósReferência } = this.getReferências(aresta);

    this.imprimirLinha(nível, origem, label, destino, inverter, nósReferência);
    this.setVisitado(aresta);
    arestasReferência.forEach(a => this.setVisitado(a));

    // Imprime arestas do nó de destino
    for (const arestaId of destino.arestas) {
      const novaAresta = this.graphit.getElemento(arestaId) as ElementoAresta;
      this.imprimirAresta(novaAresta, { nível: nível + 1, origem: destino });
    }

    // Imprime arestas da aresta
    for (const arestaId of aresta.arestas) {
      const novaAresta = this.graphit.getElemento(arestaId) as ElementoAresta;
      this.imprimirAresta(novaAresta, { nível: nível + 1, origem: aresta });
    }
  }

  private getLabel(origem: Elemento, { v1, label1, label2 }: ElementoAresta) {
    const utilizaLabel1 = v1 == origem.id;
    const labelId = utilizaLabel1 || !label2 ? label1 : label2;
    const inverter = !utilizaLabel1 && !label2;
    const label = this.graphit.getElemento(labelId);

    return { label, inverter };
  }

  private getReferências(aresta: ElementoAresta) {
    const isReferência = (e: ElementoAresta) =>
      e.label1 == this.labelRef || e.label2 == this.labelRef;
    const arestasReferência = aresta.arestas
      .map(e => this.graphit.getElemento(e) as ElementoAresta)
      .filter(isReferência);
    const ids = arestasReferência.map(e =>
      e.label1 == this.labelRef ? e.v2 : e.v1
    );
    const nósReferência = ids.map(
      id => this.graphit.getElemento(id) as ElementoNó
    );

    ids.forEach(id => this.nósReferência.add(id));

    return { arestasReferência, nósReferência };
  }

  private imprimirLinha(
    nível: number,
    origem: Elemento,
    label: ElementoNó,
    destino: ElementoNó,
    inverter: boolean,
    referências: ElementoNó[]
  ) {
    const indentação = this.indentação(nível);

    let linha: string;
    if (inverter && origem.tipo != 'nó') linha = 'Não sei o que fazer';
    else if (inverter && origem.tipo == 'nó')
      linha = `${destino.valor}: ${label.valor} ${origem.valor}`;
    else if (origem.tipo == 'nó' && nível > 0 && !inverter)
      linha = `(${origem.valor}) ${label.valor}: ${destino.valor}`;
    else linha = `${label.valor}: ${destino.valor}`;

    const refs = referências.map(n => n.valor).join(', ');
    if (refs) linha += ` (${refs})`;

    this.print(`${indentação}- ${linha}`);
  }

  private nósReferência: Set<Id> = new Set();
  private imprimirVersículos() {
    const isVersículo = (e: ElementoAresta) =>
      e.label1 == this.labelTexto || e.label2 == this.labelTexto;

    const arestas = [...this.nósReferência]
      .map(id => this.graphit.getElemento(id) as ElementoNó)
      .map(nó => nó.arestas)
      .flat()
      .map(id => this.graphit.getElemento(id) as ElementoAresta)
      .filter(isVersículo);

    this.print('');
    for (const aresta of arestas) {
      let ref = this.graphit.getElemento(aresta.v1) as ElementoNó;
      let versículo = this.graphit.getElemento(aresta.v2) as ElementoNó;
      if (aresta.label2 == this.labelTexto) {
        [ref, versículo] = [versículo, ref];
      }

      this.print(`> ${ref.valor}: ${versículo.valor}`);

      this.setVisitado(aresta);
    }
  }

  private indentação(nível: number) {
    return '  '.repeat(nível);
  }

  private print(texto: string, ...args: any[]) {
    if (this.onConsole) this.printToConsole(texto, ...args);
    this.printToFile(texto);
  }

  private printToConsole(texto: string, ...args: any[]) {
    console.log(texto, ...args);
  }

  private printToFile(texto: string) {
    appendFileSync('Bíblia.md', texto + '\n');
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
