const agora: string = new Date().toLocaleString(); //
console.log(`----------------------------------${agora}`);

import './Bíblia/1 Rs 15.16';
import './Bíblia/1 Rs 15.33';
import './Bíblia/1 Rs 15.34';
import './Bíblia/1 Rs 16.8';
import { graphit } from './Graphit';
import { Markdown } from './Markdown';

const Baasa = graphit.buscarNó('Baasa')[0];
const referência = graphit.buscarNó('Referência')[0];
const texto = graphit.buscarNó('Texto')[0];

graphit.salvar('Bíblia.json');

const markdown = new Markdown(graphit, referência.id, texto.id);

markdown.iniciarVisitação();
markdown.imprimir(Baasa.id);
console.log();

console.log('Não visitados', markdown.getNãoVisitados().size);
