import { Baasa, graphit, referência } from './1 Rs 15.33';
import { Markdown } from './Markdown';

graphit.salvar('Bíblia.json');

const markdown = new Markdown(graphit, referência.id);

const agora: string = new Date().toLocaleString();
console.log(`----------------------------------${agora}`);

markdown.iniciarVisitação();
markdown.imprimir(Baasa.id);
console.log();

console.log('Não visitados', markdown.getNãoVisitados());

// while (true) {
//   const nãoVisitados = Array.from(getNãoVisitados());
//   if (nãoVisitados.length == 0) break;

//   const próximo = nãoVisitados[0];
//   if (graphit.getValor(próximo).tipo == 'nó') {
//     markdown.imprimir(próximo);
//     console.log();
//   } else {
//     markdown.visitados.add(próximo);
//   }
// }
