import { Graphit } from "./Graphit";

let graphit = new Graphit();

const versículo = graphit.inserirNó(
  "No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos."
);
const Asa = graphit.inserirNó("Asa");
const Baasa = graphit.inserirNó("Baasa");
const Aías = graphit.inserirNó("Aías");
const Judá = graphit.inserirNó("Judá");
const filhoDe = graphit.inserirNó("Filho de");
const reiDe = graphit.inserirNó("Rei de");
const Israel = graphit.inserirNó("Israel");
const Tirza = graphit.inserirNó("Tirza");

const coroadoEm = graphit.inserirNó("Coroado em");
const duraçãoDoReinado = graphit.inserirNó("Reinou durante");
const anos24 = graphit.inserirNó("24 anos");
const inicioDoReinado = graphit.inserirNó("Início do reinado");
const terceiroAnoDoReinadoDeAsa = graphit.inserirNó("3º ano do reinado de Asa");

const Cita = graphit.inserirNó("Cita");
graphit.inserirAresta(versículo, Cita, Asa);
graphit.inserirAresta(versículo, Cita, Baasa);
graphit.inserirAresta(versículo, Cita, Aías);
graphit.inserirAresta(versículo, Cita, Judá);
graphit.inserirAresta(versículo, Cita, filhoDe);
graphit.inserirAresta(versículo, Cita, reiDe);
graphit.inserirAresta(versículo, Cita, Israel);
graphit.inserirAresta(versículo, Cita, Tirza);
graphit.inserirAresta(versículo, Cita, coroadoEm);
graphit.inserirAresta(versículo, Cita, duraçãoDoReinado);
graphit.inserirAresta(versículo, Cita, anos24);
graphit.inserirAresta(versículo, Cita, inicioDoReinado);
graphit.inserirAresta(versículo, inicioDoReinado, terceiroAnoDoReinadoDeAsa);

graphit.inserirAresta(Asa, reiDe, Judá);
graphit.inserirAresta(Baasa, filhoDe, Aías);
const reinadoBaasa = graphit.inserirAresta(Baasa, reiDe, Israel);
graphit.inserirAresta(reinadoBaasa, inicioDoReinado, terceiroAnoDoReinadoDeAsa);
graphit.inserirAresta(reinadoBaasa, coroadoEm, Tirza);
graphit.inserirAresta(reinadoBaasa, duraçãoDoReinado, anos24);

console.log("----------------------------------");

graphit.marcaNãoVisitados();
graphit.imprimir(versículo);
graphit.imprimir(Baasa);
graphit.imprimirNãoVisitados();

graphit.salvar();
