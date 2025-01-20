import { aresta } from '../Graphit2';
import { bíblia } from './bíblia';

bíblia.inserirVersículo(
  '1 Rs 15.17',
  'Baasa, rei de Israel, atacou Judá e fortificou Ramá para que ninguém pudesse entrar no território de Asa, rei de Judá, nem sair de lá.',
  () => {
    aresta(['Baasa', ',', 'rei', 'de', 'Israel']);
    aresta(['Baasa', 'atacou', 'Judá']);
    const f = aresta(['Baasa', 'fortificou', 'Ramá']);
    aresta([f, 'para que', 'ninguém', 'pudesse', 'entrar', 'no', 'território', 'de', 'Asa', 'ou', 'sair', 'de', 'lá']);
  },
);
