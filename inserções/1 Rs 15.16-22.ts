import { inserirVersículo } from '../Biblia';
import { aresta, graphit, Id, tokens } from '../Graphit';

inserirVersículo('1 Rs 15.16', 'Houve guerra entre Asa e Baasa, rei de Israel, durante todo o reinado deles.', () => {
  aresta('Baasa, rei de Israel');
  aresta('Houve guerra entre Asa e Baasa durante todo o reinado deles');
});

inserirVersículo(
  '1 Rs 15.17',
  'Baasa, rei de Israel, atacou Judá e fortificou Ramá para que ninguém pudesse entrar no território de Asa, rei de Judá, nem sair de lá.',
  () => {
    aresta(['Baasa', ',', 'rei', 'de', 'Israel']);
    aresta(['Baasa', 'atacou', 'Judá']);
    const f = aresta(['Baasa', 'fortificou', 'Ramá']);
    aresta([f, 'para que', 'ninguém', 'pudesse', 'entrar', 'no', 'território', 'de', 'Asa', 'ou', 'sair', 'de', 'lá']);
  },
);

let envio: { id: Id };
inserirVersículo(
  '1 Rs 15.18',
  'Então Asa ajuntou a prata e o ouro que haviam sobrado no tesouro do templo do Senhor e do seu próprio palácio. Confiou tudo isso a alguns dos seus oficiais e os enviou a Ben-Hadade, filho de Tabriom e neto de Heziom, rei da Síria, que governava em Damasco,',
  () => {
    const a = aresta('Asa ajuntou prata e ouro');
    aresta([a, ...tokens('que haviam sobrado do tesouro do templo do Senhor')]);
    graphit.aresta([a, 'do', 'próprio', 'palácio', 'de', 'Asa']);
    graphit.aresta([a, 'os', 'confiou', 'a', 'alguns', 'dos', 'seus', 'oficiais']);
    envio = graphit.aresta([a, 'e', 'os', 'enviou', 'a', 'Ben-Hadade']);

    graphit.aresta(['Ben-Hadade', 'filho', 'de', 'Tabriom']);
    graphit.aresta('Tabriom, filho de Heziom?');
    graphit.aresta(['Ben-Hadade', 'neto', 'de', 'Heziom']);
    graphit.aresta(['Ben-Hadade', 'rei', 'da', 'Síria']);
    graphit.aresta(['Ben-Hadade', 'governava', 'em', 'Damasco']);
  },
);

inserirVersículo(
  '1 Rs 15.19',
  'com uma mensagem que dizia: "Façamos um tratado, como fizeram meu pai e o teu. Estou te enviando como presente prata e ouro. Agora, rompe o tratado que tens com Baasa, rei de Israel, para que ele saia do meu país".',
  () => {
    aresta(['Baasa', ',', 'rei', 'de', 'Israel']);

    const a = aresta([envio, ...tokens('com uma mensagem que dizia')]);

    aresta([
      ...[a, '"', 'Façamos', 'um', 'tratado'],
      ...['.', '"', 'Agora', ',', 'rompe', 'o', 'tratado', 'que', 'tens', 'com', 'Baasa'],
      ...['para', 'que', 'ele', 'saia', 'de', 'Judá', '.', '"'],
    ]);

    // TODO: Qualificar o pai de Asa
    aresta([a, ...tokens('o pai de Asa e o pai de Ben-Hadade fizeram um tratado')]);
  },
);

inserirVersículo(
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

inserirVersículo('1 Rs 15.21', 'Quando Baasa soube disso, abandonou a construção dos muros de Ramá e foi para Tirza.', () => {
  const a = aresta('Baasa abandonou a construção dos muros de Ramá');
  aresta([a, 'quando', 'ele', 'soube', 'de', '1 Rs 15.20']);
  const b = aresta('Baasa foi para Tirza');
  aresta([b, 'quando', 'ele', 'soube', 'de', '1 Rs 15.20']);
});

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
