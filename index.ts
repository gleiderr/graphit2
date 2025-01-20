const agora: string = new Date().toLocaleString(); //
console.log(`----------------------------------${agora}`);

import { graphit } from './Graphit';
import './inserções/1 Rs 15.16';
import './inserções/1 Rs 15.17';
import './inserções/1 Rs 15.18-19';
import './inserções/1 Rs 15.20-21';
import './inserções/1 Rs 15.33';
import './inserções/1 Rs 15.34';
import './inserções/1 Rs 16.8';
import { bíblia } from './inserções/bíblia';

graphit.salvar('Bíblia.json');

const Baasa2 = graphit.buscarNó('Baasa');
if (Baasa2) bíblia.imprimeEstudo(Baasa2, 'Baasa.md');

const Asa = graphit.buscarNó('Asa');
if (Asa) bíblia.imprimeEstudo(Asa, 'Asa.md');

const BenHadade = graphit.buscarNó('Ben-Hadade');
if (BenHadade) bíblia.imprimeEstudo(BenHadade, 'Ben-Hadade.md');

const Elá = graphit.buscarNó('Elá');
if (Elá) bíblia.imprimeEstudo(Elá, 'Elá.md');

const Tabriom = graphit.buscarNó('Tabriom');
if (Tabriom) bíblia.imprimeEstudo(Tabriom, 'Tabriom.md');

bíblia.imprimeNãoVisitados();
