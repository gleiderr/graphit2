import { inserirVersículo } from '../../Biblia';
import { expressão, tokens } from '../../Graphit';

inserirVersículo(
  'Jr 41.9',
  'A cisterna na qual ele jogou os corpos dos homens que havia matado, juntamente com o de Gedalias, tinha sido cavada pelo rei Asa para defender-se de Baasa, rei de Israel. Ismael, filho de Netanias, encheu-a com os mortos.',
  () => {
    const a = expressão('O rei Asa cavou uma cisterna para defender-se de Baasa.');
    expressão([
      a,
      ...tokens('Nessa cisterna, Ismael jogou os corpos dos homens que havia matado, juntamente com o de Gedalias.'),
    ]);
    expressão([a, ...tokens('Ismael encheu-a com os mortos.')]);

    expressão('Ismael, filho de Netanias');
    expressão('Baasa, rei de Israel');
  },
);
