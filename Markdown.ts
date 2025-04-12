import { Graphit } from './Graphit';

type Linha = {
  tipo: string; // Tipo do nó (título, lista, parágrafo, etc.)
  nível: number;
  conteúdo: string;
  children: Linha[];
};

export class Markdown {
  constructor(private graphit: Graphit) {}

  // Método para converter texto markdown em informações do Graphit
  public analisar(texto: string) {
    const linhas = this.parse(texto);
    return linhas.map(linha => {
      const informação = this.graphit.informação(linha.conteúdo, {
        contém: linha.children.map(subLinha => subLinha.conteúdo),
      });

      this.analisarSublinhas(linha);
      return informação;
    });
  }

  private analisarSublinhas(linha: Linha) {
    linha.children.forEach(subLinha => {
      if (subLinha.children.length === 0) return;
      this.graphit.informação(subLinha.conteúdo, {
        contém: subLinha.children.map(subSubLinha => subSubLinha.conteúdo),
      });
      this.analisarSublinhas(subLinha);
    });
  }

  // Método para classificar linhas hierarquicamente a partir de um texto markdown
  private parse(markdownText: string) {
    const lines = markdownText.split('\n');
    const hierarchy: Linha[] = [];
    let stack: Linha[] = [];

    lines.forEach(line => {
      const linha = line.trim();

      if (!linha) return; // Ignora linhas vazias

      const linePattern = /^( *)(#{1,6}\s+|-\s+|\*\s+|\d+\.\s+|>\s+|)(.*)/;
      const match = linha.match(linePattern);
      if (!match) throw new Error('Linha inválida');

      const identação = match[1]; // Espaços em branco no início da linha
      const marker = match[2].trim(); // Marcador (título, lista, etc.)
      const conteúdo = match[3];

      const tipo = this.tipoLinha(marker);
      const nível = this.nivelLinha(identação, marker); // TODO: passar tipo ao invés de marker

      const newLine: Linha = { tipo, nível, conteúdo, children: [] };

      if (nível === 0) {
        stack = [newLine]; // Reinicia a pilha para o novo nível
      } else {
        // remove da pilha os nós que não são do nível atual ou superior
        while (stack.length > 0 && stack[stack.length - 1].nível >= nível) {
          stack.pop();
        }

        stack.push(newLine);
      }

      // Adiciona o novo nó à hierarquia se for o único nó na pilha
      if (stack.length === 1) hierarchy.push(stack[0]);
      else if (stack.length > 1) {
        const parent = stack[stack.length - 2];
        parent.children.push(newLine); // Adiciona o novo nó como filho do nó pai
      }
    });

    return hierarchy;
  }

  private tipoLinha(marker: string) {
    if (marker === '#') return 'title';
    if (marker === '-' || marker === '*') return 'list';
    if (marker.match(/\d+\./)) return 'list';
    if (marker === '>') return 'quote';
    return 'paragraph';
  }

  private nivelLinha(identação: string, marker: string) {
    if (marker.startsWith('#')) {
      return 0; // Títulos estão sempre no nível 0
    } else if (
      marker.startsWith('-') ||
      marker.startsWith('*') ||
      marker.match(/^\d+\./)
    ) {
      // Listas possuem nível 2 + quantidade de identações
      // Cada dois espaços representam um nível de identação
      const qtdIdentacao = identação.length / 2;
      return 2 + qtdIdentacao;
    } else if (marker.startsWith('>')) {
      // Citações possuem nível 1
      return 1;
    } else {
      // Parágrafos possuem nível 1
      return 1;
    }
  }
}
