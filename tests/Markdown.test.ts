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

  test('Deve analisar parágrafos com um termo', () => {
    const baasa = markdown.analisar('Baasa');
    expect(baasa.termos).toHaveLength(1);
  });

  test('Deve analisar parágrafos com uma expressão', () => {
    const baasa = markdown.analisar('Baasa, filho de Aías');
    expect(baasa.termos).toHaveLength(5);
  });
});
