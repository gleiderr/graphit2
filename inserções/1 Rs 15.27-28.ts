import { bíblia, inserirVersículo } from '../Biblia';
import { aresta, tokens } from '../Graphit';

inserirVersículo(
  '1 Rs 15.27',
  'Baasa, filho de Aías, da tribo de Issacar, conspirou contra ele, e o matou na cidade filistéia de Gibetom, enquanto Nadabe e todo o exército de Israel a sitiavam.',
  () => {
    aresta('Baasa, filho de Aías');
    aresta('Baasa, da tribo de Issacar');
    aresta('Baasa conspirou contra Nadabe');
    aresta('Gibetom, uma cidade filistéia');

    aresta([aresta('Baasa matou Nadabe'), ...tokens('em Gibetom, enquanto Nadabe e todo o exécito de Israel a sitiavam')]);
  },
);

inserirVersículo('1 Rs 15.28', 'Baasa matou Nadabe no terceiro ano do reinado de Asa, rei de Judá, e foi o seu sucessor.', () => {
  aresta([aresta('Baasa matou Nadabe'), ...tokens('no terceiro ano do reinado de Asa')]);
  aresta('Asa, rei de Judá');
  aresta('Baasa foi sucessor de Nadabe');
});

bíblia.excluir('7w');
bíblia.excluir('81');
bíblia.excluir('80');
bíblia.excluir(aresta('Baasa conspirou contra Nadabe e o matou em Gibetom').id);
