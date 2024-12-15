import { Baasa, referência, texto } from './1 Rs 15.33';
import { graphit } from './Graphit';

const [, _1Rs15_33, , ,] = graphit.inserirAresta(
  '1 Rs 15.34',
  'Fez o que o Senhor reprova, andando nos caminhos de Jeroboão e nos pecados que ele tinha levado Israel a cometer.',
  texto,
  referência
);

graphit.iniciarMemória();

const [, , senhorReprova] = graphit.inserirAresta(Baasa, 'o que o Senhor reprova', 'Fez');
graphit.inserirAresta(senhorReprova, 'Senhor', 'Cita');

const [, , caminhosJeroboão, andou] = graphit.inserirAresta(Baasa, 'nos caminhos de Jeroboão', 'Andou');
graphit.inserirAresta(caminhosJeroboão, 'Jeroboão', 'Cita');

const [, , pecadosJeroboão] = graphit.inserirAresta(Baasa, 'nos pecados que ele tinha levado Israel a cometer', andou);
graphit.inserirAresta(pecadosJeroboão, 'Jeroboão', 'ele');
graphit.inserirAresta(pecadosJeroboão, 'Israel', 'Cita');

graphit.getMemória().forEach(([aresta]) => {
  graphit.inserirAresta(aresta, _1Rs15_33, referência);
});
