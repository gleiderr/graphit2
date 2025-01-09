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

    const idReferências = new Set<string>();

    // Define impressão de referências no fim de cada linha
    const isNóReferência = (nó: Descrição) => 'valor' in nó && nó.valor === 'Referência';
    const contémNóReferência = (aresta: DescriçãoAresta) => aresta.nós.some(isNóReferência);
    markdown.sufixo = (_, aresta: DescriçãoAresta) => {
      const arestasReferência = aresta.arestas.filter(contémNóReferência);
      const nósReferência = arestasReferência.map(subAresta => subAresta.nós[2]);
      const referências = nósReferência.map((nó: Descrição) => ('valor' in nó ? nó.valor : 'Falha da referência')).join(', ');

      //Armazena referências identificadas
      nósReferência.forEach(nó => idReferências.add(nó.id));

      return referências ? ` (${referências})` : '';
    };

    markdown.filterOut = contémNóReferência;

    const Baasa = graphit2.buscarNó('Baasa');
    if (Baasa) {
      const texto = markdown.toMarkdown(graphit2.descrever(Baasa));
      appendFileSync('Bíblia2.md', `${texto}\n`);
    }
    appendFileSync('Bíblia2.md', '\n');

    // Montagem dos versículos
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
}

export const bíblia = new Bíblia();
