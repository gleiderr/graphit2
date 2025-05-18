import { Tokenizer } from '../Tokenizer';

describe('Tokenizer', () => {
  let tokenizer: Tokenizer;

  beforeEach(() => {
    tokenizer = new Tokenizer();
  });

  describe('tokenize', () => {
    test('deve tokenizar uma frase simples', () => {
      expect(tokenizer.tokenize('Olá mundo')).toEqual(['olá', 'mundo']);
    });

    test('deve tokenizar texto com pontuação', () => {
      const expected = ['olá', ',', 'mundo', '!'];
      expect(tokenizer.tokenize('Olá, mundo!')).toEqual(expected);
    });

    test('deve tokenizar texto com caracteres especiais', () => {
      const text = 'teste@email.com (exemplo)';
      const expected = ['teste', '@', 'email', '.', 'com', '(', 'exemplo', ')'];
      expect(tokenizer.tokenize(text)).toEqual(expected);
    });

    test('deve tokenizar texto com caracteres acentuados', () => {
      const text = 'ação não está açúcar';
      const expected = ['ação', 'não', 'está', 'açúcar'];
      expect(tokenizer.tokenize(text)).toEqual(expected);
    });

    test('deve retornar array vazio para string vazia', () => {
      expect(tokenizer.tokenize('')).toEqual([]);
    });

    test('deve tokenizar texto com nomes próprios simples e compostos', () => {
      tokenizer.addNomesPróprios('Ben-Hadade', 'Tabriom');
      const text = 'Ben-Hadade, filho de Tabriom';
      const expected = ['Ben-Hadade', ',', 'filho', 'de', 'Tabriom'];
      expect(tokenizer.tokenize(text)).toEqual(expected);
    });

    test.skip('deve tokenizar texto com pontuações em sequência', () => {
      const text = 'dr.: Chapatin';
      const expected = ['dr', '.', ':', 'chapatin'];
      expect(tokenizer.tokenize(text)).toEqual(expected);
    });

    test.skip('deve tokenizar texto com ordinais', () => {
      const text = '1º, 2ª, 3ª';
      const expected = ['1', 'º', ',', '2', 'ª', ',', '3', 'ª'];
      expect(tokenizer.tokenize(text)).toEqual(expected);
    });

    test('deve tokenizar texto com números', () => {
      const text = 'A referência é 1rs 15.2';
      const expected = ['a', 'referência', 'é', '1rs', '15', '.', '2'];
      expect(tokenizer.tokenize(text)).toEqual(expected);
    });

    test('deve tokenizar priorizando nomes próprios maiores', () => {
      tokenizer.addNomesPróprios('Ben-Hadade', 'Ben');
      const text = 'Ben-Hadade é um nome próprio';
      const expected = ['Ben-Hadade', 'é', 'um', 'nome', 'próprio'];
      expect(tokenizer.tokenize(text)).toEqual(expected);
    });

    test('não deve tokenizar separando palavras inteiras', () => {
      tokenizer.addNomesPróprios('At'); // Sigla pra livro de Atos
      const text = 'Atalaia não deve ser separada';
      const expected = ['atalaia', 'não', 'deve', 'ser', 'separada'];
      expect(tokenizer.tokenize(text)).toEqual(expected);
    });
  });

  describe('detokenize', () => {
    test('deve reconstruir texto a partir de tokens simples', () => {
      const tokens = ['Olá', 'mundo'];
      expect(tokenizer.detokenize(tokens)).toBe('Olá mundo');
    });

    test('deve reconstruir texto com pontuação corretamente', () => {
      const tokens = ['Olá', ',', 'mundo', '!'];
      expect(tokenizer.detokenize(tokens)).toBe('Olá, mundo!');
    });

    test('deve reconstruir texto com parênteses e aspas corretamente', () => {
      const tokens = ['Ele', 'disse', '"', 'olá', '"', '(', 'formalmente', ')'];
      expect(tokenizer.detokenize(tokens)).toBe(
        'Ele disse "olá" (formalmente)'
      );
    });

    test('deve reconstruir texto complexo mantendo formatação adequada', () => {
      const tokens = [
        'Teste',
        '-',
        'unitário',
        'com',
        '[',
        'parênteses',
        ']',
        ',',
        '"',
        'aspas',
        '"',
        'e',
        'pontuação',
        '!',
      ];
      expect(tokenizer.detokenize(tokens)).toBe(
        'Teste-unitário com [parênteses], "aspas" e pontuação!'
      );
    });

    test('deve retornar string vazia para array vazio', () => {
      expect(tokenizer.detokenize([])).toBe('');
    });

    test('deve reconstruir texto com números', () => {
      const tokens = ['A', 'referência', 'é', '1Rs', '15', '.', '2'];
      expect(tokenizer.detokenize(tokens)).toBe('A referência é 1Rs 15.2');
    });
  });
});
