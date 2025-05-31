import { Expressão, Graphit, Id, Termo } from './Graphit';
import { Esquema, Linha, Markdown } from './Markdown';
import { Tokenizer } from './Tokenizer';

// TODO: mover variável para local apropriado
const regexpReferências = /\(.*?\)$/; // /\s*\([^()]*\)$/ <---- Sugestão do Copilot

export class MarkdownBíblia extends Markdown {
  private livros = [
    // Antigo Testamento
    { livro: 'Gênesis', abreviatura: 'Gn' },
    { livro: 'Êxodo', abreviatura: 'Ex' },
    { livro: 'Levítico', abreviatura: 'Lv' },
    { livro: 'Números', abreviatura: 'Nm' },
    { livro: 'Deuteronômio', abreviatura: 'Dt' },
    { livro: 'Josué', abreviatura: 'Js' },
    { livro: 'Juízes', abreviatura: 'Jz' },
    { livro: 'Rute', abreviatura: 'Rt' },
    { livro: '1 Samuel', abreviatura: '1Sm' },
    { livro: '2 Samuel', abreviatura: '2Sm' },
    { livro: '1 Reis', abreviatura: '1Rs' },
    { livro: '2 Reis', abreviatura: '2Rs' },
    { livro: '1 Crônicas', abreviatura: '1Cr' },
    { livro: '2 Crônicas', abreviatura: '2Cr' },
    { livro: 'Esdras', abreviatura: 'Ed' },
    { livro: 'Neemias', abreviatura: 'Ne' },
    { livro: 'Ester', abreviatura: 'Et' },
    { livro: 'Jó', abreviatura: 'Jó' },
    { livro: 'Salmos', abreviatura: 'Sl' },
    { livro: 'Provérbios', abreviatura: 'Pv' },
    { livro: 'Eclesiastes', abreviatura: 'Ec' },
    { livro: 'Cantares de Salomão', abreviatura: 'Ct' },
    { livro: 'Isaías', abreviatura: 'Is' },
    { livro: 'Jeremias', abreviatura: 'Jr' },
    { livro: 'Lamentações de Jeremias', abreviatura: 'Lm' },
    { livro: 'Ezequiel', abreviatura: 'Ez' },
    { livro: 'Daniel', abreviatura: 'Dn' },
    { livro: 'Oséias', abreviatura: 'Os' },
    { livro: 'Joel', abreviatura: 'Jl' },
    { livro: 'Amós', abreviatura: 'Am' },
    { livro: 'Obadias', abreviatura: 'Ob' },
    { livro: 'Jonas', abreviatura: 'Jn' },
    { livro: 'Miquéias', abreviatura: 'Mq' },
    { livro: 'Naum', abreviatura: 'Na' },
    { livro: 'Habacuque', abreviatura: 'Hc' },
    { livro: 'Sofonias', abreviatura: 'Sf' },
    { livro: 'Ageu', abreviatura: 'Ag' },
    { livro: 'Zacarias', abreviatura: 'Zc' },
    { livro: 'Malaquias', abreviatura: 'Ml' },

    // Novo Testamento
    { livro: 'Mateus', abreviatura: 'Mt' },
    { livro: 'Marcos', abreviatura: 'Mc' },
    { livro: 'Lucas', abreviatura: 'Lc' },
    { livro: 'João', abreviatura: 'Jo' },
    { livro: 'Atos dos Apóstolos', abreviatura: 'At' },
    { livro: 'Romanos', abreviatura: 'Rm' },
    { livro: '1 Coríntios', abreviatura: '1Co' },
    { livro: '2 Coríntios', abreviatura: '2Co' },
    { livro: 'Gálatas', abreviatura: 'Gl' },
    { livro: 'Efésios', abreviatura: 'Ef' },
    { livro: 'Filipenses', abreviatura: 'Fp' },
    { livro: 'Colossenses', abreviatura: 'Cl' },
    { livro: '1 Tessalonicenses', abreviatura: '1Ts' },
    { livro: '2 Tessalonicenses', abreviatura: '2Ts' },
    { livro: '1 Timóteo', abreviatura: '1Tm' },
    { livro: '2 Timóteo', abreviatura: '2Tm' },
    { livro: 'Tito', abreviatura: 'Tt' },
    { livro: 'Filemom', abreviatura: 'Fm' },
    { livro: 'Hebreus', abreviatura: 'Hb' },
    { livro: 'Tiago', abreviatura: 'Tg' },
    { livro: '1 Pedro', abreviatura: '1Pe' },
    { livro: '2 Pedro', abreviatura: '2Pe' },
    { livro: '1 João', abreviatura: '1Jo' },
    { livro: '2 João', abreviatura: '2Jo' },
    { livro: '3 João', abreviatura: '3Jo' },
    { livro: 'Judas', abreviatura: 'Jd' },
    { livro: 'Apocalipse', abreviatura: 'Ap' },
  ];

