import { graphit } from '../Graphit';

const versículo =
  'No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos.';
const [, _1Rs15_33, , texto, referência] = graphit.inserirAresta(['1 Rs 15.33', versículo, 'Texto', 'Referência']);

graphit.iniciarMemória();

const [, Asa, , reiDe, rei] = graphit.inserirAresta(['Asa', 'Judá', 'Rei de', 'Rei']);
const [, Baasa] = graphit.inserirAresta(['Baasa', 'Aías', 'Filho de', 'Pai de']);

const [reinadoBaasa] = graphit.inserirAresta([Baasa, 'Israel', reiDe, rei]);
{
  const [, , terceiroAnoAsa] = graphit.inserirAresta([reinadoBaasa, '3º ano do reinado de Asa', 'Início']);
  graphit.inserirAresta([terceiroAnoAsa, Asa, 'Cita']);

  graphit.inserirAresta([reinadoBaasa, 'Tirza', 'Tornou-se rei em']);
  graphit.inserirAresta([reinadoBaasa, '24 anos', 'Reinou']);
}

graphit.getMemória().forEach(([aresta]) => {
  graphit.inserirAresta([aresta, _1Rs15_33, referência]);
});

export { Asa, Baasa, referência, texto };
