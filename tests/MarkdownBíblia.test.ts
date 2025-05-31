import { Termo } from '../Graphit';
import { MarkdownBíblia, esquemaBíblia } from '../MarkdownBíblia';

const baasa = `# Baasa

Baasa, rei de Israel

Houve guerra entre Asa e Baasa durante todo o reinado deles.
`;

const baasaComentários = `# Baasa<!-- 1Rs 15.16 -->

Baasa, rei de Israel<!-- 1Rs 15.16 -->

Houve guerra entre Asa e Baasa durante todo o reinado deles.<!-- 1Rs 15.16 -->
`;

// TODO: utilizar essa linha
//const baasaParênteses = `# Baasa (1Rs 15.16)
const baasaParênteses = `# Baasa

Baasa, rei de Israel (1Rs 15.16)

Houve guerra entre Asa e Baasa durante todo o reinado deles. (1Rs 15.16)
`;

// TODO: utilizar essa linha
// const baasaParêntesesComentários = `# Baasa (1Rs 15.16)<!-- 1Rs 15.16 -->
const baasaParêntesesComentários = `# Baasa<!-- 1Rs 15.16 -->

Baasa, rei de Israel (1Rs 15.16)<!-- 1Rs 15.16 -->

Houve guerra entre Asa e Baasa durante todo o reinado deles. (1Rs 15.16)<!-- 1Rs 15.16 -->
`;

const bíbliaInput = `# Bíblia
## 1 Reis 15.16
Houve guerra entre Asa e Baasa, rei de Israel, durante todo o reinado deles.
- Houve guerra entre Asa e Baasa durante todo o reinado deles.`;

describe('Bíblia', () => {
  const getEscritos = (markdown: MarkdownBíblia) =>
    [...markdown.escritos].map(id =>
      markdown.graphit.getValor(markdown.graphit.get(id))
    );

  test('Deve ler texto simples e escrever o que foi lido', () => {
    const markdown = new MarkdownBíblia();
    markdown.ler(baasa);

    const termoBaasa = markdown.graphit.informação('Baasa') as Termo;
    const textoBaasa = markdown.escrever([termoBaasa], esquemaBíblia);

    expect(textoBaasa).toBe(baasa);

    expect(getEscritos(markdown)).toEqual([
      'Baasa',
      'Baasa, rei de Israel',
      'houve guerra entre Asa e Baasa durante todo o reinado deles.',
    ]);
  });

  test('Deve ler texto simples, ler bíblia e escrever o que foi lido, mas com referências comentadas', () => {
    const markdown = new MarkdownBíblia();
    markdown.ler(baasa);
    markdown.ler(bíbliaInput);

    const termoBaasa = markdown.graphit.informação('Baasa') as Termo;
    const baasaOutput = markdown.escrever([termoBaasa], esquemaBíblia);

    expect(baasaOutput).toBe(baasaComentários);

    expect(getEscritos(markdown)).toEqual([
      'Baasa',
      'Baasa, rei de Israel',
      'houve guerra entre Asa e Baasa durante todo o reinado deles.',
    ]);
  });

  test('Deve ler texto com referências comentadas, ler bíblia e escrever o que foi lido com referências comentadas', () => {
    const markdown = new MarkdownBíblia();
    markdown.ler(baasaComentários);
    markdown.ler(bíbliaInput);

    const termoBaasa = markdown.graphit.informação('Baasa') as Termo;
    const baasaOutput = markdown.escrever([termoBaasa], esquemaBíblia);

    expect(baasaOutput).toBe(baasaComentários);

    expect(getEscritos(markdown)).toEqual([
      'Baasa',
      'Baasa, rei de Israel',
      'houve guerra entre Asa e Baasa durante todo o reinado deles.',
    ]);
  });

  test('Deve ler texto com referências entre parênteses e escrever o que foi lido', () => {
    const markdown = new MarkdownBíblia();
    markdown.ler(baasaParênteses);

    const termoBaasa = markdown.graphit.informação('Baasa') as Termo;
    const baasaOutput = markdown.escrever([termoBaasa], esquemaBíblia);

    expect(baasaOutput).toBe(baasaParênteses);

    expect(getEscritos(markdown)).toEqual([
      'Baasa',
      'Baasa, rei de Israel (1Rs 15.16)',
      'Baasa, rei de Israel',
      'houve guerra entre Asa e Baasa durante todo o reinado deles. (1Rs 15.16)',
      'houve guerra entre Asa e Baasa durante todo o reinado deles.',
    ]);
  });

  test('Deve ler texto com referências entre parênteses, ler bíblia e escrever o que foi lido com referências entre parênteses e comentadas', () => {
    const markdown = new MarkdownBíblia();
    markdown.ler(baasaParênteses);
    markdown.ler(bíbliaInput);

    const termoBaasa = markdown.graphit.informação('Baasa') as Termo;
    const baasaOutput = markdown.escrever([termoBaasa], esquemaBíblia);

    expect(baasaOutput).toBe(baasaParêntesesComentários);
  });

  test.todo('Deve ignorar pontuação no final da linha');
});
