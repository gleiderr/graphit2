import { graphit } from '../Graphit';
import { referência, texto } from './1 Rs 15.33';

const versículo =
  'No vigésimo sexto ano do reinado de Asa, rei de Judá, Elá, filho de Baasa, tornou-se rei de Israel, e reinou dois anos em Tirza.';
const [, _1Rs16_8, , ,] = graphit.inserirAresta(['1 Rs 16.8', versículo, texto, referência]);

graphit.iniciarMemória();

graphit.inserirAresta(['Asa', 'Judá', 'Rei de'], { reuseV1: true, reuseV2: true, reuseL1: true, reuseAresta: true });

graphit.inserirAresta(['Elá', 'Baasa', 'Filho de', 'Pai de'], { reuseV2: true, reuseL1: true, reuseL2: true });

const [a2] = graphit.inserirAresta(['Elá', 'Israel', 'Rei de'], { reuseV1: true, reuseV2: true, reuseL1: true, reuseL2: true });
const [, _26anoAsa] = graphit.inserirAresta([a2, '26º ano do reinado de Asa', 'no']);
graphit.inserirAresta([_26anoAsa, 'Asa', 'Cita'], { reuseV2: true, reuseL1: true });

const [a1] = graphit.inserirAresta(['Elá', 'Tirza', 'reinou em'], { reuseV1: true, reuseV2: true });
graphit.inserirAresta([a1, '2 anos', 'Reinou', 'Duração do reinado'], { reuseL1: true });

graphit.getMemória().forEach(([aresta]) => {
  graphit.inserirAresta([aresta, _1Rs16_8, referência]);
});
