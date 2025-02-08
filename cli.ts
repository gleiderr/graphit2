import console from 'console';
import readline from 'readline';
import { outputDB } from './Biblia';
import { graphit } from './Graphit';

let selectedIndex = 0;
let expressaoId: string;
let items: string[] = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

graphit.carregar(outputDB);

const promptExpressaoId = () => {
  rl.question('Digite o Id da expressão que deseja reordenar: ', id => {
    expressaoId = id;
    const expressao = graphit.get(expressaoId);
    items = expressao.expressões;
    renderList();
    listenForKeyPress();
  });
};

const renderList = () => {
  console.clear();
  console.log(
    'Use ↑ ↓ para selecionar, ctrl + ↑ ↓ para mover e Enter para sair\n',
  );

  const maxItemsPerColumn = 15;
  const numColumns = Math.ceil(items.length / maxItemsPerColumn);
  const columns = Array.from({ length: numColumns }, (_, i) =>
    items.slice(i * maxItemsPerColumn, (i + 1) * maxItemsPerColumn),
  );

  for (let i = 0; i < maxItemsPerColumn; i++) {
    let row = '';
    columns.forEach((column, colIndex) => {
      const item = column[i] || '';
      const indicator =
        i + colIndex * maxItemsPerColumn === selectedIndex ? '>' : ' ';
      row += `${indicator} ${item}\t`;
    });
    console.log(row);
  }
};

const moveSelection = (direction: 'up' | 'down') => {
  const origem = selectedIndex;
  let destino = selectedIndex;

  if (direction === 'up' && selectedIndex > 0) {
    destino--;
  } else if (direction === 'down' && selectedIndex < items.length - 1) {
    destino++;
  }

  if (origem !== destino) {
    graphit.moverExpressão(expressaoId, origem, destino);
    graphit.salvar(outputDB);
    selectedIndex = destino;
  }
};

const listenForKeyPress = () => {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on('keypress', (_, key) => {
    if (key.shift && key.name === 'up') {
      moveSelection('up');
    } else if (key.shift && key.name === 'down') {
      moveSelection('down');
    } else if (key.name === 'up') {
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (key.name === 'down') {
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    } else if (key.name === 'return') {
      console.log('\nLista final:', items);
      process.exit();
    }
    renderList();
  });
};

promptExpressaoId();
