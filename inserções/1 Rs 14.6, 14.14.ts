import { inserirVersículo } from '../Biblia';
import { expressão, Id, tokens } from '../Graphit';

let a: { id: Id };

inserirVersículo(
  '1 Rs 14.6',
  'Quando Aías ouviu o som dos passos junto da porta, disse: "Entre, mulher de Jeroboão. Por que esse fingimento? Fui encarregado de lhe dar más notícias.',
  () => {
    a = expressão('Quando Aías ouviu o som dos passos da mulher de Jeroboão junto da porta, ele disse: ');
    expressão([a, ...tokens('"Entre, mulher de Jeroboão."')]);
    expressão([a, ...tokens('"Por que esse fingimento?"')]);
    expressão([a, ...tokens('"Fui encarregado de lhe dar más notícias."')]);
  },
);

inserirVersículo(
  '1 Rs 14.14',
  '"O Senhor levantará para si um rei sobre Israel que eliminará a família de Jeroboão. Este é o dia! Como? Sim, agora mesmo.',
  () => {
    expressão([a, ...tokens('"O Senhor levantará para si um rei sobre Israel (Baasa) que eliminará a família de Jeroboão." ')]);
    expressão([a, ...tokens('"Este é o dia! Como? Sim, agora mesmo."')]);
  },
);
