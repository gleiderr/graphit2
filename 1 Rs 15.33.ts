import { Graphit } from './Graphit';

export let graphit = new Graphit();

// Arestas
const [, _1Rs15_33, , , referência] = graphit.inserirAresta(
  '1 Rs 15.33',
  'No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos.',
  'Texto',
  'Referência'
);

// TODO: Arestas abaixo devem ter como referência _1Rs15_33
const [, Asa, , reiDe, rei] = graphit.inserirAresta('Asa', 'Judá', 'Rei de', 'Rei');
const [filiaçãoBaasa, Baasa, , filhoDe, paiDe] = graphit.inserirAresta('Baasa', 'Aías', 'Filho de', 'Pai de');
graphit.inserirAresta(filiaçãoBaasa, _1Rs15_33, referência);

const [reinadoBaasa] = graphit.inserirAresta(Baasa, 'Israel', reiDe, rei);
graphit.inserirAresta(reinadoBaasa, _1Rs15_33, referência);

const [terceiroAnoDeAsa] = graphit.inserirAresta(reinadoBaasa, '3º ano do reinado de Asa', 'Início');
const [aresta1] = graphit.inserirAresta(reinadoBaasa, 'Tirza', 'Tornou-se rei em');
const [aresta2] = graphit.inserirAresta(reinadoBaasa, '24 anos', 'Reinou');
const [aresta3] = graphit.inserirAresta(Asa, terceiroAnoDeAsa, 'Citado em', 'Citado por');

graphit.inserirAresta(terceiroAnoDeAsa, _1Rs15_33, referência);
graphit.inserirAresta(aresta1, _1Rs15_33, referência);
graphit.inserirAresta(aresta2, _1Rs15_33, referência);
graphit.inserirAresta(aresta3, _1Rs15_33, referência);

export { Baasa, filhoDe, paiDe };
