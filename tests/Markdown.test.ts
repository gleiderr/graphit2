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

  test('Deve expressar títulos corretamente', () => {
    const baasa = markdown.expressar('# Baasa');
    expect(baasa).toBe('# Baasa\n\n');
  });

  test('Deve expressar títulos seguidos de parágrafos corretamente', () => {
    const baasa = markdown.expressar('# Baasa\n\nRei de Israel');
    expect(baasa).toBe('# Baasa\n\nRei de Israel\n\n');
  });
});