  private pessoas = [
    'Acabe',
    'Aías',
    'Asa',
    'Baasa',
    'Ben-Hadade',
    'Deus',
    'Elá',
    'Gedalias',
    'Hanani',
    'Ismael',
    'Israel',
    'Issacar',
    'Jeroboão',
    'Jeú',
    'Nadabe',
    'Nebate',
    'Netanias',
    'Senhor',
    'Zinri',
  ];

  private lugares = [
    'Benjamim',
    'Geba',
    'Gibetom',
    'Israel',
    'Judá',
    'Mispá',
    'Ramá',
    'Tirza',
  ];

  constructor() {
    const tokenizer = new Tokenizer();
    const graphit = new Graphit(tokenizer);

    super(graphit);

    this.graphit = graphit;
    tokenizer.addNomesPróprios(...this.pessoas);
    tokenizer.addNomesPróprios(...this.lugares);
    tokenizer.addNomesPróprios(...this.livros.map(l => l.livro));
    tokenizer.addNomesPróprios(...this.livros.map(l => l.abreviatura));
  }

  registrarInformação(linha: Linha) {
    const informação = super.registrarInformação(linha);

    const semReferências = linha.conteúdo.replace(regexpReferências, '');
    this.graphit.informação(semReferências);

    linha.children.forEach(subLinha => {
      const semReferências = subLinha.conteúdo.replace(regexpReferências, '');
      this.graphit.informação(semReferências);
    });

    return informação;
  }
}

export const esquemaBíblia: Esquema = {
  resetVisitados: false,
  nívelInicial: 0,

  descendentes(informação: Termo | Expressão): Id[] {
    return informação.contém;
  },

  getValor(markdown, informação) {
    const valor = markdown.graphit.getValor(informação);
    // remove o texto entre parênteses no final de cada linha
    const valorSemRef = valor.replace(regexpReferências, '');
    const informaçãoSemRef = markdown.graphit.informação(valorSemRef);
    const refIds = getReferências(markdown, informaçãoSemRef);
    const referências = refIds
      .map(i => markdown.graphit.get(i))
      .map(i => markdown.graphit.getValor(i));
    const versículos = getVersículos(referências);

    if (versículos.length > 0) {
      return valor + `<!-- ${versículos.join(', ')} -->`;
    }
    return valor;
  },
};

