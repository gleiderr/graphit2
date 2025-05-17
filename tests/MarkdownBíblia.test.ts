import { Termo } from '../Graphit';
import { MarkdownBíblia, esquemaBíblia } from '../MarkdownBíblia';

const baasaInput = `# Baasa

Baasa, rei de Israel
`;

const baasaExpectedOutput = `# Baasa<!-- 1Rs 15.16 -->

Baasa, rei de Israel<!-- 1Rs 15.16 -->
`;

const bíbliaInput = `# Bíblia
## 1 Reis 15.16
Houve guerra entre Asa e Baasa, rei de Israel, durante todo o reinado deles.`;

describe('Bíblia', () => {
  test('Sem referências bíblicas, deve ler texto e escrever exatamente o que foi lido', () => {
    const markdown = new MarkdownBíblia();
    markdown.ler(baasaInput);

    const termoBaasa = markdown.graphit.informação('Baasa') as Termo;
    const textoBaasa = markdown.escrever([termoBaasa], esquemaBíblia);

    expect(textoBaasa).toBe(baasaInput);
  });

  test('Com referências bíblicas, deve ler texto e escrever o que foi lido, mas com referências bíblicas', () => {
    const markdown = new MarkdownBíblia();
    markdown.ler(baasaInput);
    markdown.ler(bíbliaInput);

    const termoBaasa = markdown.graphit.informação('Baasa') as Termo;
    const baasaOutput = markdown.escrever([termoBaasa], esquemaBíblia);

    expect(baasaOutput).toBe(baasaExpectedOutput);
  });
});
