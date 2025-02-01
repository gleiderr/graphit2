import { inserirVersículo } from '../Biblia';
import { aresta, graphit } from '../Graphit';

inserirVersículo(
  '1 Rs 15.33',
  'No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos.',
  () => {
    graphit.aresta('Asa, rei de Judá');
    graphit.aresta(['Baasa', ',', 'filho', 'de', 'Aías']);
    graphit.aresta(['Baasa', ',', 'rei', 'de', 'Israel']);

    const a = graphit.aresta('Baasa tornou-se rei de todo o Israel');
    graphit.aresta([a, 'no', 'terceiro', 'ano', 'do', 'reinado', 'de', 'Asa']);
    graphit.aresta([a, 'em', 'Tirza']);
    graphit.aresta([a, 'reinou', '24 anos']);
  },
);

inserirVersículo(
  '1 Rs 15.34',
  'Fez o que o Senhor reprova, andando nos caminhos de Jeroboão e nos pecados que ele tinha levado Israel a cometer.',
  () => {
    const a = aresta(['Baasa', 'fez', 'o que', 'o', 'Senhor', 'reprova']);
    aresta([a, 'andando', 'nos', 'caminhos', 'de', 'Jeroboão']);
    aresta([a, 'andando', 'nos', 'pecados', 'que', 'Jeroboão', 'tinha', 'levado', 'Israel', 'a', 'cometer']);
  },
);
