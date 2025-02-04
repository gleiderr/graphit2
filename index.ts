import { graphit } from './Graphit';
const agora: string = new Date().toLocaleString(); //
console.log(`----------------------------------${agora}`);
graphit.carregar('Bíblia anterior.json');

import { bíblia } from './Biblia';

import './inserções/1 Rs 14.6, 14.14';
import './inserções/1 Rs 15.16-22';
import './inserções/1 Rs 15.27-29';
import './inserções/1 Rs 15.33-34';
import './inserções/1 Rs 16.1-13';

bíblia.imprimirEstudos({
  foco: ['Baasa'],
  outros: ['Asa', 'Ben-Hadade', 'Elá', 'Tabriom', 'Geba', 'Gibetom', 'Aías'],
  pronto: [],
});

bíblia.imprimeNãoVisitados();

graphit.salvar('Bíblia.json');
