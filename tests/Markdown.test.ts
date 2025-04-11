import { Expressão, Graphit, Termo } from '../Graphit';
import { Markdown } from '../Markdown';

describe('Markdown', () => {
  let markdown: Markdown;
  let graphit: Graphit;

  beforeEach(() => {
    // Inicializa Markdown antes de cada teste para garantir testes independentes
    graphit = new Graphit();
    markdown = new Markdown(graphit);
  });

  describe('Análise única linha', () => {
    [
      { tipo: 'parágrafo', valor: 'Baasa' },
      { tipo: 'título', valor: '# Baasa' },
      { tipo: 'lista', valor: '- Baasa' },
      { tipo: 'citação', valor: '> Baasa' },
      { tipo: 'lista numérica', valor: '1. Baasa' },
    ].forEach(({ tipo, valor }) => {
      test(`Deve analisar ${tipo} como um termo`, () => {
        const informações = markdown.analisar(valor);

        expect(informações).toHaveLength(1);

        const termo = informações[0] as Termo;
        expect(termo.valor).toBe(valor.replace(/^(#|>|-|\d+\.)?\s*/, ''));
        expect(termo.contém).toHaveLength(0);
        expect(termo.contidaEm).toHaveLength(0);
        expect(termo.pertence_a).toHaveLength(0);
      });
    });

    [
      { tipo: 'parágrafo', valor: 'Baasa, filho de Aías' },
      { tipo: 'título', valor: '# Baasa, filho de Aías' },
      { tipo: 'lista', valor: '- Baasa, filho de Aías' },
      { tipo: 'citação', valor: '> Baasa, filho de Aías' },
      { tipo: 'lista numérica', valor: '1. Baasa, filho de Aías' },
    ].forEach(({ tipo, valor }) => {
      test(`Deve analisar ${tipo} como uma expressão`, () => {
        const informações = markdown.analisar(valor);

        expect(informações).toHaveLength(1);

        const expressão = informações[0] as Expressão;
        const termos = expressão.termos.map(
          t => (graphit.get(t) as Termo).valor
        );
        expect(termos).toEqual(['Baasa', ',', 'filho', 'de', 'Aías']);
      });
    });

    // TODO:
    // test.skip('Deve analisar texto com formatação', () => {
    //   const stats = markdown.analisar('**Baasa** é um personagem importante.');

    //   expect(stats.termos).toHaveLength(5);
    //   expect(stats.termosOcultos).toHaveLength(0);
    // });
  });

  describe('Análise múltiplas linhas', () => {
    test('Deve analisar várias linhas', () => {
      const informações = markdown.analisar('# Baasa\n\nBaasa, filho de Aías');

      expect(informações).toHaveLength(1);

      const título = informações[0] as Termo;
      expect(título.valor).toBe('Baasa');
      expect(título.contém).toHaveLength(1);
      expect(título.contidaEm).toHaveLength(0);
      expect(título.pertence_a).toHaveLength(1);

      const parágrafo = graphit.get(título.contém[0]) as Expressão;
      const termos = parágrafo.termos.map(t => (graphit.get(t) as Termo).valor);
      expect(termos).toEqual(['Baasa', ',', 'filho', 'de', 'Aías']);
      expect(parágrafo.contidaEm).toHaveLength(1);
    });

    //   test('Deve reconhecer termos ocultos', () => {
    //     const stats = markdown.analisar('# Baasa\n\nFilho de Aías');

    //     expect(stats.termos).toHaveLength(4);
    //     expect(stats.termosOcultos).toHaveLength(1);
    //     expect(stats.expressões).toHaveLength(1);
    //     expect(stats.expressõesOcultas).toHaveLength(0);
    //   });

    //   test('Deve reconhecer expressões ocultas', () => {
    //     const stats = markdown.analisar('# Ben-Hadade\n\nFilho de Tabriom');

    //     expect(stats.termos).toHaveLength(6);
    //     expect(stats.termosOcultos).toHaveLength(0);
    //     expect(stats.expressões).toHaveLength(2);
    //     expect(stats.expressõesOcultas).toHaveLength(1);
    //   });
  });

  // describe('Reprodução de markdown', () => {
  //   test('Deve reproduzir markdown a partir de um termo', () => {
  //     const texto = '# Baasa\n\n';
  //     markdown.analisar(texto);

  //     expect(markdown.toMarkdown('Baasa')).toBe(texto);
  //   });

  //   test('Deve reproduzir markdown a partir de uma expressão', () => {
  //     const texto = '# Ben-Hadade\n\n';
  //     markdown.analisar(texto);

  //     expect(markdown.toMarkdown('Ben-Hadade')).toBe(texto);
  //   });

  //   test.skip('Deve reproduzir markdown a partir de termo com conteúdo', () => {
  //     const texto = '# Baasa\n\nRei de Israel';
  //     markdown.analisar(texto);

  //     expect(markdown.toMarkdown('Baasa')).toBe(texto);
  //   });
  // });
});
