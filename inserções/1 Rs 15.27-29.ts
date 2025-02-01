import { inserirVersículo } from '../Biblia';
import { aresta, tokens } from '../Graphit';

inserirVersículo(
  '1 Rs 15.27',
  'Baasa, filho de Aías, da tribo de Issacar, conspirou contra ele, e o matou na cidade filistéia de Gibetom, enquanto Nadabe e todo o exército de Israel a sitiavam.',
  () => {
    aresta('Baasa, filho de Aías');
    aresta('Baasa, da tribo de Issacar');
    aresta('Gibetom, uma cidade filistéia');
  },
);

inserirVersículo('1 Rs 15.28', 'Baasa matou Nadabe no terceiro ano do reinado de Asa, rei de Judá, e foi o seu sucessor.', () => {
  aresta([aresta('Baasa matou Nadabe'), ...tokens('no terceiro ano do reinado de Asa')]);
  aresta('Asa, rei de Judá');
  aresta('Baasa foi sucessor de Nadabe');
});

inserirVersículo(
  '1 Rs 15.29',
  'Assim que começou a reinar, matou toda a família de Jeroboão. Dos pertencentes a Jeroboão não deixou ninguém vivo, mas destruiu a todos, de acordo com a palavra do Senhor anunciada por seu servo, o silonita Aías.',
  () => {
    aresta([aresta('Baasa matou toda a família de Jeroboão'), ...tokens('assim que começou a reinar')]);
    aresta([
      aresta('Baasa não deixou ninguém vivo dos pertencentes a Jeroboão, mas destruiu a todos'),
      ...tokens('de acordo com a palavra do Senhor anunciada por Aías'),
    ]);

    aresta('Aías, o silonita');
  },
);
