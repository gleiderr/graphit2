import { graphit } from '../Graphit';
import { aresta } from '../Graphit2';
import { bíblia } from './bíblia';

const versículo =
  'Fez o que o Senhor reprova, andando nos caminhos de Jeroboão e nos pecados que ele tinha levado Israel a cometer.';

const [, _1Rs15_33] = graphit.inserirAresta(['1 Rs 15.34', versículo, 'Texto', 'Referência']);

graphit.iniciarMemória();

const [, , senhorReprova] = graphit.inserirAresta(['Baasa', 'o que o Senhor reprova', 'Fez']);
graphit.inserirAresta([senhorReprova, 'Senhor']);

const [, , caminhosJeroboão, andou] = graphit.inserirAresta(['Baasa', 'nos caminhos de Jeroboão', 'Andou']);
graphit.inserirAresta([caminhosJeroboão, 'Jeroboão']);

const [, , pecadosJeroboão] = graphit.inserirAresta(['Baasa', 'nos pecados que Jeroboão tinha levado Israel a cometer', andou]);
graphit.inserirAresta([pecadosJeroboão, 'Jeroboão']);
graphit.inserirAresta([pecadosJeroboão, 'Israel']);

graphit.getMemória().forEach(([aresta]) => {
  graphit.inserirAresta([aresta, _1Rs15_33, 'Referência']);
});

bíblia.inserirVersículo('1 Rs 15.34', versículo, () => {
  const a = aresta(['Baasa', 'fez', 'o que', 'o', 'Senhor', 'reprova']);
  aresta([a, 'andando', 'nos', 'caminhos', 'de', 'Jeroboão']);
  aresta([a, 'andando', 'nos', 'pecados', 'que', 'Jeroboão', 'tinha', 'levado', 'Israel', 'a', 'cometer']);
});
