import { graphit } from '../Graphit';
import { aresta } from '../Graphit2';
import { bíblia } from './bíblia';

const versículo = 'Houve guerra entre Asa e Baasa, rei de Israel, durante todo o reinado deles.';
const [, _1Rs15_16] = graphit.inserirAresta(['1 Rs 15.16', versículo, 'Texto', 'Referência']);
graphit.iniciarMemória();

const [a] = graphit.inserirAresta(['Baasa', 'Asa', 'Guerreou contra', 'Guerreou contra']);
const [, , v2] = graphit.inserirAresta([a, 'todo o reinado de Asa e Baasa', 'Durante']);
graphit.inserirAresta([v2, 'Asa']);
graphit.inserirAresta([v2, 'Baasa']);

graphit.inserirAresta(['Baasa', 'Israel', 'Rei de', 'Rei']);

graphit.getMemória().forEach(([aresta]) => {
  graphit.inserirAresta([aresta, _1Rs15_16, 'Referência']);
});

bíblia.inserirVersículo('1 Rs 15.16', versículo, () => {
  aresta(['Baasa', ', rei de', 'Israel']);
  aresta(['Houve', 'guerra', 'entre', 'Asa', 'e', 'Baasa', 'durante', 'todo', 'o', 'reinado', 'deles']);
});
