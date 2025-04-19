import { readFileSync, writeFileSync } from 'fs';
import { Graphit } from './Graphit';
import { Markdown } from './Markdown';

// TODO: Diferenciar "Deus" de "deus".
// TODO: Extrair dados direto da Bíblia.

console.log('Iniciando.............................................' + agora());
// Abre arquivo JSON de estatísticas
const estatisticas = JSON.parse(readFileSync('./estatisticas.json', 'utf-8'));
const dadosAgora = estatisticas[hora()] || (estatisticas[hora()] = {});

const graphit = new Graphit();
const markdown = new Markdown(graphit);
markdown.ler(readFileSync('./estudos/foco/Baasa.md', 'utf-8'));

writeFileSync(
  './estudos/foco/Baasa2.md',
  markdown.escrever([graphit.informação('Baasa')]),
  'utf-8'
);

// Salva estatísticas em arquivo JSON.
dadosAgora.termos = 0;
dadosAgora.expressões = 0;
dadosAgora.observações =
  'Dados extraídos do arquivo Baasa.md criado antes desta nova implementação.';
graphit.índices.forEach(indice => {
  const informação = graphit.get(indice);
  if ('termos' in informação) dadosAgora.expressões++;
  else dadosAgora.termos++;
});

console.log(estatisticas);
const estatisticasString = JSON.stringify(estatisticas, null, 2);
writeFileSync('./estatisticas.json', estatisticasString, 'utf-8');
console.log('Finalizando...........................................' + agora());

function hora() {
  const data = agora();
  return data.substring(0, 14) + ':00';
}

function agora() {
  // Formato DD/MM/YYYY HH:mm
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
}
