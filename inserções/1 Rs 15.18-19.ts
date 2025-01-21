import { inserirVersículo } from '../Biblia';
import { aresta, graphit, Id, tokens } from '../Graphit';

let envio: { id: Id };
inserirVersículo(
  '1 Rs 15.18',
  'Então Asa ajuntou a prata e o ouro que haviam sobrado no tesouro do templo do Senhor e do seu próprio palácio. Confiou tudo isso a alguns dos seus oficiais e os enviou a Ben-Hadade, filho de Tabriom e neto de Heziom, rei da Síria, que governava em Damasco,',
  () => {
    const a = aresta('Asa ajuntou prata e ouro');
    aresta([a, ...tokens('que haviam sobrado do tesouro do templo do Senhor')]);
    graphit.aresta([a, 'do', 'próprio', 'palácio', 'de', 'Asa']);
    graphit.aresta([
      a,
      'os',
      'confiou',
      'a',
      'alguns',
      'dos',
      'seus',
      'oficiais',
    ]);
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
      ...[
        '.',
        '"',
        'Agora',
        ',',
        'rompe',
        'o',
        'tratado',
        'que',
        'tens',
        'com',
        'Baasa',
      ],
      ...['para', 'que', 'ele', 'saia', 'de', 'Judá', '.', '"'],
    ]);

    // TODO: Qualificar o pai de Asa
    aresta([
      a,
      ...tokens('o pai de Asa e o pai de Ben-Hadade fizeram um tratado'),
    ]);
  },
);
