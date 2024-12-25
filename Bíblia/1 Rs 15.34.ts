import { graphit } from '../Graphit';
import { referência, texto } from './1 Rs 15.33';

const versículo =
  'Fez o que o Senhor reprova, andando nos caminhos de Jeroboão e nos pecados que ele tinha levado Israel a cometer.';

const [, _1Rs15_33, , ,] = graphit.inserirAresta(['1 Rs 15.34', versículo, texto, referência]);

graphit.iniciarMemória();

const [, , senhorReprova] = graphit.inserirAresta(['Baasa', 'o que o Senhor reprova', 'Fez'], { reuseV1: true });
graphit.inserirAresta([senhorReprova, 'Senhor'], { reuseL1: true });

const [, , caminhosJeroboão, andou] = graphit.inserirAresta(['Baasa', 'nos caminhos de Jeroboão', 'Andou'], { reuseV1: true });
graphit.inserirAresta([caminhosJeroboão, 'Jeroboão']);

const [, , pecadosJeroboão] = graphit.inserirAresta(['Baasa', 'nos pecados que ele tinha levado Israel a cometer', andou], {
  reuseV1: true,
});
graphit.inserirAresta([pecadosJeroboão, 'Jeroboão', 'ele'], { reuseV2: true });
graphit.inserirAresta([pecadosJeroboão, 'Israel'], { reuseV2: true });

graphit.getMemória().forEach(([aresta]) => {
  graphit.inserirAresta([aresta, _1Rs15_33, referência]);
});
