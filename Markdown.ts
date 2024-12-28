import { appendFileSync, writeFileSync } from 'fs';
import { Elemento, ElementoAresta, ElementoNó, Graphit, Id } from './Graphit';

type DescriçãoComLabel = {
  origem: Elemento;
  label: ElementoNó;
  destino: Elemento;
  inverter: boolean;
  referências: ElementoNó[];
};

type DescriçãoSemLabel = {
  origem: Elemento;
  destino: Elemento;
  referências: ElementoNó[];
};

// Descrição de cada linha a ser impressa
type Descrição = DescriçãoComLabel | DescriçãoSemLabel;

type Linha = {
  aresta: ElementoAresta;
  descrição: Descrição;
  linhas?: Linha[];
};

export class Markdown {
  onConsole = false;

  constructor(
    private graphit: Graphit,
    private labelRef: Id,
    private labelTexto: Id,
  ) {}

  imprimir(id: Id, { nívelTítulo = 0, output = 'Bíblia.md' } = {}) {
    const elemento = this.graphit.getElemento(id);
    if (elemento.tipo !== 'nó') return this.print('Inválido: ', elemento);

    writeFileSync(output, ''); // Inicia arquivo em branco

    this.imprimirTítulo(elemento, nívelTítulo);

    this.imprimirVersículos();
  }

  private imprimirTítulo(nó: ElementoNó, nívelTítulo: number) {
    // Impressão do título
    const hashs = '#'.repeat(nívelTítulo + 1);
    this.print(`${hashs} ${nó.valor}`);

    const linhas = this.montarEstrutura(nó, { limite: 3 });
    this.imprimirLinhas(0, linhas);
  }

  private imprimirLinhas(nível: number, linhas: Linha[]) {
    for (const linha of linhas) {
      const { descrição } = linha;
      if ('label' in descrição) this.imprimirLinha(nível, descrição);

      const proxNível = 'label' in descrição ? nível + 1 : nível;
      if (linha.linhas) this.imprimirLinhas(proxNível, linha.linhas);
    }
  }

  private montarEstrutura(
    origem: Elemento,
    { limite = 0 }: { limite?: number } = {},
  ) {
    const primeiroNível: Linha[] = this.getLinhas(origem);
    let nívelCorrente = primeiroNível;

    for (let n = 0; n < limite && nívelCorrente.length > 0; n++) {
      let próximoNível: Linha[] = [];
      for (const linha of nívelCorrente) {
        const linhasDestino = this.getLinhas(linha.descrição.destino);
        const linhasAresta = this.getLinhas(linha.aresta);
        linha.linhas = [...linhasDestino, ...linhasAresta];
        próximoNível = [...próximoNível, ...linha.linhas];
      }
      nívelCorrente = próximoNível;
    }

    return primeiroNível;
  }

  private getLinhas(origem: Elemento) {
    let linhas: Linha[] = [];
    for (const arestaId of origem.arestas) {
      const aresta = this.graphit.getElemento(arestaId) as ElementoAresta;

      // Verifica visita
      if (this.visitados.has(aresta.id)) continue;

      const descrição = this.getDescrição(aresta, { origem });
      if (!descrição) continue;

      this.setVisitado(aresta);

      const linha = { aresta, descrição, linhas: [] };
      linhas = [...linhas, linha];
    }
    return linhas;
  }

  private getDescrição(
    aresta: ElementoAresta,
    { origem }: { origem: Elemento },
  ): Descrição | null {
    // TODO: Remover getLabel() daqui
    const { label, inverter } = this.getLabel(origem, aresta);

    // Definição do destino
    const destinoId = aresta.v1 == origem.id ? aresta.v2 : aresta.v1;
    const destino = this.graphit.getElemento(destinoId);

    // TODO: passar essa validação para fora deste método
    // O destino de uma aresta não pode ser outra aresta
    if (destino.tipo == 'aresta') return null;

    // TODO: passar identificação de referências para fora deste método
    const { nósReferência: referências, arestasReferência } =
      this.getReferências(aresta);
    arestasReferência.forEach(a => this.setVisitado(a));

    return label ?
        { origem, label, destino, inverter, referências }
      : { origem, destino, referências };
  }

  private getLabel(origem: Elemento, { v1, l1, l2 }: ElementoAresta) {
    if (!l1) return {};

    const utilizaLabel1 = v1 == origem.id;
    const labelId = utilizaLabel1 || !l2 ? l1 : l2;
    const inverter = !utilizaLabel1 && !l2;
    const label = this.graphit.getElemento(labelId);

    if (label.tipo != 'nó') throw new Error(`Label inválido ${label}`);

    return { label, inverter };
  }

  private getReferências(aresta: ElementoAresta) {
    const isReferência = (e: ElementoAresta) =>
      e.l1 == this.labelRef || e.l2 == this.labelRef;
    const arestasReferência = aresta.arestas
      .map(e => this.graphit.getElemento(e) as ElementoAresta)
      .filter(isReferência);
    const ids = arestasReferência.map(e =>
      e.l1 == this.labelRef ? e.v2 : e.v1,
    );
    const nósReferência = ids.map(
      id => this.graphit.getElemento(id) as ElementoNó,
    );

    ids.forEach(id => this.nósReferência.add(id));

    return { arestasReferência, nósReferência };
  }

  private imprimirLinha(nível: number, descrição: DescriçãoComLabel) {
    const { origem, label, destino, inverter, referências } = descrição;

    let linha: string;
    const ambosNós = origem.tipo == 'nó' && destino.tipo == 'nó';
    if (ambosNós && inverter) {
      linha = `- ${destino.valor}: ${label.valor} ${origem.valor}`;
    } else if (ambosNós && nível > 0 && !inverter) {
      linha = `- (${origem.valor}) ${label.valor}: ${destino.valor}`;
    } else if (origem.tipo == 'aresta' && destino.tipo == 'nó') {
      linha = `- ${label.valor}: ${destino.valor}`;
    } else if (nível == 0 && destino.tipo == 'nó') {
      linha = `- ${label.valor}: ${destino.valor}`;
    } else {
      linha = '- Não sei o que fazer';
      console.log(linha, descrição);
    }

    const refs = referências.map(n => n.valor).join(', ');
    if (refs) linha += ` (${refs})`;

    const indentação = this.indentação(nível);
    this.print(`${indentação}${linha}`);
  }

  private nósReferência: Set<Id> = new Set();
  private imprimirVersículos() {
    const isVersículo = (e: ElementoAresta) =>
      e.l1 == this.labelTexto || e.l2 == this.labelTexto;

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
      if (aresta.l2 == this.labelTexto) {
        [ref, versículo] = [versículo, ref];
      }

      this.print(`> ${ref.valor}: ${versículo.valor}`);

      this.setVisitado(aresta);
    }
  }

  private indentação(nível: number) {
    return '  '.repeat(nível);
  }

  private print(texto: string, ...args: unknown[]) {
    if (this.onConsole) this.printToConsole(texto, ...args);
    this.printToFile(texto);
  }

  private printToConsole(texto: string, ...args: unknown[]) {
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
      if (elemento.l1) this.visitados.add(elemento.l1);
      if (elemento.l2) this.visitados.add(elemento.l2);
    } else {
      this.visitados.add(elemento.id);
    }
  }

  getNãoVisitados() {
    const índices = new Set(this.graphit.índices);
    const nãoVisitados = new Set(
      [...índices].filter(x => !this.visitados.has(x)),
    );

    return nãoVisitados;
  }
}
