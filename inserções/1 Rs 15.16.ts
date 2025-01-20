import { aresta } from '../Graphit';
import { bíblia } from './bíblia';

bíblia.inserirVersículo(
  '1 Rs 15.16',
  'Houve guerra entre Asa e Baasa, rei de Israel, durante todo o reinado deles.',
  () => {
    aresta('Baasa, rei de Israel');
    aresta([
      'Houve',
      'guerra',
      'entre',
      'Asa',
      'e',
      'Baasa',
      'durante',
      'todo',
      'o',
      'reinado',
      'deles',
    ]);
  },
);
