import { inserirVersículo } from '../Biblia';
import { graphit } from '../Graphit';

inserirVersículo(
  '1 Rs 15.33',
  'No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos.',
  () => {
    graphit.aresta(['Asa', ', rei de', 'Judá']);
    graphit.aresta(['Baasa', ',', 'filho', 'de', 'Aías']);
    graphit.aresta(['Baasa', ',', 'rei', 'de', 'Israel']);
    graphit.aresta(['Baasa', 'reinou', '24 anos']);

    const a = graphit.aresta('Baasa tornou-se rei de todo o Israel');
    graphit.aresta([a, 'no', 'terceiro', 'ano', 'do', 'reinado', 'de', 'Asa']);
    graphit.aresta([a, 'em', 'Tirza']);
  },
);
