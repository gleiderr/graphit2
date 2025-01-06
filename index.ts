const agora: string = new Date().toLocaleString(); //
console.log(`----------------------------------${agora}`);

import './Bíblia/1 Rs 15.16';
import './Bíblia/1 Rs 15.17';
import './Bíblia/1 Rs 15.18';
import './Bíblia/1 Rs 15.33';
import './Bíblia/1 Rs 15.34';
import './Bíblia/1 Rs 16.8';
import { graphit } from './Graphit';
import { graphit2 } from './Graphit2';
import { Markdown } from './Markdown';
import { markdown as markdown2 } from './Markdown2';

const Baasa = graphit.buscarNó('Baasa')[0];
const referência = graphit.buscarNó('Referência')[0];
const texto = graphit.buscarNó('Texto')[0];

graphit.salvar('Bíblia.json');

const markdown = new Markdown(graphit, referência.id, texto.id);

markdown.iniciarVisitação();
markdown.imprimir(Baasa.id);
console.log();

console.log('Não visitados', markdown.getNãoVisitados().size);

console.log('Graphit 2 - Início >>>>>>>>>>>>>>>>>>>>>>>');

graphit2.salvar('Bíblia2.json');

const Baasa2 = graphit2.buscarNó('Baasa');
if (Baasa2) {
  //console.log('descrição', graphit2.descrever(Baasa2).arestas[0].arestas[0]);
  const texto = markdown2.toMarkdown(graphit2.descrever(Baasa2));
  console.log(texto);
}

// const Asa = graphit2.buscarNó('Asa');
// if (Asa) {
//   const texto = markdown2.toMarkdown(graphit2.descrever(Asa));
//   console.log(texto);
// }

console.log('Graphit 2 - Fim >>>>>>>>>>>>>>>>>>>>>>>');
