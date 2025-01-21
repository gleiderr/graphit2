import { inserirVersículo } from '../Biblia';
import { aresta } from '../Graphit';

inserirVersículo(
  '1 Rs 16.8',
  'No vigésimo sexto ano do reinado de Asa, rei de Judá, Elá, filho de Baasa, tornou-se rei de Israel, e reinou dois anos em Tirza.',
  () => {
    aresta(['Asa', ', rei de', 'Judá']);
    aresta(['Elá', ', filho', 'de', 'Baasa']);
    aresta(['Elá', ', rei de', 'Israel']);

    const b = aresta(['Elá', 'reinou', '2 anos']);
    aresta([b, 'em', 'Tirza']);

    const a = aresta(['Elá', 'tornou-se', 'rei', 'de', 'Israel']);
    aresta([a, 'no', '26º', 'ano', 'do', 'reinado', 'de', 'Asa']);
  },
);
