import { inserirVersículo } from '../Biblia';
import { aresta, Id, tokens } from '../Graphit';

let a: { id: Id };

inserirVersículo(
  '1 Rs 14.6',
  'Quando Aías ouviu o som dos passos junto da porta, disse: "Entre, mulher de Jeroboão. Por que esse fingimento? Fui encarregado de lhe dar más notícias.',
  () => {
    a = aresta('Quando Aías ouviu o som dos passos da mulher de Jeroboão junto da porta, ele disse: ');
    aresta([a, ...tokens('"Entre, mulher de Jeroboão."')]);
    aresta([a, ...tokens('"Por que esse fingimento?"')]);
    aresta([a, ...tokens('"Fui encarregado de lhe dar más notícias."')]);
  },
);

inserirVersículo(
  '1 Rs 14.14',
  '"O Senhor levantará para si um rei sobre Israel que eliminará a família de Jeroboão. Este é o dia! Como? Sim, agora mesmo.',
  () => {
    aresta([a, ...tokens('"O Senhor levantará para si um rei sobre Israel (Baasa) que eliminará a família de Jeroboão." ')]);
    aresta([a, ...tokens('"Este é o dia! Como? Sim, agora mesmo."')]);
  },
);
