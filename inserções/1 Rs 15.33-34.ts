import { inserirVersículo } from '../Biblia';
import { aresta } from '../Graphit';

inserirVersículo('1 Rs 15.32', 'Houve guerra entre Asa e Baasa, rei de Israel, durante todo o reinado deles.', () => {
  aresta('Houve guerra entre Asa e Baasa durante todo o reinado deles');
  aresta('Baasa, rei de Israel');
});

inserirVersículo(
  '1 Rs 15.33',
  'No terceiro ano do reinado de Asa, rei de Judá, Baasa, filho de Aías, tornou-se rei de todo o Israel, em Tirza, e reinou vinte e quatro anos.',
  () => {
    aresta('Asa, rei de Judá');
    aresta(['Baasa', ',', 'filho', 'de', 'Aías']);
    aresta(['Baasa', ',', 'rei', 'de', 'Israel']);

    const a = aresta('Baasa tornou-se rei de todo o Israel');
    aresta([a, 'no', 'terceiro', 'ano', 'do', 'reinado', 'de', 'Asa']);
    aresta([a, 'em', 'Tirza']);
    aresta([a, 'reinou', '24 anos']);
  },
);

inserirVersículo(
  '1 Rs 15.34',
  'Fez o que o Senhor reprova, andando nos caminhos de Jeroboão e nos pecados que ele tinha levado Israel a cometer.',
  () => {
    const a = aresta(['Baasa', 'fez', 'o que', 'o', 'Senhor', 'reprova']);

    //TODO: Tornar essas expressões equivalentes para que somente uma delas seja impressa no markdown
    aresta([a, 'andando', 'nos', 'caminhos', 'de', 'Jeroboão']);
    aresta('Baasa andou nos caminhos de Jeroboão');

    aresta([a, 'andando', 'nos', 'pecados', 'que', 'Jeroboão', 'tinha', 'levado', 'Israel', 'a', 'cometer']);
  },
);
