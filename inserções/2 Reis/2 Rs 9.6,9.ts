import { inserirVersículo } from '../../Biblia';
import { expressão, Id, tokens } from '../../Graphit';

let declaração: { id: Id };

inserirVersículo(
  '2 Rs 9.6',
  'Jeú levantou-se e entrou na casa. Então o jovem profeta derramou o óleo na cabeça de Jeú e declarou-lhe: "Assim diz o Senhor, o Deus de Israel: "Eu o estou ungindo rei de Israel, o povo do Senhor.""',
  () => {
    expressão('Jeú levantou-se e entrou na casa');
    expressão('O jovem profeta derramou o óleo na cabeça de Jeú');
    declaração = expressão('O jovem profeta declarou a Jeú: "Assim diz o Senhor:"');

    expressão([declaração, ...tokens('"Eu o estou ungindo rei de Israel"')]);

    expressão('Senhor, o Deus de Israel');
    expressão('Israel, o povo do Senhor');
  },
);

inserirVersículo(
  '2 Rs 9.9',
  'Tratarei a família de Acabe como tratei a de Jeroboão, filho de Nebate, e a de Baasa, filho de Aías.',
  () => {
    expressão([declaração, ...tokens('"Tratarei a família de Acabe como tratei a de Jeroboão"')]);
    expressão([declaração, ...tokens('"Tratarei a família de Acabe como tratei a de Baasa"')]);

    expressão('Jeroboão, filho de Nebate');
    expressão('Baasa, filho de Aías');
  },
);
