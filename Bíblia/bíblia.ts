import { appendFileSync, writeFileSync } from 'fs';
import { graphit } from '../Graphit';
import { Descrição, DescriçãoAresta, graphit2 } from '../Graphit2';
import { markdown } from '../Markdown2';

class Bíblia {
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

    const Baasa = graphit2.buscarNó('Baasa');
    if (Baasa) {
      const texto = markdown.toMarkdown(graphit2.descrever(Baasa));
      appendFileSync('Bíblia2.md', `${texto}\n`);
    }
    appendFileSync('Bíblia2.md', '\n');

    // Montagem dos versículos
    this.imprimeVersículos(idReferências);
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
            const print = markdown.toMarkdown(descrição);

            return print;
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
