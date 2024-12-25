import { graphit } from '../Graphit';
import { referência, texto } from './1 Rs 15.33';

const versículo =
  'No vigésimo sexto ano do reinado de Asa, rei de Judá, Elá, filho de Baasa, tornou-se rei de Israel, e reinou dois anos em Tirza.';
const [, _1Rs16_8, , ,] = graphit.inserirAresta(['1 Rs 16.8', versículo, texto, referência]);

graphit.iniciarMemória();

graphit.inserirAresta(['Asa', 'Judá', 'Rei de'], { reuseV1: true, reuseV2: true, reuseL1: true, reuseAresta: true });

graphit.inserirAresta(['Elá', 'Baasa', 'Filho de', 'Pai de'], { reuseV2: true, reuseL1: true, reuseL2: true });

const [reinoElá] = graphit.inserirAresta(['Elá', 'Israel', 'Rei de'], {
  reuseV1: true,
  reuseV2: true,
  reuseL1: true,
  reuseL2: true,
});
const [, , _26anoAsa] = graphit.inserirAresta([reinoElá, '26º ano do reinado de Asa', 'Início'], { reuseL1: true });
graphit.inserirAresta([reinoElá, 'Tirza', 'Reinou em'], { reuseL1: true, reuseV2: true });
graphit.inserirAresta([reinoElá, '2 anos', 'Reinou durante'], { reuseV1: true, reuseL1: true });

graphit.inserirAresta([_26anoAsa, 'Asa'], { reuseV2: true });

graphit.getMemória().forEach(([aresta]) => {
  graphit.inserirAresta([aresta, _1Rs16_8, referência]);
});
