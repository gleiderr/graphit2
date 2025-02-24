import { inserirVersículo } from '../../Biblia';
import { expressão, Id, tokens } from '../../Graphit';

inserirVersículo(
  '2 Cr.16.1',
  'No trigésimo sexto ano do reinado de Asa, Baasa, rei de Israel, invadiu Judá e fortificou Ramá, para que ninguém pudesse entrar nem sair do território de Asa, rei de Judá.',
  () => {
    const a = expressão('Baasa invadiu Judá');
    const b = expressão('Baasa fortificou Ramá');

    expressão([a, expressão('no 36º ano do reinado de Asa')]);
    expressão([b, expressão('no 36º ano do reinado de Asa')]);

    expressão([a, expressão('para que ninguém pudesse entrar nem sair do território de Asa')]);
    expressão([b, expressão('para que ninguém pudesse entrar nem sair do território de Asa')]);

    expressão('Baasa, rei de Israel');
    expressão('Asa, rei de Judá');
  },
);

let c: { id: Id };
inserirVersículo(
  '2 Cr.16.2',
  'Então Asa ajuntou a prata e o ouro do tesouro do templo do Senhor e do seu próprio palácio e os enviou a Ben-Hadade, rei da Síria, que governava em Damasco, com uma mensagem que dizia:',
  () => {
    const a = expressão('Asa ajuntou prata e ouro');
    expressão([a, ...tokens('do tesouro do templo do Senhor')]);
    expressão([a, ...tokens('do próprio palácio de Asa')]);
    const b = expressão([a, ...tokens('e os enviou a Ben-Hadade')]);
    c = expressão([b, ...tokens('com uma mensagem que dizia')]);

    expressão('Ben-Hadade, rei da Síria');
    expressão('Ben-Hadade, que governava em Damasco');
  },
);

inserirVersículo(
  '2 Cr.16.3',
  '"Façamos um tratado, como fizeram meu pai e o teu. Estou te enviando prata e ouro. Agora, rompe o tratado que tens com Baasa, rei de Israel, para que ele saia do meu país".',
  () => {
    expressão([c, ...tokens('"Façamos um tratado. "Agora, rompe o tratado que tens com Baasa para que ele saia de Judá."')]);
    expressão([c, ...tokens('o pai de Asa e o pai de Ben-Hadade fizeram um tratado')]); // TODO: Qualificar o pai de Asa
  },
);

inserirVersículo(
  '2 Cr.16.4',
  'Ben-Hadade aceitou a proposta do rei Asa e ordenou aos comandantes das suas forças que atacassem as cidades de Israel. Eles conquistaram Ijom, Dã, Abel-Maim e todas as cidades-armazéns de Naftali.',
  () => {
    expressão('Ben-Hadade aceitou a proposta de Asa');
    expressão('Ben-Hadade ordenou aos comandantes das suas forças que atacassem as cidades de Israel');

    expressão('Os comandantes das forças de Ben-Hadade conquistaram Ijom, Dã, Abel-Maim e todas as cidades-armazéns de Naftali');
  },
);

inserirVersículo('2 Cr.16.5', 'Quando Baasa soube disso, abandonou a construção dos muros de Ramá.', () => {
  const a = expressão('Baasa abandonou a construção dos muros de Ramá');
  expressão([a, ...tokens('quando soube de 2 Cr.16.4')]);
});

inserirVersículo(
  '2 Cr.16.6',
  'Então o rei Asa reuniu todos os homens de Judá, e eles retiraram de Ramá as pedras e a madeira que Baasa estivera usando. Com esse material Asa fortificou Geba e Mispá.',
  () => {
    expressão('Asa reuniu todos os homens de Judá, e eles retiraram de Ramá as pedras e a madeira que Baasa estivera usando');
    expressão('Com esse material Asa fortificou Geba e Mispá');
  },
);
