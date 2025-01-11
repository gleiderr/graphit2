import { appendFileSync, writeFileSync } from 'fs';
import { graphit } from '../Graphit';
import { Descrição, DescriçãoAresta, graphit2 } from '../Graphit2';
import { markdown } from '../Markdown2';

class Bíblia {
  visitados: Set<string> = new Set();

  inserirVersículo(referência: string, versículo: string, definirArestas: () => void) {
    graphit2.aresta([referência, ':', versículo]);
    const setReferência = graphit2.addListener('afterAresta', id => {
      graphit2.aresta([{ id }, 'Referência', referência]);
    });

    graphit.inserirAresta([referência, versículo, 'Texto']);
    graphit.iniciarMemória();
    definirArestas();
    graphit.getMemória().forEach(([aresta]) => {
      graphit.inserirAresta([aresta, referência, 'Referência']);
    });

    graphit2.removeListener('afterAresta', setReferência);
  }

  finalizar() {
    graphit2.salvar('Bíblia2.json');
    writeFileSync('Bíblia2.md', ''); // Inicia arquivo em branco

    const idReferências = this.setupReferências();

    this.visitados = new Set();
    const Baasa = graphit2.buscarNó('Baasa');
    if (Baasa) {
      const descriçãoBaasa = graphit2.descrever(Baasa);
      this.visitados = this.visitados.union(graphit2.visitados);

      const texto = markdown.toMarkdown(descriçãoBaasa);
      appendFileSync('Bíblia2.md', `${texto}\n`);
    }
    appendFileSync('Bíblia2.md', '\n');

    // Montagem dos versículos
    this.imprimeVersículos(idReferências);

    this.imprimeNãoVisitados();
  }

  private imprimeNãoVisitados() {
    const arquivo = 'Não visitados.md';
    writeFileSync(arquivo, ''); // Inicia arquivo em branco

    delete markdown.prefixo;

    const todosÍndices = new Set(graphit2.índices);
    while (this.visitados.size < todosÍndices.size) {
      const nãoVisitados = todosÍndices.difference(this.visitados);
      console.log({
        todosÍndices: todosÍndices.size,
        visitados: this.visitados.size,
        nãoVisitados: nãoVisitados.size,
      });

      const elementoId = nãoVisitados.values().next().value;
      if (!elementoId) break;

      const descrição = graphit2.descrever(elementoId);
      this.visitados = this.visitados.union(graphit2.visitados);

      const texto = markdown.toMarkdown(descrição);
      appendFileSync(arquivo, `${texto}\n`);
    }
  }

  private imprimeVersículos(idReferências: Set<string>) {
    appendFileSync('Bíblia2.md', '> ## Versículos\n');

    markdown.prefixo = () => '> ';

    const doisPontos = graphit2.buscarNó(':');
    if (doisPontos) {
      const versículos = [...idReferências]
        .map(referência => {
          const arestas = graphit2.filtrarArestas({ contém: [referência, doisPontos] });

          return arestas.map(aresta => {
            const descrição = graphit2.descrever(aresta);
            this.visitados = this.visitados.union(graphit2.visitados);

            return markdown.toMarkdown(descrição);
          });
        })
        .flat();

      appendFileSync('Bíblia2.md', `${versículos.join('>\n')}`);
    }
  }

  private setupReferências() {
    const isNóReferência = (nó: Descrição) => 'valor' in nó && nó.valor === 'Referência';
    const contémNóReferência = (aresta: DescriçãoAresta) => aresta.nós.some(isNóReferência);

    // Define impressão de referências no fim de cada linha
    markdown.sufixo = (_, aresta: DescriçãoAresta) => {
      const nósReferência = aresta.arestas.filter(contémNóReferência).map(subAresta => subAresta.nós[2]);
      const referências = nósReferência.map((nó: Descrição) => ('valor' in nó ? nó.valor : 'Falha da referência')).join(', ');
      return referências ? ` (${referências})` : '';
    };

    // Armazena referências identificadas
    const idReferências = new Set<string>();
    markdown.onGetLinha = (_, elemento: Descrição) => {
      if ('valor' in elemento) return;
      const nósReferência = elemento.arestas.filter(contémNóReferência).map(subAresta => subAresta.nós[2]);
      nósReferência.forEach(nó => idReferências.add(nó.id));
    };

    // Não imprime arestas contendo apenas a referência
    markdown.filterOut = contémNóReferência;
    return idReferências;
  }
}

export const bíblia = new Bíblia();
