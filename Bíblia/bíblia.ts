import { appendFileSync, writeFileSync } from 'fs';
import { graphit } from '../Graphit';
import { Descrição, DescriçãoAresta, graphit2 } from '../Graphit2';
import { markdown } from '../Markdown2';

class Bíblia {
  inserirVersículo(referência: string, versículo: string, definirArestas: () => void) {
    graphit2.aresta([referência, versículo]);
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

    // Define impressão de referências no fim de cada linha
    markdown.appendLinha = (_, aresta: DescriçãoAresta) => {
      const isNóReferência = (nó: Descrição) => 'valor' in nó && nó.valor === 'Referência';
      const contémNóReferência = (aresta: DescriçãoAresta) => aresta.nós.some(isNóReferência);

      const referências = aresta.arestas
        .filter(contémNóReferência)
        .map(subAresta => subAresta.nós[2])
        .map((nó: Descrição) => ('valor' in nó ? nó.valor : 'Falha da referência'))
        .join(', ');

      return referências ? ` (${referências})` : '';
    };

    const Baasa = graphit2.buscarNó('Baasa');
    if (Baasa) {
      const texto = markdown.toMarkdown(graphit2.descrever(Baasa));
      appendFileSync('Bíblia2.md', `${texto}\n`);
    }
  }
}

export const bíblia = new Bíblia();
