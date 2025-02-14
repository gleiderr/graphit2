import { inserirVersículo } from '../Biblia';
import { expressão, Id, tokens } from '../Graphit';

let a: { id: Id };
inserirVersículo('1 Rs 16.1', 'Então a palavra do Senhor contra Baasa veio a Jeú, filho de Hanani:', () => {
  a = expressão('Então a palavra do Senhor contra Baasa veio a Jeú:');
  expressão('Jeú, filho de Hanani');
});

inserirVersículo(
  '1 Rs 16.2',
  '"Eu o levantei do pó e o tornei líder de Israel, meu povo, mas você andou nos caminhos de Jeroboão e fez o meu povo pecar e provocar a minha ira por causa dos pecados deles.',
  () => {
    expressão([a, ...tokens('"Eu o levantei do pó e o tornei líder de Israel"')]);
    expressão('Israel, povo do Senhor');

    expressão([a, ...tokens('"Baasa andou nos caminhos de Jeroboão"')]);
    expressão([a, ...tokens('"Baasa fez Israel pecar"')]);
    expressão([a, ...tokens('"Baasa fez Israel provocar a ira do Senhor por causa dos pecados deles"')]);
  },
);

inserirVersículo(
  '1 Rs 16.3',
  'Por isso estou na iminência de destruir Baasa e a sua família, fazendo a ela o que fiz à de Jeroboão, filho de Nebate.',
  () => {
    expressão([
      a,
      ...tokens('"Por isso estou na iminência de destruir Baasa e a sua família, fazendo a ela o que fiz à de Jeroboão"'),
    ]);
    expressão('Jeroboão, filho de Nebate');
  },
);

inserirVersículo(
  '1 Rs 16.4',
  'Cães comerão os da família de Baasa que morrerem na cidade, e as aves do céu se alimentarão dos que morrerem no campo"',
  () => {
    expressão([a, ...tokens('"Cães comerão os da família de Baasa que morrerem na cidade"')]);
    expressão([a, ...tokens('"As aves do céu se alimentarão dos que morrerem no campo"')]);
  },
);

inserirVersículo(
  '1 Rs 16.5',
  'Os demais acontecimentos do reinado de Baasa, o que fez e as suas realizações, estão escritos nos registros históricos dos reis de Israel.',
  () => {
    expressão(
      'Os demais acontecimentos do reinado de Baasa, o que fez e as suas realizações, estão escritos nos registros históricos dos reis de Israel.',
    );
  },
);

inserirVersículo(
  '1 Rs 16.6',
  ' Baasa descansou com os seus antepassados e foi sepultado em Tirza. E seu filho Elá foi o seu sucessor.',
  () => {
    expressão('Baasa descansou com os seus antepassados');
    expressão('Baasa foi sepultado em Tirza');
    expressão('Elá foi sucessor de Baasa');
    expressão('Elá, filho de Baasa');
  },
);

inserirVersículo(
  '1 Rs 16.7',
  'A palavra do Senhor veio por meio do profeta Jeú, filho de Hanani, a Baasa e sua família, por terem feito o que o Senhor reprova, provocando a sua ira, tornando-se como a família de Jeroboão — e também porque Baasa destruiu a família de Jeroboão.',
  () => {
    const a = expressão('A palavra do Senhor veio por meio do profeta Jeú a Baasa e sua família');
    const b = expressão([a, ...tokens('por terem feito o que o Senhor reprova')]);
    expressão([b, ...tokens('provocando a ira do Senhor')]);
    expressão([b, ...tokens('tornando-se como a família de Jeroboão')]);
    expressão([a, ...tokens('porque Baasa destruiu a família de Jeroboão')]);

    expressão('Jeú, filho de Hanani');
  },
);

inserirVersículo(
  '1 Rs 16.8',
  'No vigésimo sexto ano do reinado de Asa, rei de Judá, Elá, filho de Baasa, tornou-se rei de Israel, e reinou dois anos em Tirza.',
  () => {
    expressão('Asa, rei de Judá');
    expressão('Elá, filho de Baasa');
    expressão('Elá, rei de Israel');

    const b = expressão('Elá reinou 2 anos');
    expressão([b, ...tokens('em Tirza')]);

    const a = expressão('Elá tornou-se rei de Israel');
    expressão([a, ...tokens('no 26º ano do reinado de Asa')]);
  },
);
