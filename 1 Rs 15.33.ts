import { Graphit } from "./Graphit";

export let graphit = new Graphit();

//Labels gerais
const ReferênciaPara = graphit.inserirNó("Referência para");
const Referência = graphit.inserirNó("Referência");
const citadoEm = graphit.inserirNó("Citado em");
const citadoPor = graphit.inserirNó("Citado por");

// Nós
const _1Rs15_33 = graphit.inserirNó("1Rs 15.33");
const texto = graphit.inserirNó(
  "No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos."
);

const TextoLabel = graphit.inserirNó("Texto");
const TextoDe = graphit.inserirNó("Texto de");
const terceiroAnoDoReinadoDeAsa = graphit.inserirNó("3º ano do reinado de Asa");
const Asa = graphit.inserirNó("Asa");
const reiDe = graphit.inserirNó("Rei de");
const reinadoPor = graphit.inserirNó("Reinado por");
const Judá = graphit.inserirNó("Judá");
export const Baasa = graphit.inserirNó("Baasa");
const filhoDe = graphit.inserirNó("Filho de");
const paiDe = graphit.inserirNó("Pai de");
const Aías = graphit.inserirNó("Aías");
const Israel = graphit.inserirNó("Israel");
const localDoReinado = graphit.inserirNó("Local do reinado");
const recebeuComoRei = graphit.inserirNó("Recebeu");
const Tirza = graphit.inserirNó("Tirza");
const duraçãoDe = graphit.inserirNó("Duração de");
const duração = graphit.inserirNó("Duração");
const anos24 = graphit.inserirNó("24 anos");
const inícioDoReinado = graphit.inserirNó("Início do reinado");
const inícioDe = graphit.inserirNó("Início de");

// Arestas
[
  graphit.inserirAresta(_1Rs15_33, TextoLabel, TextoDe, texto),
  graphit.inserirAresta(Asa, citadoEm, citadoPor, terceiroAnoDoReinadoDeAsa),
  graphit.inserirAresta(Asa, reiDe, reinadoPor, Judá),
  graphit.inserirAresta(Baasa, filhoDe, paiDe, Aías),
].forEach((aresta) =>
  graphit.inserirAresta(_1Rs15_33, ReferênciaPara, Referência, aresta)
);

const reinadoBaasa = graphit.inserirAresta(Baasa, reiDe, reinadoPor, Israel);
[
  graphit.inserirAresta(reinadoBaasa, localDoReinado, recebeuComoRei, Tirza),
  graphit.inserirAresta(reinadoBaasa, duração, duraçãoDe, anos24),
  graphit.inserirAresta(
    reinadoBaasa,
    inícioDoReinado,
    inícioDe,
    terceiroAnoDoReinadoDeAsa
  ),
].forEach((aresta) =>
  graphit.inserirAresta(_1Rs15_33, ReferênciaPara, Referência, aresta)
);
