import { graphit } from '../Graphit';
import { aresta } from '../Graphit2';
import { bíblia } from './bíblia';

const versículo =
  'No vigésimo sexto ano do reinado de Asa, rei de Judá, Elá, filho de Baasa, tornou-se rei de Israel, e reinou dois anos em Tirza.';
const [, _1Rs16_8] = graphit.inserirAresta(['1 Rs 16.8', versículo, 'Texto', 'referência']);

graphit.iniciarMemória();

graphit.inserirAresta(['Asa', 'Judá', 'Rei de']);

graphit.inserirAresta(['Elá', 'Baasa', 'Filho de', 'Pai de']);

const [reinoElá] = graphit.inserirAresta(['Elá', 'Israel', 'Rei de']);
const [, , _26anoAsa] = graphit.inserirAresta([reinoElá, '26º ano do reinado de Asa', 'Início']);
graphit.inserirAresta([reinoElá, 'Tirza', 'Reinou em']);
graphit.inserirAresta([reinoElá, '2 anos', 'Reinou durante']);

graphit.inserirAresta([_26anoAsa, 'Asa']);

graphit.getMemória().forEach(([aresta]) => {
  graphit.inserirAresta([aresta, _1Rs16_8, 'Referência']);
});

bíblia.inserirVersículo('1 Rs 16.8', versículo, () => {
  aresta(['Asa', ', rei de', 'Judá']);
  aresta(['Elá', ', filho', 'de', 'Baasa']);
  aresta(['Elá', ', rei de', 'Israel']);

  const b = aresta(['Elá', 'reinou', '2 anos']);
  aresta([b, 'em', 'Tirza']);

  const a = aresta(['Elá', 'tornou-se', 'rei', 'de', 'Israel']);
  aresta([a, 'no', '26º', 'ano', 'do', 'reinado', 'de', 'Asa']);
});
