import { bíblia, outputDB } from './Biblia';
import { graphit } from './Graphit';
const agora: string = new Date().toLocaleString(); //
console.log(`----------------------------------${agora}`);

import './inserções/1 Reis/1 Rs 14.6, 14.14';
import './inserções/1 Reis/1 Rs 15.16-22';
import './inserções/1 Reis/1 Rs 15.27-29';
import './inserções/1 Reis/1 Rs 15.32-34';
import './inserções/1 Reis/1 Rs 16.1-13';
import './inserções/1 Reis/1 Rs 21.17-22';
import './inserções/2 Crônicas/2 Cr 16.1-6';
import './inserções/2 Reis/2 Rs 9.6,9';

bíblia.imprimirEstudos({
  foco: ['Baasa'],
  outros: [
    'Acabe',
    'Aías',
    'Asa',
    'Ben-Hadade',
    'Elá',
    'Elias',
    'Geba',
    'Gibetom',
    'Israel',
    'Jeroboão',
    'Jeú',
    'Tabriom',
    'Tirza',
  ],
  pronto: [],
});

bíblia.imprimeNãoVisitados();

graphit.salvar(outputDB);
