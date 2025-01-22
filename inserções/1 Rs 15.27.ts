import { inserirVersículo } from '../Biblia';
import { aresta, tokens } from '../Graphit';

inserirVersículo(
  '1 Rs 15.27',
  'Baasa, filho de Aías, da tribo de Issacar, conspirou contra ele, e o matou na cidade filistéia de Gibetom, enquanto Nadabe e todo o exército de Israel a sitiavam.',
  () => {
    aresta('Baasa, filho de Aías');
    aresta('Baasa, da tribo de Issacar');
    aresta([
      aresta('Baasa conspirou contra Nadabe e o matou em Gibetom'),
      ...tokens('enquanto Nadabe e todo o exécito de Israel a sitiavam'),
    ]);
    aresta('Gibetom, uma cidade filistéia');
  },
);
