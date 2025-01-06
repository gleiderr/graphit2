import { Id } from '../Graphit';
import { aresta, graphit2 } from '../Graphit2';
import { bíblia } from './bíblia';

let envio: { id: Id };
bíblia.inserirVersículo(
  '1 Rs 15.18',
  'Então Asa ajuntou a prata e o ouro que haviam sobrado no tesouro do templo do Senhor e do seu próprio palácio. Confiou tudo isso a alguns dos seus oficiais e os enviou a Ben-Hadade, filho de Tabriom e neto de Heziom, rei da Síria, que governava em Damasco,',
  () => {
    const a = graphit2.aresta(['Asa', 'ajuntou', 'prata', 'e', 'ouro']);
    graphit2.aresta([a, 'que haviam sobrado do', 'tesouro', 'do', 'templo', 'do', 'Senhor']);
    graphit2.aresta([a, 'do', 'próprio', 'palácio', 'de', 'Asa']);
    graphit2.aresta([a, 'os', 'confiou', 'a alguns dos', 'seus', 'oficiais']);
    envio = graphit2.aresta([a, 'e', 'os', 'enviou', 'a', 'Ben-Hadade']);

    graphit2.aresta(['Ben-Hadade', 'filho de', 'Tabriom']);
    graphit2.aresta(['Tabriom', 'filho de', 'Heziom', '?']);
    graphit2.aresta(['Ben-Hadade', 'neto de', 'Heziom']);
    graphit2.aresta(['Ben-Hadade', 'rei da', 'Síria']);
    graphit2.aresta(['Ben-Hadade', 'governava em', 'Damasco']);
  },
);

bíblia.inserirVersículo(
  '1 Rs 15.19',
  'com uma mensagem que dizia: "Façamos um tratado, como fizeram meu pai e o teu. Estou te enviando como presente prata e ouro. Agora, rompe o tratado que tens com Baasa, rei de Israel, para que ele saia do meu país".',
  () => {
    const a = aresta([envio, 'com', 'uma', 'mensagem', 'que dizia']);

    aresta([a, 'façamos', 'um', 'tratado']);
    aresta([a, 'o', 'pai de', 'Asa', 'e', 'Ben-Hadade', 'fizeram um', 'tratado']);
    aresta([a, 'que', 'Baasa', 'e', 'Ben-Hadade', 'tinham um', 'tratado']);
  },
);
