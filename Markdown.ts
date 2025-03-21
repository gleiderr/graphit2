import { Expressão, Graphit, Termo } from './Graphit';

export class Markdown {
  constructor(private graphit: Graphit) {}

  expressar(texto: string): string {
    // Verifica se o texto é um título
    if (texto.startsWith('# ')) {
      // Registra o texto removendo o marcador de título (#) no Graphit
      const termos = this.graphit.tokenize(texto.replace('# ', ''));
      if (termos.length == 1) {
        return this.markdown(this.graphit.termo(termos[0]));
      } else {
        throw new Error('Não implementado ainda');
      }
    }

    throw new Error('Não implementado ainda');
  }

  private markdown(nó: Termo | Expressão): string {
    if ('valor' in nó) {
      return `# ${nó.valor}\n\n`;
    } else {
      return 'this.graphit.get(nó.id).valor';
    }
  }
}
