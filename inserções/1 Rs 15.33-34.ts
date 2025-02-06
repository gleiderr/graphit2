import { inserirVersículo } from '../Biblia';
import { expressão } from '../Graphit';

inserirVersículo('1 Rs 15.32', 'Houve guerra entre Asa e Baasa, rei de Israel, durante todo o reinado deles.', () => {
  expressão('Houve guerra entre Asa e Baasa durante todo o reinado deles');
  expressão('Baasa, rei de Israel');
});

inserirVersículo(
  '1 Rs 15.33',
  'No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos.',
  () => {
    expressão('Asa, rei de Judá');
    expressão(['Baasa', ',', 'filho', 'de', 'Aías']);
    expressão(['Baasa', ',', 'rei', 'de', 'Israel']);

    const a = expressão('Baasa tornou-se rei de todo o Israel');
    expressão([a, 'no', 'terceiro', 'ano', 'do', 'reinado', 'de', 'Asa']);
    expressão([a, 'em', 'Tirza']);
    expressão([a, 'reinou', '24 anos']);
  },
);

inserirVersículo(
  '1 Rs 15.34',
  'Fez o que o Senhor reprova, andando nos caminhos de Jeroboão e nos pecados que ele tinha levado Israel a cometer.',
  () => {
    const a = expressão(['Baasa', 'fez', 'o que', 'o', 'Senhor', 'reprova']);

    //TODO: Tornar essas expressões equivalentes para que somente uma delas seja impressa no markdown
    expressão([a, 'andando', 'nos', 'caminhos', 'de', 'Jeroboão']);
    expressão('Baasa andou nos caminhos de Jeroboão');

    expressão([a, 'andando', 'nos', 'pecados', 'que', 'Jeroboão', 'tinha', 'levado', 'Israel', 'a', 'cometer']);
  },
);
