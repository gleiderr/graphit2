const agora: string = new Date().toLocaleString(); //
console.log(`----------------------------------${agora}`);

import { Baasa, referência, texto } from './Bíblia/1 Rs 15.33';
import './Bíblia/1 Rs 15.34';
import './Bíblia/1 Rs 16.8';
import { graphit } from './Graphit';
import { Markdown } from './Markdown';

graphit.reordenar(Baasa.id, 5, 1);

graphit.salvar('Bíblia.json');

const markdown = new Markdown(graphit, referência.id, texto.id);

markdown.iniciarVisitação();
markdown.imprimir(Baasa.id);
console.log();

console.log('Não visitados', markdown.getNãoVisitados().size);
