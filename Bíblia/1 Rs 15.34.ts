import { aresta } from '../Graphit2';
import { bíblia } from './bíblia';

bíblia.inserirVersículo(
  '1 Rs 15.34',
  'Fez o que o Senhor reprova, andando nos caminhos de Jeroboão e nos pecados que ele tinha levado Israel a cometer.',
  () => {
    const a = aresta(['Baasa', 'fez', 'o que', 'o', 'Senhor', 'reprova']);
    aresta([a, 'andando', 'nos', 'caminhos', 'de', 'Jeroboão']);
    aresta([a, 'andando', 'nos', 'pecados', 'que', 'Jeroboão', 'tinha', 'levado', 'Israel', 'a', 'cometer']);
  },
);
