import { aresta } from '../Graphit2';
import { bíblia } from './bíblia';

bíblia.inserirVersículo(
  '1 Rs 15.20',
  'Ben-Hadade aceitou a proposta do rei Asa e ordenou aos comandantes das suas forças que atacassem as cidades de Israel. Ele conquistou Ijom, Dã, Abel-Bete-Maaca e todo o Quinerete, além de Naftali.',
  () => {
    aresta(['Ben-Hadade', 'aceitou', 'a', 'proposta', 'de', 'Asa']);
    aresta('Ben-Hadade ordenou aos comandantes das suas forças que atacassem as cidades de Israel');
    aresta('Ben-Hadade conquistou Ijom');
    aresta('Ben-Hadade conquistou Dã');
    aresta('Ben-Hadade conquistou Abel-Bete-Maaca');
    aresta('Ben-Hadade conquistou todo o Quinerete');
    aresta('Ben-Hadade conquistou Naftali');
  },
);

bíblia.inserirVersículo(
  '1 Rs 15.21',
  'Quando Baasa soube disso, abandonou a construção dos muros de Ramá e foi para Tirza.',
  () => {
    const a = aresta('Baasa abandonou a construção dos muros de Ramá');
    aresta([a, 'quando', 'ele', 'soube', 'de', '1 Rs 15.20']);
    const b = aresta('Baasa foi para Tirza');
    aresta([b, 'quando', 'ele', 'soube', 'de', '1 Rs 15.20']);
  },
);
