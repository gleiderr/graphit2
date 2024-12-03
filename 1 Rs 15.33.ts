import { Graphit } from './Graphit';

export let graphit = new Graphit();

// Arestas
const [, _1Rs15_33, , ,] = graphit.inserirAresta(
  '1Rs 15.33',
  'No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos.',
  'Texto',
  'Referência'
);

// TODO: Arestas abaixo devem ter como referência _1Rs15_33
const [, Asa, , reiDe, rei] = graphit.inserirAresta('Asa', 'Judá', 'Rei de', 'Rei');
const [, Baasa, , filhoDe, paiDe] = graphit.inserirAresta('Baasa', 'Aías', 'Filho de', 'Pai de');

const [reinadoBaasa] = graphit.inserirAresta(Baasa, 'Israel', reiDe, rei);

const [terceiroAnoDeAsa] = graphit.inserirAresta(reinadoBaasa, '3º ano do reinado de Asa', 'Início', '?');
graphit.inserirAresta(reinadoBaasa, 'Tirza', 'Tornou-se rei em', '?');
graphit.inserirAresta(reinadoBaasa, '24 anos', 'Reinou', '?');
graphit.inserirAresta(Asa, terceiroAnoDeAsa, 'Citado em', 'Citado por');

export { Baasa, filhoDe, paiDe };
