import console from 'console';
import readline from 'readline';
import { inputDB } from './Biblia';
import { graphit } from './Graphit';

class CLI {
  private selectedIndex = 0;
  private expressaoId: string = '';
  private items: string[] = [];
  private rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  private message: string = '';

  constructor(private fileDB: string) {
    this.promptExpressaoId();
  }

  private promptExpressaoId() {
    graphit.carregar(this.fileDB);
    console.clear();

    this.rl.question('Digite o Id do elemento que deseja editar: ', id => {
      this.expressaoId = id;
      const expressao = graphit.get(this.expressaoId);
      this.items = [...expressao.expressões];
      this.renderList();
      this.listenForKeyPress();
    });
  }

  private renderList() {
    console.clear();
    console.log(
      'Use ↑ ↓ para selecionar, shift + ↑ ↓ para mover, del para excluir e Enter para retornar à seleção do elemento\n',
    );

    const maxItemsPerColumn = 10;
    const numColumns = Math.ceil(this.items.length / maxItemsPerColumn);
    const columns = Array.from({ length: numColumns }, (_, i) =>
      this.items.slice(i * maxItemsPerColumn, (i + 1) * maxItemsPerColumn),
    );

    for (let i = 0; i < maxItemsPerColumn; i++) {
      let row = '';
      columns.forEach((column, colIndex) => {
        const item = column[i] || '';
        const indicator =
          i + colIndex * maxItemsPerColumn === this.selectedIndex ? '>' : ' ';
        row += `${indicator} ${item}\t`;
      });
      console.log(row);
    }

    console.log(this.message);
  }

  private moveSelection(direction: 'up' | 'down') {
    const origem = this.selectedIndex;
    let destino = this.selectedIndex;

    if (direction === 'up' && this.selectedIndex > 0) {
      destino--;
    } else if (
      direction === 'down' &&
      this.selectedIndex < this.items.length - 1
    ) {
      destino++;
    }

    if (origem !== destino) {
      graphit.moverExpressão(this.expressaoId, origem, destino);
      graphit.salvar(this.fileDB);
      this.selectedIndex = destino;
    }
  }

  private deleteSelectedItem() {
    const itemId = this.items[this.selectedIndex];
    graphit.excluirExpressão(itemId);
    this.items.splice(this.selectedIndex, 1);
    this.selectedIndex = Math.min(this.selectedIndex, this.items.length - 1);
    graphit.salvar(this.fileDB);
    this.message = `Item ${itemId} excluído com sucesso.`;
  }

  private listenForKeyPress() {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (_, key) => {
      this.message = '';

      if (key.shift && key.name === 'up') {
        this.moveSelection('up');
      } else if (key.shift && key.name === 'down') {
        this.moveSelection('down');
      } else if (key.name === 'up') {
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      } else if (key.name === 'down') {
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.items.length - 1,
        );
      } else if (key.name === 'delete') {
        try {
          this.deleteSelectedItem();
        } catch (error) {
          if (error instanceof Error) {
            this.message = error.message;
          }
        }
      }

      this.renderList();
    });
  }
}

new CLI(inputDB);
