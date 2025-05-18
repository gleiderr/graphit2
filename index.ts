import { readFileSync, writeFileSync } from 'fs';
import { Termo } from './Graphit';
import { esquemaPadrão } from './Markdown';
import { esquemaBíblia, MarkdownBíblia } from './MarkdownBíblia';

// TODO: Testar fluxo ler(Baasa2), ler(Bíblia), escrever(Baasa2).

// TODO: Reescrever todos os textos escritos anteriormente

// TODO: Implementar escrita dos textos que contém o termo alvo.

// TODO: Escrever acerca de todas pessoas e lugares bíblicos.

executarComEstatísticas(
  'Torna termos minúsculos por padrão e lida com substantivos próprios',
  () => {
    const markdown = new MarkdownBíblia();
    markdown.ler(readFileSync('./estudos/foco/Baasa2.md', 'utf-8'));
    markdown.ler(readFileSync('./estudos/Bíblia.md', 'utf-8'));

    const termoBaasa = markdown.graphit.informação('Baasa') as Termo;
    const baasa = markdown.escrever([termoBaasa], esquemaBíblia);

    const baasaPertence_a = termoBaasa.pertence_a
      .filter(i => !markdown.escritos.has(i))
      .map(i => markdown.graphit.get(i));
    const pertencimento = markdown.escrever(baasaPertence_a, {
      ...esquemaPadrão,
      nívelInicial: 2,
    });

    writeFileSync(
      './estudos/foco/Baasa2.md',
      [
        baasa,
        '<!-- Outros textos a que Baasa pertence\n',
        pertencimento,
        '-->',
      ].join('\n'),
      'utf-8'
    );

    let termos = 0;
    let expressões = 0;
    markdown.graphit.índices.forEach(indice => {
      const informação = markdown.graphit.get(indice);
      if ('termos' in informação) expressões++;
      else termos++;
    });

    return { termos, expressões };
  }
);

function executarComEstatísticas(
  observações: string,
  funcao: () => { termos: number; expressões: number }
) {
  const início = getAgora();
  console.log(
    'Iniciando...................................' + início.formatado
  );
  // Abre arquivo JSON de estatísticas
  const estatisticas = JSON.parse(readFileSync('./estatisticas.json', 'utf-8'));
  const horaAtual = hora();
  const dadosAgora = estatisticas[horaAtual] || (estatisticas[horaAtual] = {});

  const { termos, expressões } = funcao(); // Executa a função passada como argumento

  // Salva estatísticas em arquivo JSON.
  dadosAgora.duração = (Date.now() - início.time) / 1000; // Duração em segundos como número
  dadosAgora.termos = termos;
  dadosAgora.expressões = expressões;
  dadosAgora.observações = observações;

  console.log(estatisticas[horaAtual]);
  const estatisticasString = JSON.stringify(estatisticas, null, 2);
  writeFileSync('./estatisticas.json', estatisticasString, 'utf-8');
  console.log(
    'Finalizando..............................' + getAgora().formatado
  );

  function hora() {
    const data = getAgora();
    return data.formatado.substring(0, 14) + ':00';
  }

  function getAgora() {
    const dataHoraAtual = new Date();
    // Formato DD/MM/YYYY HH:mm
    return {
      formatado: dataHoraAtual.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
      time: dataHoraAtual.getTime(),
    };
  }
}
