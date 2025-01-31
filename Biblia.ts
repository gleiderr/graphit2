import { appendFileSync, writeFileSync } from 'fs';
import { Descrição, DescriçãoAresta, graphit, Id } from './Graphit';
import { markdown } from './Markdown';

type EstudosDestino = {
  foco: string[];
  outros: string[];
  pronto: string[];
};

class Bíblia {
  visitados: Set<string> = new Set();

  inserirVersículo(
    referência: string,
    versículo: string,
    definirArestas: () => void,
  ) {
    //Define aresta de referência
    graphit.aresta([referência, ':', versículo]);

    const setReferência = graphit.addListener('afterAresta', id => {
      graphit.aresta([{ id }, 'Referência', referência]);
    });

    definirArestas();

    graphit.removeListener('afterAresta', setReferência);
  }

  imprimirEstudos(estudos: EstudosDestino) {
    for (const key in estudos) {
      const destino = key as keyof EstudosDestino;
      const estudo = estudos[destino];
      estudo.forEach(arquivo => {
        const nó = graphit.buscarNó(arquivo);
        if (nó) this.imprimeEstudo(nó, arquivo + '.md', destino);
      });
    }
  }

  imprimeEstudo(
    nó: Id,
    arquivo: string,
    destino: 'foco' | 'outros' | 'pronto',
    { debug = false } = {},
  ) {
    const paths = {
      foco: './estudos/foco/',
      outros: './estudos/outros/',
      pronto: './estudos/',
    };
    const path = paths[destino] + arquivo;
    writeFileSync(path, ''); // Inicia arquivo em branco

    const idReferências = this.setupReferências(debug);

    const descrição = graphit.descrever(nó);

    this.visitados = this.visitados.union(graphit.visitados);

    const texto = markdown.toMarkdown(descrição, { debug });
    appendFileSync(path, `${texto}\n\n`);

    if (idReferências) this.imprimeReferências(idReferências, path);
  }

  imprimeNãoVisitados() {
    const arquivo = 'Não visitados.md';
    const path = './estudos/' + arquivo;
    writeFileSync(path, ''); // Inicia arquivo em branco

    const todosÍndices = new Set(graphit.índices);
    while (this.visitados.size < todosÍndices.size) {
      const nãoVisitados = todosÍndices.difference(this.visitados);
      console.log({
        todosÍndices: todosÍndices.size,
        visitados: this.visitados.size,
        nãoVisitados: nãoVisitados.size,
      });

      const elementoId = nãoVisitados.values().next().value;
      if (!elementoId) break;

      const descrição = graphit.descrever(elementoId);
      this.visitados = this.visitados.union(graphit.visitados);

      const isNóReferência = (nó: Descrição) =>
        'valor' in nó && nó.valor === 'Referência';
      const contémNóReferência = (aresta: DescriçãoAresta) =>
        aresta.nós.some(isNóReferência);
      if (!('valor' in descrição) && contémNóReferência(descrição)) {
        console.log('Ignora  referência');
        continue;
      }

      const texto = markdown.toMarkdown(descrição);
      appendFileSync(path, `${texto}\n\n`);
    }
  }

  private imprimeReferências(idReferências: Set<string>, arquivo: string) {
    appendFileSync(arquivo, '> ## Referências\n');

    markdown.prefixo = () => '> ';

    const doisPontos = graphit.buscarNó(':');
    if (doisPontos) {
      const versículos = [...idReferências]
        .map(referência => {
          const arestas = graphit.filtrarArestas({
            contém: [referência, doisPontos],
          });

          return arestas.map(aresta => {
            const descrição = graphit.descrever(aresta);
            this.visitados = this.visitados.union(graphit.visitados);

            return markdown.toMarkdown(descrição);
          });
        })
        .flat();

      appendFileSync(arquivo, `${versículos.join('\n>\n')}`);
    }

    delete markdown.prefixo;
  }

  private setupReferências(debug: boolean) {
    delete markdown.sufixo;
    delete markdown.prefixo;
    delete markdown.onGetLinha;
    markdown.filterOut = () => false;
    if (debug) return;

    const isNóReferência = (nó: Descrição) =>
      'valor' in nó && nó.valor === 'Referência';
    const contémNóReferência = (aresta: DescriçãoAresta) =>
      aresta.nós.some(isNóReferência);

    // Define impressão de referências no fim de cada linha
    markdown.sufixo = (_, elemento: Descrição) => {
      const nósReferência = elemento.arestas
        .filter(contémNóReferência)
        .map(subAresta => subAresta.nós[2]);
      const referências = nósReferência
        .map((nó: Descrição) =>
          'valor' in nó ? nó.valor : 'Falha da referência',
        )
        .join(', ');
      return referências ? ` (${referências})` : '';
    };

    // Armazena referências identificadas
    const idReferências = new Set<string>();
    markdown.onGetLinha = (_, elemento: Descrição) => {
      if ('valor' in elemento) return;
      const nósReferência = elemento.arestas
        .filter(contémNóReferência)
        .map(subAresta => subAresta.nós[2]);
      nósReferência.forEach(nó => idReferências.add(nó.id));
    };

    // Não imprime arestas contendo apenas a referência
    markdown.filterOut = contémNóReferência;
    return idReferências;
  }

  excluir(id: Id) {
    try {
      graphit.excluirAresta(id);
    } catch (error) {
      bíblia.imprimeEstudo(id, 'Erro exclusão.md', 'outros', { debug: true });

      if (error instanceof Error)
        throw new Error(`Erro ao tentar excluir:\n  ${error.message}\n`);
      else throw error;
    }
  }
}

export const bíblia = new Bíblia(); //
export const inserirVersículo = bíblia.inserirVersículo.bind(bíblia);