function getVersículos(referências: string[]): string[] {
  const livros = [
    { livro: 'Gênesis', abreviatura: 'Gn' },
    { livro: 'Êxodo', abreviatura: 'Ex' },
    { livro: 'Levítico', abreviatura: 'Lv' },
    { livro: 'Números', abreviatura: 'Nm' },
    { livro: 'Deuteronômio', abreviatura: 'Dt' },
    { livro: 'Josué', abreviatura: 'Js' },
    { livro: 'Juízes', abreviatura: 'Jz' },
    { livro: 'Rute', abreviatura: 'Rt' },
    { livro: '1 Samuel', abreviatura: '1Sm' },
    { livro: '2 Samuel', abreviatura: '2Sm' },
    { livro: '1 Reis', abreviatura: '1Rs' },
    { livro: '2 Reis', abreviatura: '2Rs' },
    { livro: '1 Crônicas', abreviatura: '1Cr' },
    { livro: '2 Crônicas', abreviatura: '2Cr' },
    { livro: 'Esdras', abreviatura: 'Ed' },
    { livro: 'Neemias', abreviatura: 'Ne' },
    { livro: 'Ester', abreviatura: 'Et' },
    { livro: 'Jó', abreviatura: 'Jó' },
    { livro: 'Salmos', abreviatura: 'Sl' },
    { livro: 'Provérbios', abreviatura: 'Pv' },
    { livro: 'Eclesiastes', abreviatura: 'Ec' },
    { livro: 'Cantares de Salomão', abreviatura: 'Ct' },
    { livro: 'Isaías', abreviatura: 'Is' },
    { livro: 'Jeremias', abreviatura: 'Jr' },
    { livro: 'Lamentações de Jeremias', abreviatura: 'Lm' },
    { livro: 'Ezequiel', abreviatura: 'Ez' },
    { livro: 'Daniel', abreviatura: 'Dn' },
    { livro: 'Oséias', abreviatura: 'Os' },
    { livro: 'Joel', abreviatura: 'Jl' },
    { livro: 'Amós', abreviatura: 'Am' },
    { livro: 'Obadias', abreviatura: 'Ob' },
    { livro: 'Jonas', abreviatura: 'Jn' },
    { livro: 'Miquéias', abreviatura: 'Mq' },
    { livro: 'Naum', abreviatura: 'Na' },
    { livro: 'Habacuque', abreviatura: 'Hc' },
    { livro: 'Sofonias', abreviatura: 'Sf' },
    { livro: 'Ageu', abreviatura: 'Ag' },
    { livro: 'Zacarias', abreviatura: 'Zc' },
    { livro: 'Malaquias', abreviatura: 'Ml' },
    { livro: 'Mateus', abreviatura: 'Mt' },
    { livro: 'Marcos', abreviatura: 'Mc' },
    { livro: 'Lucas', abreviatura: 'Lc' },
    { livro: 'João', abreviatura: 'Jo' },
    { livro: 'Atos dos Apóstolos', abreviatura: 'At' },
    { livro: 'Romanos', abreviatura: 'Rm' },
    { livro: '1 Coríntios', abreviatura: '1Co' },
    { livro: '2 Coríntios', abreviatura: '2Co' },
    { livro: 'Gálatas', abreviatura: 'Gl' },
    { livro: 'Efésios', abreviatura: 'Ef' },
    { livro: 'Filipenses', abreviatura: 'Fp' },
    { livro: 'Colossenses', abreviatura: 'Cl' },
    { livro: '1 Tessalonicenses', abreviatura: '1Ts' },
    { livro: '2 Tessalonicenses', abreviatura: '2Ts' },
    { livro: '1 Timóteo', abreviatura: '1Tm' },
    { livro: '2 Timóteo', abreviatura: '2Tm' },
    { livro: 'Tito', abreviatura: 'Tt' },
    { livro: 'Filemom', abreviatura: 'Fm' },
    { livro: 'Hebreus', abreviatura: 'Hb' },
    { livro: 'Tiago', abreviatura: 'Tg' },
    { livro: '1 Pedro', abreviatura: '1Pe' },
    { livro: '2 Pedro', abreviatura: '2Pe' },
    { livro: '1 João', abreviatura: '1Jo' },
    { livro: '2 João', abreviatura: '2Jo' },
    { livro: '3 João', abreviatura: '3Jo' },
    { livro: 'Judas', abreviatura: 'Jd' },
    { livro: 'Apocalipse', abreviatura: 'Ap' },
  ];

  const regexp = new RegExp(
    `(${livros.map(l => l.livro).join('|')})\\s+(\\d+)\\.(\\d+)`
  );

  const versículos = referências
    .map(ref => ref.match(regexp))
    .filter(Boolean)
    .map(ref => ref![0] as string)
    .map(ref => {
      // substitui os livros por suas abreviações
      const livro = ref.match(
        new RegExp(`(${livros.map(l => l.livro).join('|')})`)
      );
      return livro
        ? livros.find(l => l.livro === livro[0])?.abreviatura +
            ref.replace(livro[0], '')
        : ref;
    })
    .sort((v1, v2) => {
      const [livro1, cap1, vers1] = v1.split(/\s+|\./);
      const [livro2, cap2, vers2] = v2.split(/\s+|\./);
      if (livro1 === livro2) {
        if (cap1 === cap2) return parseInt(vers1) - parseInt(vers2);
        return parseInt(cap1) - parseInt(cap2);
      }
      return (
        livros.findIndex(l => l.abreviatura === livro1) -
        livros.findIndex(l => l.abreviatura === livro2)
      );
    });

  return versículos;
}

function getReferências(
  markdown: Markdown,
  informação: Termo | Expressão,
  ignorar = new Set<Id>()
): string[] {
  const referências = new Set<Id>();
  const stack = [informação];

  while (stack.length > 0) {
    const atual = stack.pop()!;
    if (ignorar.has(atual.id)) continue;

    ignorar.add(atual.id);

    atual.contidaEm.forEach(i => referências.add(i));
    if ('pertence_a' in atual) {
      atual.pertence_a.forEach(i => referências.add(i));
    } else {
      atual.subexpressãoDe.forEach(i => referências.add(i));
    }

    [...referências]
      .filter(i => !ignorar.has(i))
      .filter(i => !markdown.escritos.has(i))
      .map(i => markdown.graphit.get(i))
      .forEach(i => stack.push(i));
  }

  return [...referências].filter(i => !markdown.escritos.has(i));
}
