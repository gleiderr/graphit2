/**
 * Classe para tokenização de texto.
 * A tokenização é o processo de dividir um texto em partes menores, chamadas de tokens.
 */
export class Tokenizer {
  /**
   * Tokeniza o texto fornecido.
   * @param text Texto a ser tokenizado.
   * @returns Um array de tokens.
   */
  tokenize(text: string): string[] {
    return text
      .split(/([^a-zA-Zà-úÀ-Ú]+)/) // Divide a string em tokens incluindo pontuação
      .map(s => s.trim()) // Remove espaços em branco
      .filter(Boolean); // Remove tokens vazios
  }

  /**
   * Reconstrói o texto a partir de tokens.
   * @param tokens Um array de tokens a serem juntados.
   * @returns O texto reconstruído.
   */
  detokenize(tokens: string[]): string {
    let text = tokens.join(' ');

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
