const agora: string = new Date().toLocaleString(); //
console.log(`----------------------------------${agora}`);

import './Bíblia/1 Rs 15.16';
import './Bíblia/1 Rs 15.17';
import './Bíblia/1 Rs 15.18-19';
import './Bíblia/1 Rs 15.20-21';
import './Bíblia/1 Rs 15.33';
import './Bíblia/1 Rs 15.34';
import './Bíblia/1 Rs 16.8';
import { bíblia } from './Bíblia/bíblia';
import { graphit2 } from './Graphit2';

graphit2.salvar('Bíblia2.json');

const Baasa2 = graphit2.buscarNó('Baasa');
if (Baasa2) bíblia.imprimeEstudo(Baasa2, 'Baasa.md');

const Asa = graphit2.buscarNó('Asa');
if (Asa) bíblia.imprimeEstudo(Asa, 'Asa.md');

const BenHadade = graphit2.buscarNó('Ben-Hadade');
if (BenHadade) bíblia.imprimeEstudo(BenHadade, 'Ben-Hadade.md');

const Elá = graphit2.buscarNó('Elá');
if (Elá) bíblia.imprimeEstudo(Elá, 'Elá.md');

const Tabriom = graphit2.buscarNó('Tabriom');
if (Tabriom) bíblia.imprimeEstudo(Tabriom, 'Tabriom.md');

bíblia.imprimeNãoVisitados();
