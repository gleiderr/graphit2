import { readFileSync, writeFileSync } from 'fs';
import { Expressão, Graphit, Id, Termo } from './Graphit';
import { Esquema, esquemaPadrão, Markdown } from './Markdown';

// TODO: Tratar diferença entre "Deus" de "deus" e permitir registro de termo como mais de um valor válido
// TODO: - Ideia 1: Incluir no preambulo do arquivo markdown os termos com mais de um valor válido.
// TODO: - Ideia 2: Criar objeto do tipo Esquema que permita informar termos com mais de um valor válido.
// TODO: - Ideia 3: Registrar esses termos no banco de dados.
// TODO: - Ideia 4: Criar apenas termos virtuais que não são registrados no banco de dados.
// TODO: - Ideia 5: Criar conceito de super termo com mais de um valor válido.
// TODO: - Ideia 6: Criar conceito termo imutável.

// TODO: Testar fluxo ler(Baasa2), ler(Bíblia), escrever(Baasa2).

// TODO: Reescrever todos os textos escritos anteriormente

// TODO: Implementar escrita dos textos que contém o termo alvo.

const início = getAgora();
console.log('Iniciando...................................' + início.formatado);
// Abre arquivo JSON de estatísticas
const estatisticas = JSON.parse(readFileSync('./estatisticas.json', 'utf-8'));
const horaAtual = hora();
const dadosAgora = estatisticas[horaAtual] || (estatisticas[horaAtual] = {});

const graphit = new Graphit();
const markdown = new Markdown(graphit);
markdown.ler(readFileSync('./estudos/foco/Baasa2.md', 'utf-8'));
markdown.ler(readFileSync('./estudos/Bíblia.md', 'utf-8'));

const termoBaasa = graphit.informação('Baasa') as Termo;
const baasa = markdown.escrever([termoBaasa]);

const baasaPertence_a = termoBaasa.pertence_a
  .filter(i => !markdown.visitados.has(i))
  .map(i => graphit.get(i));
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

// Salva estatísticas em arquivo JSON.
dadosAgora.duração = (Date.now() - início.time) / 1000; // Duração em segundos como número
dadosAgora.termos = 0;
dadosAgora.expressões = 0;
dadosAgora.observações =
  'Escreve em Baasa2.md, dentro de comentário, textos relacionados a Baasa filtrando os já visitados.';
graphit.índices.forEach(indice => {
  const informação = graphit.get(indice);
  if ('termos' in informação) dadosAgora.expressões++;
  else dadosAgora.termos++;
});

console.log(estatisticas[horaAtual]);
const estatisticasString = JSON.stringify(estatisticas, null, 2);
writeFileSync('./estatisticas.json', estatisticasString, 'utf-8');
console.log('Finalizando..............................' + getAgora().formatado);

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
