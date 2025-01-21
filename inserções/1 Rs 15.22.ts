import { inserirVersículo } from '../Biblia';
import { aresta, tokens } from '../Graphit';

inserirVersículo(
  '1 Rs 15.22',
  'Então o rei Asa reuniu todos homens de Judá — ninguém foi isentado — e eles retiraram de Ramá as pedras e a madeira que Baasa estivera usando. Com esse material Asa fortificou Geba, em Benjamim, e também Mispá.',
  () => {
    aresta([
      aresta('Asa reuniu todos homens de Judá - ninguém foi isentado'),
      ...tokens('e eles retiraram de Ramá as pedras e a madeira que Baasa estivera usando'),
    ]);
    aresta([aresta('Asa fortificou Geba e Mispá'), ...tokens('com as pedras e a madeira que Baasa estivera usando')]);

    aresta('Geba, em Benjamim');
  },
);
