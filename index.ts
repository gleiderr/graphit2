import { graphit } from './Graphit';
const agora: string = new Date().toLocaleString(); //
console.log(`----------------------------------${agora}`);
graphit.carregar('Bíblia anterior.json');

import { bíblia } from './Biblia';
import './inserções/1 Rs 15.16';
import './inserções/1 Rs 15.17';
import './inserções/1 Rs 15.18-19';
import './inserções/1 Rs 15.20-21';
import './inserções/1 Rs 15.22';
import './inserções/1 Rs 15.27-28';
import './inserções/1 Rs 15.33';
import './inserções/1 Rs 15.34';
import './inserções/1 Rs 16.8';

bíblia.imprimirEstudos({
  foco: ['Baasa'],
  outros: ['Asa', 'Ben-Hadade', 'Elá', 'Tabriom', 'Geba', 'Gibetom', 'Aías'],
  pronto: [],
});

bíblia.imprimeNãoVisitados();

graphit.salvar('Bíblia.json');
