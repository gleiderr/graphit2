import { Graphit } from '../Graphit';
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
    test('Deve analisar parágrafos com um termo', () => {
      const baasa = markdown.analisar('Baasa');
      expect(baasa.termos).toHaveLength(1);
    });

    test('Deve analisar parágrafos com uma expressão', () => {
      const baasa = markdown.analisar('Baasa, filho de Aías');
      expect(baasa.termos).toHaveLength(5);
    });

    test('Deve analisar títulos com um termo', () => {
      const stats = markdown.analisar('# Baasa');

      expect(stats.termos).toHaveLength(1);
      expect(stats.termosOcultos).toHaveLength(0);
    });

    test('Deve analisar títulos com uma expressão', () => {
      const stats = markdown.analisar('# Baasa, filho de Aías');

      expect(stats.termos).toHaveLength(5);
      expect(stats.termosOcultos).toHaveLength(0);
    });

    test('Deve analisar listas com um termo', () => {
      const stats = markdown.analisar('- Baasa');

      expect(stats.termos).toHaveLength(1);
      expect(stats.termosOcultos).toHaveLength(0);
    });

    test('Deve analisar listas com uma expressão', () => {
      const stats = markdown.analisar('- Baasa, filho de Aías');

      expect(stats.termos).toHaveLength(5);
      expect(stats.termosOcultos).toHaveLength(0);
    });

    test('Deve analisar citações com um termo', () => {
      const stats = markdown.analisar('> Baasa');

      expect(stats.termos).toHaveLength(1);
      expect(stats.termosOcultos).toHaveLength(0);
    });

    test('Deve analisar citações com uma expressão', () => {
      const stats = markdown.analisar('> Baasa, filho de Aías');
      expect(stats.termos).toHaveLength(5);
      expect(stats.termosOcultos).toHaveLength(0);
    });

    test('Deve analisar listas numéricas com um termo', () => {
      const stats = markdown.analisar('1. Baasa');

      expect(stats.termos).toHaveLength(1);
      expect(stats.termosOcultos).toHaveLength(0);
    });

    test('Deve analisar listas numéricas com uma expressão', () => {
      const stats = markdown.analisar('1. Baasa, filho de Aías');

      expect(stats.termos).toHaveLength(5);
      expect(stats.termosOcultos).toHaveLength(0);
    });

    test.skip('Deve analisar texto com formatação', () => {
      const stats = markdown.analisar('**Baasa** é um personagem importante.');

      expect(stats.termos).toHaveLength(5);
      expect(stats.termosOcultos).toHaveLength(0);
    });
  });

  describe('Análise múltiplas linhas', () => {
    test('Deve analisar várias linhas', () => {
      const stats = markdown.analisar('# Baasa\n\nBaasa, filho de Aías');

      expect(stats.termos).toHaveLength(5);
      expect(stats.termosOcultos).toHaveLength(0);
      expect(stats.expressões).toHaveLength(1);
      expect(stats.expressõesOcultas).toHaveLength(0);
    });

    test('Deve reconhecer termos ocultos', () => {
      const stats = markdown.analisar('# Baasa\n\nFilho de Aías');

      expect(stats.termos).toHaveLength(4);
      expect(stats.termosOcultos).toHaveLength(1);
      expect(stats.expressões).toHaveLength(1);
      expect(stats.expressõesOcultas).toHaveLength(0);
    });

    test('Deve reconhecer expressões ocultas', () => {
      const stats = markdown.analisar('# Ben-Hadade\n\nFilho de Tabriom');

      expect(stats.termos).toHaveLength(6);
      expect(stats.termosOcultos).toHaveLength(0);
      expect(stats.expressões).toHaveLength(2);
      expect(stats.expressõesOcultas).toHaveLength(1);
    });
  });
});
