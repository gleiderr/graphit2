/**
 * Classe para tokenização de texto.
 * A tokenização é o processo de dividir um texto em partes menores, chamadas de tokens.
 */
export class Tokenizer {
  private próprios = new Set<string>(); // Conjunto para armazenar nomes próprios

  /**
   * Adiciona nomes próprios à lista de nomes próprios.
   * Remove espaços em branco antes e depois de cada nome.
   * @param nome Um ou mais nomes próprios a serem adicionados.
   */
  addNomesPróprios(...nome: string[]): void {
    nome.forEach(s => this.próprios.add(s.trim()));
  }

  /**
   * Tokeniza o texto fornecido.
   * @param text Texto a ser tokenizado.
   * @returns Um array de tokens.
   */
  tokenize(text: string): string[] {
    const palavrasEPontuações = '[^0-9a-zA-Zà-úÀ-Ú]+';
    const expressão = [palavrasEPontuações, ...this.próprios].join('|');
    const regexp = new RegExp(`(${expressão})`); // Expressão regular para dividir o texto em tokens

    return text
      .split(regexp) // Divide a string em tokens incluindo pontuação e considerando nomes próprios
      .map(s => s.trim()) // Remove espaços em branco
      .filter(Boolean) // Remove tokens vazios
      .map(s => (this.próprios.has(s) ? s : s.toLocaleLowerCase('pt-BR'))); // Converte para minúsculas, exceto nomes próprios
  }

  /**
   * Reconstrói o texto a partir de tokens.
   * @param tokens Um array de tokens a serem juntados.
   * @returns O texto reconstruído.
   */
  detokenize(tokens: string[]): string {
    let text = tokens.join(' ');

    text = text.replace(/\s+([-])\s+/g, '$1'); // Remover espaços antes e depois de hífens
    text = text.replace(/\s+([,.!?;:])/g, '$1'); // Remover espaços antes de pontuações
    text = text.replace(/([([])\s+/g, '$1'); // Remover espaços depois de abrir parênteses ou aspas
    text = text.replace(/\s+([)\]])/g, '$1'); // Remover espaços antes de fechar parênteses ou aspas

    // Remove espaços após aspas de abertura e antes de aspas de fechamento
    text = text.replace(/"\s*(.*?)\s*"/g, '"$1"');

    // Remove espaços após apóstrofos de abertura e antes de apóstrofos de fechamento
    text = text.replace(/'\s*(.*?)\s*'/g, "'$1'");

    return text;
  }
}
