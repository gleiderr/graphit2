const agora: string = new Date().toLocaleString(); //
console.log(`----------------------------------${agora}`);

import { Baasa, referência, texto } from './1 Rs 15.33';
import './1 Rs 15.34';
import { graphit } from './Graphit';
import { Markdown } from './Markdown';

graphit.salvar('Bíblia.json');

const markdown = new Markdown(graphit, referência.id, texto.id);

markdown.iniciarVisitação();
markdown.imprimir(Baasa.id);
console.log();

console.log('Não visitados', markdown.getNãoVisitados().size);
