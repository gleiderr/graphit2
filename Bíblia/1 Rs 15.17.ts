import { graphit } from '../Graphit';
import { aresta } from '../Graphit2';
import { bíblia } from './bíblia';

bíblia.inserirVersículo(
  '1 Rs 15.17',
  'Baasa, rei de Israel, atacou Judá e fortificou Ramá para que ninguém pudesse entrar no território de Asa, rei de Judá, nem sair de lá.',
  () => {
    graphit.inserirAresta(['Baasa', 'Israel', 'Rei de']);
    graphit.inserirAresta(['Baasa', 'Judá', 'Atacou']);
    const [a] = graphit.inserirAresta(['Baasa', 'Ramá', 'Fortificou']);
    graphit.inserirAresta([a, 'território de Asa', 'Para que ninguém pudesse entrar no']);
    graphit.inserirAresta([a, 'território de Asa', 'Para que ninguém pudesse sair do']);
    graphit.inserirAresta(['território de Asa', 'Asa']);

    // TODO: Corrigir Graphit para que não seja obrigatório informar a segunda aresta
    graphit.inserirAresta(['Asa', 'Judá', 'Rei de', 'Rei']);

    aresta(['Baasa', ',', 'rei', 'de', 'Israel']);
    aresta(['Baasa', 'atacou', 'Judá']);
    const f = aresta(['Baasa', 'fortificou', 'Ramá']);
    aresta([f, 'para que', 'ninguém', 'pudesse', 'entrar', 'no', 'território', 'de', 'Asa', 'ou', 'sair', 'de', 'lá']);
  },
);
