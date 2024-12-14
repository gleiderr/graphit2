import { Elemento, ElementoAresta, ElementoNó, Graphit, Id } from './Graphit';

// TODO: Criar estratégia para imprimir referências

export class Markdown {
  constructor(private graphit: Graphit, private labelReferência: Id) {}

  imprimir(id: Id, { título = 0 }: { título?: number } = {}) {
    const elemento = this.graphit.getElemento(id);
    if (elemento.tipo === 'nó') {
      this.imprimirNó(elemento, título);
    } else if (elemento.tipo === 'aresta') {
      this.print('Elemento inválido: ', elemento);
    }
  }

  private imprimirNó(nó: ElementoNó, nívelTítulo: number) {
    // Impressão do título
    const hashs = '#'.repeat(nívelTítulo + 1);
    this.setVisitado(nó);
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
      e.label1 == this.labelReferência || e.label2 == this.labelReferência;
    const arestasReferência = aresta.arestas
      .map(e => this.graphit.getElemento(e) as ElementoAresta)
      .filter(isReferência);
    const nósReferência = arestasReferência
      .map(e => (e.label1 == this.labelReferência ? e.v2 : e.v1))
      .map(id => this.graphit.getElemento(id) as ElementoNó);

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
