import { graphit } from '../Graphit';
import { graphit2 } from '../Graphit2';

const versículo =
  'No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos.';
const [, _1Rs15_33] = graphit.inserirAresta(['1 Rs 15.33', versículo, 'Texto', 'Referência']);

graphit.iniciarMemória();

const [, Asa, , reiDe, rei] = graphit.inserirAresta(['Asa', 'Judá', 'Rei de', 'Rei']);
const [, Baasa] = graphit.inserirAresta(['Baasa', 'Aías', 'Filho de', 'Pai de']);

const [reinadoBaasa] = graphit.inserirAresta([Baasa, 'Israel', reiDe, rei]);
{
  const [, , terceiroAnoAsa] = graphit.inserirAresta([reinadoBaasa, '3º ano do reinado de Asa', 'Início']);
  graphit.inserirAresta([terceiroAnoAsa, Asa]);

  graphit.inserirAresta([reinadoBaasa, 'Tirza', 'Reinou em']);
  graphit.inserirAresta([reinadoBaasa, '24 anos', 'Reinou durante']);
}

graphit.getMemória().forEach(([aresta]) => {
  graphit.inserirAresta([aresta, _1Rs15_33, 'Referência']);
});

console.log('Graphit 2 - Início >>>>>>>>>>>>>>>>>>>>>>>');

graphit2.aresta(['Asa', ', rei de', 'Judá']);
graphit2.aresta(['Baasa', ', filho de', 'Aías']);
graphit2.aresta(['Baasa', ', rei de', 'Israel']);
graphit2.aresta(['Baasa', 'reinou', '24 anos']);

const a = graphit2.aresta(['Baasa', 'tornou-se', 'rei', 'de todo o', 'Israel']);
graphit2.aresta([a, 'no terceiro ano do', 'reinado de', 'Asa']);
graphit2.aresta([a, 'em', 'Tirza']);

graphit2.salvar('Bíblia2.json');

const nó = graphit2.buscarNó('Baasa');
if (nó) console.log('descrição', graphit2.descrever(nó));

console.log('Graphit 2 - Fim >>>>>>>>>>>>>>>>>>>>>>>');
