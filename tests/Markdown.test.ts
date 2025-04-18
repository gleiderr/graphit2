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

  describe('Com única linha', () => {
    [
      { tipo: 'parágrafo', texto: 'Baasa' },
      { tipo: 'título', texto: '# Baasa' },
      { tipo: 'lista', texto: '- Baasa' },
      { tipo: 'citação', texto: '> Baasa' },
      { tipo: 'lista numérica', texto: '1. Baasa' },
    ].forEach(({ tipo, texto }) => {
      test(`Deve ler ${tipo} com um termo`, () => {
        const informações = markdown.ler(texto);

        expect(informações).toHaveLength(1);

        const termo = informações[0] as Termo;
        expect(termo.valor).toBe(texto.replace(/^(#|>|-|\d+\.)?\s*/, ''));
        expect(termo.contém).toHaveLength(0);
        expect(termo.contidaEm).toHaveLength(0);
        expect(termo.pertence_a).toHaveLength(0);
      });

      test(`Deve escrever ${tipo} com um termo`, () => {
        const informações = markdown.ler(texto);
        const textoEscrito = markdown.escrever(informações);

        const textoEsperado = texto.replace(/^(#|>|-|\d+\.)?\s*/, '');
        expect(textoEscrito).toBe(`# ${textoEsperado}\n`);
      });
    });

    [
      { tipo: 'parágrafo', texto: 'Baasa, filho de Aías' },
      { tipo: 'título', texto: '# Baasa, filho de Aías' },
      { tipo: 'lista', texto: '- Baasa, filho de Aías' },
      { tipo: 'citação', texto: '> Baasa, filho de Aías' },
      { tipo: 'lista numérica', texto: '1. Baasa, filho de Aías' },
    ].forEach(({ tipo, texto }) => {
      test(`Deve ler ${tipo} com uma expressão`, () => {
        const informações = markdown.ler(texto);

        expect(informações).toHaveLength(1);

        const expressão = informações[0] as Expressão;
        const termos = expressão.termos.map(
          t => (graphit.get(t) as Termo).valor
        );
        expect(termos).toEqual(['Baasa', ',', 'filho', 'de', 'Aías']);
      });

      test(`Deve escrever ${tipo} com uma expressão`, () => {
        const informações = markdown.ler(texto);
        const textoEscrito = markdown.escrever(informações);

        const textoEsperado = texto.replace(/^(#|>|-|\d+\.)?\s*/, '');
        expect(textoEscrito).toBe(`# ${textoEsperado}\n`);
      });
    });

    // TODO:
    // test.skip('Deve ler texto com formatação', () => {
    //   const stats = markdown.ler('**Baasa** é um personagem importante.');

    //   expect(stats.termos).toHaveLength(5);
    //   expect(stats.termosOcultos).toHaveLength(0);
    // });
  });

  describe('Com duas linhas', () => {
    [
      {
        tipos: ['título', 'parágrafo'],
        texto: '# Baasa\n\nBaasa, filho de Aías',
      },
      {
        tipos: ['parágrafo', 'lista'],
        texto: 'Baasa\n\n- Baasa, filho de Aías',
      },
    ].forEach(({ tipos, texto }) => {
      const [tipo1, tipo2] = tipos;

      test(`Deve ler ${tipo2} contido em ${tipo1}`, () => {
        const informações = markdown.ler(texto);

        expect(informações).toHaveLength(1);

        const título = informações[0] as Termo;
        expect(título.valor).toBe('Baasa');
        expect(título.contém).toHaveLength(1);
        expect(título.contidaEm).toHaveLength(0);
        expect(título.pertence_a).toHaveLength(1);

        const parágrafo = graphit.get(título.contém[0]) as Expressão;
        const termos = parágrafo.termos.map(
          t => (graphit.get(t) as Termo).valor
        );
        expect(termos).toEqual(['Baasa', ',', 'filho', 'de', 'Aías']);
        expect(parágrafo.contidaEm).toHaveLength(1);
      });

      test(`Deve escrever ${tipo2} contido em ${tipo1}`, () => {
        const informações = markdown.ler(texto);
        const textoEscrito = markdown.escrever(informações);

        const textoEsperado = texto
          .split('\n')
          .map(line => line.replace(/^(#|>|-|\d+\.)?\s*/, ''))
          .join('\n');
        expect(textoEscrito).toBe(`# ${textoEsperado}\n`);
      });
    });
  });

  describe('Com três linhas', () => {
    [
      {
        tipos: ['título', 'parágrafo', 'lista'],
        texto: '# Baasa\n\nBaasa, rei de Israel\n- Reinou em Tirza',
      },
      {
        tipos: ['lista', 'lista', 'lista numérica'],
        texto: '- Baasa\n  - Baasa, rei de Israel\n    1. Reinou em Tirza',
      },
    ].forEach(({ tipos, texto }) => {
      const [tipo1, tipo2, tipo3] = tipos;

      test(`Deve ler ${tipo3} contido em ${tipo2} contido em ${tipo1}`, () => {
        const informações = markdown.ler(texto);

        expect(informações).toHaveLength(1);

        const título = informações[0] as Termo;
        expect(título.valor).toBe('Baasa');
        expect(título.contém).toHaveLength(1);
        expect(título.contidaEm).toHaveLength(0);
        expect(título.pertence_a).toHaveLength(1);

        const getTermos = (t: string) => (graphit.get(t) as Termo).valor;

        const parágrafo = graphit.get(título.contém[0]) as Expressão;
        const termosParágrafo = parágrafo.termos.map(getTermos);
        expect(termosParágrafo).toEqual(['Baasa', ',', 'rei', 'de', 'Israel']);
        expect(parágrafo.contém).toHaveLength(1);
        expect(parágrafo.contidaEm).toEqual([título.id]);

        const lista = graphit.get(parágrafo.contém[0]) as Expressão;
        const termosLista = lista.termos.map(getTermos);
        expect(termosLista).toEqual(['Reinou', 'em', 'Tirza']);
        expect(lista.contém).toHaveLength(0);
        expect(lista.contidaEm).toHaveLength(1);
      });

      test(`Deve escrever ${tipo3} contido em ${tipo2} contido em ${tipo1}`, () => {
        const informações = markdown.ler(texto);
        const textoEscrito = markdown.escrever(informações);

        expect(textoEscrito).toBe(
          '# Baasa\n\nBaasa, rei de Israel\n- Reinou em Tirza\n'
        );
      });
    });
  });

  describe('Com quatro linhas', () => {
    test('Deve ler texto com 1 título contendo 3 parágrafos', () => {
      const texto =
        '# Baasa\n\nBaasa, filho de Aías\n\nRei de Israel\n\nReinou em Tirza\n';
      const informações = markdown.ler(texto);

      expect(informações).toHaveLength(1);

      const título = informações[0] as Termo;
      expect(título.valor).toBe('Baasa');
      expect(título.contém).toHaveLength(3);
      expect(título.contidaEm).toHaveLength(0);
      expect(título.pertence_a).toHaveLength(1);

      const parágrafos = título.contém.map(t => graphit.get(t) as Expressão);
      const termosParágrafos = parágrafos.map(parágrafo =>
        parágrafo.termos.map(t => (graphit.get(t) as Termo).valor)
      );

      expect(termosParágrafos).toEqual([
        ['Baasa', ',', 'filho', 'de', 'Aías'],
        ['Rei', 'de', 'Israel'],
        ['Reinou', 'em', 'Tirza'],
      ]);

      parágrafos.forEach(parágrafo => {
        expect(parágrafo.contidaEm).toEqual([título.id]);
        expect(parágrafo.contém).toHaveLength(0);
      });
    });

    test('Deve escrever texto com 1 título contendo 3 parágrafos', () => {
      const texto =
        '# Baasa\n\nBaasa, filho de Aías\n\nRei de Israel\n\nReinou em Tirza\n';
      const informações = markdown.ler(texto);
      const textoEscrito = markdown.escrever(informações);

      expect(textoEscrito).toBe(
        '# Baasa\n\nBaasa, filho de Aías\n\nRei de Israel\n\nReinou em Tirza\n'
      );
    });
  });
});
