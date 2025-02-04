import { inserirVersículo } from '../Biblia';
import { aresta, Id, tokens } from '../Graphit';

let a: { id: Id };
inserirVersículo('1 Rs 16.1', 'Então a palavra do Senhor contra Baasa veio a Jeú, filho de Hanani:', () => {
  a = aresta('Então a palavra do Senhor contra Baasa veio a Jeú:');
  aresta('Jeú, filho de Hanani');
});

inserirVersículo(
  '1 Rs 16.2',
  '"Eu o levantei do pó e o tornei líder de Israel, meu povo, mas você andou nos caminhos de Jeroboão e fez o meu povo pecar e provocar a minha ira por causa dos pecados deles.',
  () => {
    aresta([a, ...tokens('"O Senhor levantou Baasa do pó e o tornou líder de Israel"')]);
    aresta('Israel, povo do Senhor');

    // TODO: Corrigir
    aresta([a, ...tokens('"Baasa andou nos caminhos de Jeroboão"')]);
    aresta([a, ...tokens('"Baasa fez Israel pecar"')]);
    aresta([a, ...tokens('"Baasa fez Israel provocar a ira do Senhor por causa dos pecados deles"')]);
  },
);

inserirVersículo(
  '1 Rs 16.8',
  'No vigésimo sexto ano do reinado de Asa, rei de Judá, Elá, filho de Baasa, tornou-se rei de Israel, e reinou dois anos em Tirza.',
  () => {
    aresta('Asa, rei de Judá');
    aresta(['Elá', ', filho', 'de', 'Baasa']);
    aresta(['Elá', ', rei de', 'Israel']);

    const b = aresta(['Elá', 'reinou', '2 anos']);
    aresta([b, 'em', 'Tirza']);

    const a = aresta(['Elá', 'tornou-se', 'rei', 'de', 'Israel']);
    aresta([a, 'no', '26º', 'ano', 'do', 'reinado', 'de', 'Asa']);
  },
);
