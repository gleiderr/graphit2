import { Graphit } from "./Graphit";

let graphit = new Graphit();
// console.log(graphit.listarNós());
// console.log(graphit.listarArestas());

const versículo = graphit.inserirNó(
  "No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos."
);
const Asa = graphit.inserirNó("Asa");
const Baasa = graphit.inserirNó("Baasa");
const Aías = graphit.inserirNó("Aías");
const Judá = graphit.inserirNó("Judá");
const filhoDe = graphit.inserirNó("filho de");
const reiDe = graphit.inserirNó("Rei de");
const Israel = graphit.inserirNó("Israel");
const Tirza = graphit.inserirNó("Tirza");
const coroadoEm = graphit.inserirNó("coroado em");
const durante = graphit.inserirNó("durante");
const anos24 = graphit.inserirNó("24 anos");
const inicio = graphit.inserirNó("início");
const terceiroAnoDoReinadoDeAsa = graphit.inserirNó("3º ano do reinado de Asa");

graphit.inserirAresta(Asa, reiDe, Judá);
graphit.inserirAresta(Baasa, filhoDe, Aías);
const reinadoBaasa = graphit.inserirAresta(Baasa, reiDe, Israel);
graphit.inserirAresta(reinadoBaasa, coroadoEm, Tirza);
graphit.inserirAresta(reinadoBaasa, durante, anos24);
graphit.inserirAresta(reinadoBaasa, inicio, terceiroAnoDoReinadoDeAsa);

graphit.imprimir(Asa);

graphit.salvar();
// console.log(graphit.listarNós());
// //graphit.inserirAresta("1", "2", "teste");
// console.log(graphit.listarArestas());
