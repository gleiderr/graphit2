import { inserirVersículo } from '../../Biblia';
import { expressão, Id, tokens } from '../../Graphit';

let palavraDoSenhor: { id: Id };
inserirVersículo(
  '1 Rs 21.17',
  'Então a palavra do Senhor veio ao tesbita Elias:',
  () => {
    palavraDoSenhor = expressão('Então a palavra do Senhor veio a Elias:');

    expressão('Elias, tesbita');
  },
);

inserirVersículo(
  '1 Rs 21.18',
  '"Vá encontrar-se com Acabe, o rei de Israel, que reina em Samaria. Agora ele está na vinha de Nabote para tomar posse dela.',
  () => {
    expressão([palavraDoSenhor, ...tokens('"Vá encontrar-se com Acabe"')]);
    expressão([
      palavraDoSenhor,
      ...tokens('"Agora Acabe está na vinha de Nabote para tomar posse dela"'),
    ]);

    expressão('Acabe, o rei de Israel');
    expressão('Acabe, que reina em Samaria');
  },
);

inserirVersículo(
  '1 Rs 21.19',
  'Diga-lhe: Assim diz o Senhor: Você assassinou um homem e ainda se apossou de sua propriedade? E acrescentou: Assim diz o Senhor: No local onde os cães lamberam o sangue de Nabote, lamberão também o seu sangue; isso mesmo, o seu sangue! "',
  () => {
    const b = expressão([
      palavraDoSenhor,
      ...tokens('"Diga-lhe: Assim diz o Senhor:"'),
    ]);
    expressão([
      b,
      ...tokens(
        '"Você assassinou um homem e ainda se apossou de sua propriedade?"',
      ),
    ]);

    const c = expressão('E ainda acrescentou:');

    expressão([
      c,
      ...tokens(
        '"No local onde os cães lamberam o sangue de Nabote, lamberão também o seu sangue, Acabe; isso mesmo, o seu sangue!"',
      ),
    ]);
  },
);

let respostaElias: { id: Id };
inserirVersículo(
  '1 Rs 21.20',
  'Acabe disse a Elias: "Então você me encontrou, meu inimigo! " "Eu o encontrei", ele respondeu, "porque você se vendeu para fazer o que o Senhor reprova.',
  () => {
    const b = expressão('Acabe disse a Elias:');

    expressão([b, ...tokens('"Então você me encontrou, meu inimigo!"')]);

    respostaElias = expressão('Elias respondeu \\[a Acabe]:');
    expressão([
      respostaElias,
      ...tokens(
        '"Eu o encontrei porque você, Acabe, se vendeu para fazer o que o Senhor reprova."',
      ),
    ]);
  },
);

inserirVersículo(
  '1 Rs 21.21',
  'Vou trazer desgraça sobre você. Devorarei os seus descendentes e eliminarei da sua família todos os do sexo masculino em Israel, sejam escravos ou livres.',
  () => {
    expressão([respostaElias, ...tokens('"Vou trazer desgraça sobre você."')]);
    expressão([
      respostaElias,
      ...tokens(
        '"Devorarei os seus descendentes e eliminarei da sua família todos os do sexo masculino em Israel, sejam escravos ou livres."',
      ),
    ]);
  },
);

inserirVersículo(
  '1 Rs 21.22',
  'Farei à sua família o que fiz à de Jeroboão, filho de Nebate, e à de Baasa, filho de Aías, pois você provocou a minha ira e fez Israel pecar.',
  () => {
    expressão([
      respostaElias,
      ...tokens(
        '"Farei à sua família o que fiz à de Jeroboão e à de Baasa, pois você provocou a minha ira e fez Israel pecar."',
      ),
    ]);

    expressão('Jeroboão, filho de Nebate');
    expressão('Baasa, filho de Aías');
  },
);

//TODO: encontrar as aspas no texto bíblico
