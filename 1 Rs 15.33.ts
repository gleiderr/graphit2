import { Graphit } from './Graphit';

export let graphit = new Graphit();

// Arestas
const [, _1Rs15_33] = graphit.inserirAresta(
  '1Rs 15.33',
  'Texto',
  'Referência',
  'No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos.'
);

// TODO: Arestas abaixo devem ter como referência _1Rs15_33
const [, Asa, reiDe, rei] = graphit.inserirAresta('Asa', 'Rei de', 'Rei', 'Judá');
const [, Baasa, filhoDe, paiDe] = graphit.inserirAresta('Baasa', 'Filho de', 'Pai de', 'Aías');

const [reinadoBaasa] = graphit.inserirAresta(Baasa, reiDe, rei, 'Israel');

const [, , , , terceiroAnoDoReinadoDeAsa] = graphit.inserirAresta(reinadoBaasa, 'Início', '?', '3º ano do reinado de Asa');
graphit.inserirAresta(reinadoBaasa, 'Tornou-se rei em', '?', 'Tirza');
graphit.inserirAresta(reinadoBaasa, 'Reinou', '?', '24 anos');
graphit.inserirAresta(Asa, 'Citado em', 'Citado por', terceiroAnoDoReinadoDeAsa);

export { Baasa, filhoDe, paiDe };
