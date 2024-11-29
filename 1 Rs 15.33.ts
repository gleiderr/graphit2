import { Graphit } from "./Graphit";

export let graphit = new Graphit();

const _1Rs15_33 = graphit.inserirNó("1Rs 15.33");
const texto = graphit.inserirNó(
  "No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos."
);

const Asa = graphit.inserirNó("Asa");

export const Baasa = graphit.inserirNó("Baasa");
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
const Contém = graphit.inserirNó("Contém");

graphit.inserirAresta(_1Rs15_33, Contém, texto);
graphit.inserirAresta(_1Rs15_33, Contém, Asa);
graphit.inserirAresta(_1Rs15_33, Contém, Baasa);
graphit.inserirAresta(_1Rs15_33, Contém, Aías);
graphit.inserirAresta(_1Rs15_33, Contém, Judá);
graphit.inserirAresta(_1Rs15_33, Contém, filhoDe);
graphit.inserirAresta(_1Rs15_33, Contém, reiDe);
graphit.inserirAresta(_1Rs15_33, Contém, Israel);
graphit.inserirAresta(_1Rs15_33, Contém, Tirza);
graphit.inserirAresta(_1Rs15_33, Contém, coroadoEm);
graphit.inserirAresta(_1Rs15_33, Contém, duraçãoDoReinado);
graphit.inserirAresta(_1Rs15_33, Contém, anos24);
graphit.inserirAresta(_1Rs15_33, Contém, inicioDoReinado);
graphit.inserirAresta(texto, inicioDoReinado, terceiroAnoDoReinadoDeAsa);
graphit.inserirAresta(Asa, reiDe, Judá);
graphit.inserirAresta(Baasa, filhoDe, Aías);
const reinadoBaasa = graphit.inserirAresta(Baasa, reiDe, Israel);
graphit.inserirAresta(reinadoBaasa, inicioDoReinado, terceiroAnoDoReinadoDeAsa);
graphit.inserirAresta(reinadoBaasa, coroadoEm, Tirza);
graphit.inserirAresta(reinadoBaasa, duraçãoDoReinado, anos24);
