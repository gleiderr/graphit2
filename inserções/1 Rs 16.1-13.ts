import { inserirVersículo } from '../Biblia';
import { expressão, Id, tokens } from '../Graphit';

let a: { id: Id };
inserirVersículo('1 Rs 16.1', 'Então a palavra do Senhor contra Baasa veio a Jeú, filho de Hanani:', () => {
  a = expressão('Então a palavra do Senhor contra Baasa veio a Jeú:');
  expressão('Jeú, filho de Hanani');
});

inserirVersículo(
  '1 Rs 16.2',
  '"Eu o levantei do pó e o tornei líder de Israel, meu povo, mas você andou nos caminhos de Jeroboão e fez o meu povo pecar e provocar a minha ira por causa dos pecados deles.',
  () => {
    expressão([a, ...tokens('"O Senhor levantou Baasa do pó e o tornou líder de Israel"')]);
    expressão('Israel, povo do Senhor');

    // TODO: Corrigir
    expressão([a, ...tokens('"Baasa andou nos caminhos de Jeroboão"')]);
    expressão([a, ...tokens('"Baasa fez Israel pecar"')]);
    expressão([a, ...tokens('"Baasa fez Israel provocar a ira do Senhor por causa dos pecados deles"')]);
  },
);

inserirVersículo(
  '1 Rs 16.8',
  'No vigésimo sexto ano do reinado de Asa, rei de Judá, Elá, filho de Baasa, tornou-se rei de Israel, e reinou dois anos em Tirza.',
  () => {
    expressão('Asa, rei de Judá');
    expressão(['Elá', ', filho', 'de', 'Baasa']);
    expressão(['Elá', ', rei de', 'Israel']);

    const b = expressão(['Elá', 'reinou', '2 anos']);
    expressão([b, 'em', 'Tirza']);

    const a = expressão(['Elá', 'tornou-se', 'rei', 'de', 'Israel']);
    expressão([a, 'no', '26º', 'ano', 'do', 'reinado', 'de', 'Asa']);
  },
);
