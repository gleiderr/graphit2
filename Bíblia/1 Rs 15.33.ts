import { graphit2 } from '../Graphit2';
import { bíblia } from './bíblia';

bíblia.inserirVersículo(
  '1 Rs 15.33',
  'No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos.',
  () => {
    graphit2.aresta(['Asa', ', rei de', 'Judá']);
    graphit2.aresta(['Baasa', ',', 'filho', 'de', 'Aías']);
    graphit2.aresta(['Baasa', ',', 'rei', 'de', 'Israel']);
    graphit2.aresta(['Baasa', 'reinou', '24 anos']);

    const a = graphit2.aresta('Baasa tornou-se rei de todo o Israel');
    graphit2.aresta([a, 'no', 'terceiro', 'ano', 'do', 'reinado', 'de', 'Asa']);
    graphit2.aresta([a, 'em', 'Tirza']);
  },
);
