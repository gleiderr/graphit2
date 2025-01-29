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

bíblia.excluir('6a');
bíblia.excluir('55');
bíblia.excluir('54');

const Baasa = graphit.buscarNó('Baasa');
if (Baasa) {
  bíblia.imprimeEstudo(Baasa, 'Baasa.md', 'foco');
}

const Asa = graphit.buscarNó('Asa');
if (Asa) {
  graphit.moverAresta(Asa, 11, 0);
  bíblia.imprimeEstudo(Asa, 'Asa.md', 'outros');
}

const BenHadade = graphit.buscarNó('Ben-Hadade');
if (BenHadade) bíblia.imprimeEstudo(BenHadade, 'Ben-Hadade.md', 'outros');

const Elá = graphit.buscarNó('Elá');
if (Elá) bíblia.imprimeEstudo(Elá, 'Elá.md', 'outros');

const Tabriom = graphit.buscarNó('Tabriom');
if (Tabriom) bíblia.imprimeEstudo(Tabriom, 'Tabriom.md', 'outros');

const Geba = graphit.buscarNó('Geba');
if (Geba) {
  bíblia.imprimeEstudo(Geba, 'Geba.md', 'outros');
}

const Gibetom = graphit.buscarNó('Gibetom');
if (Gibetom) bíblia.imprimeEstudo(Gibetom, 'Gibetom.md', 'outros');

bíblia.imprimeNãoVisitados();

graphit.salvar('Bíblia.json');
