import { inserirVersículo } from '../../Biblia';
import { expressão, Id, tokens } from '../../Graphit';

let a: { id: Id };
inserirVersículo(
  '1 Rs 16.1',
  'Então a palavra do Senhor contra Baasa veio a Jeú, filho de Hanani:',
  () => {
    a = expressão('Então a palavra do Senhor contra Baasa veio a Jeú:');
    expressão('Jeú, filho de Hanani');
  },
);

inserirVersículo(
  '1 Rs 16.2',
  '"Eu o levantei do pó e o tornei líder de Israel, meu povo, mas você andou nos caminhos de Jeroboão e fez o meu povo pecar e provocar a minha ira por causa dos pecados deles.',
  () => {
    expressão([
      a,
      ...tokens('"Eu o levantei do pó e o tornei líder de Israel"'),
    ]);
    expressão('Israel, povo do Senhor');

    expressão([a, ...tokens('"Baasa andou nos caminhos de Jeroboão"')]);
    expressão([a, ...tokens('"Baasa fez Israel pecar"')]);
    expressão([
      a,
      ...tokens(
        '"Baasa fez Israel provocar a ira do Senhor por causa dos pecados deles"',
      ),
    ]);
  },
);

inserirVersículo(
  '1 Rs 16.3',
  'Por isso estou na iminência de destruir Baasa e a sua família, fazendo a ela o que fiz à de Jeroboão, filho de Nebate.',
  () => {
    expressão([
      a,
      ...tokens(
        '"Por isso estou na iminência de destruir Baasa e a sua família, fazendo a ela o que fiz à de Jeroboão"',
      ),
    ]);
    expressão('Jeroboão, filho de Nebate');
  },
);

inserirVersículo(
  '1 Rs 16.4',
  'Cães comerão os da família de Baasa que morrerem na cidade, e as aves do céu se alimentarão dos que morrerem no campo"',
  () => {
    expressão([
      a,
      ...tokens('"Cães comerão os da família de Baasa que morrerem na cidade"'),
    ]);
    expressão([
      a,
      ...tokens('"As aves do céu se alimentarão dos que morrerem no campo"'),
    ]);
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
    const a = expressão(
      'A palavra do Senhor veio por meio do profeta Jeú a Baasa e sua família',
    );
    const b = expressão([
      a,
      ...tokens('por terem feito o que o Senhor reprova'),
    ]);
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

inserirVersículo(
  '1 Rs 16.9',
  'Zinri, um dos seus oficiais, que comandava metade dos seus carros de guerra, conspirou contra ele. Elá estava em Tirza naquela ocasião, embriagando-se na casa de Arsa, o encarregado do palácio de Tirza.',
  () => {
    expressão('Zinri conspirou contra Elá');

    expressão('Zinri, um dos oficiais de Elá');

    expressão('Zinri comandava metade dos carros de guerra de Elá');
    const a = expressão('Elá estava em Tirza');
    expressão([a, ...tokens('se embriagando na casa de Arsa')]);

    expressão('Arsa, o encarregado do palácio de Tirza');
  },
);

inserirVersículo(
  '1 Rs 16.10',
  'Zinri entrou e o feriu e o matou, no vigésimo sétimo ano do reinado de Asa, rei de Judá. E foi o seu sucessor.',
  () => {
    const a = expressão('Zinri entrou na casa de Arsa e feriu e matou Elá');
    expressão([a, ...tokens('no 27º ano do reinado de Asa')]);
    expressão('Asa, rei de Judá');

    expressão('Zinri foi sucessor de Elá');
  },
);

inserirVersículo(
  '1 Rs 16.11',
  'Assim que começou a reinar, logo que se assentou no trono, eliminou toda a família de Baasa. Não poupou uma só pessoa do sexo masculino, fosse parente ou amigo.',
  () => {
    const a = expressão('Zinri eliminou toda a família de Baasa');
    expressão([a, ...tokens('assim que começou a reinar')]);
    expressão([a, ...tokens('logo que se assentou no trono')]);
    expressão([
      a,
      ...tokens(
        '. Não poupou uma só pessoa do sexo masculino, fosse parente ou amigo de Baasa',
      ),
    ]);
  },
);

inserirVersículo(
  '1 Rs 16.12',
  'Assim Zinri destruiu toda a família de Baasa, de acordo com a palavra do Senhor falada contra Baasa pelo profeta Jeú,',
  () => {
    const a = expressão('Assim Zinri eliminou toda a família de Baasa');
    expressão([
      a,
      ...tokens(
        'de acordo com a palavra do Senhor falada contra Baasa pelo profeta Jeú',
      ),
    ]);
    expressão('Jeú, profeta');
  },
);

inserirVersículo(
  '1 Rs 16.13',
  'por causa de todos os pecados que Baasa e seu filho Elá haviam cometido e levado Israel a cometer, pois, com os seus ídolos inúteis, provocaram a ira do Senhor, o Deus de Israel.',
  () => {
    const a = expressão('Assim Zinri eliminou toda a família de Baasa');
    expressão([
      a,
      ...tokens(
        'por causa de todos os pecados que Baasa e Elá haviam cometido e levado Israel a cometer',
      ),
    ]);
    expressão([
      a,
      ...tokens('pois provocaram a ira do Senhor com os seus ídolos inúteis'),
    ]);

    expressão('Senhor, o Deus de Israel');
    expressão('Elá, filho de Baasa');
  },
);
