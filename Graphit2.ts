import { writeFile } from 'fs/promises';
import * as prettier from 'prettier';

type ArestaProps = { label: string };

type Id = string;

type Nó = { valor: string; arestas: Id[] };
type Aresta = { nós: Id[]; arestas: Id[]; props?: ArestaProps };

type Descrição = ({ valor: string } | { nós: Descrição[] }) & {
  id: Id;
  arestas: Descrição[];
};

/**
 * Implementa hipergrafo híbrido para manipulação de textos.
 * Tanto arestas como nós são vértices do grafo que podem ser conectados por arestas.
 * Arestas são na verdade hiperarestas que conectam dois ou mais nós.
 */
class Graphit2 {
  private db: { [key: string]: Nó | Aresta } = {};
  private _nextId = 0;

  private nextId() {
    return (this._nextId++).toString(36);
  }

  private novoNó(valor: string): Id {
    const id = this.nextId();
    this.db[id] = { valor, arestas: [] };
    return id;
  }

  private novaAresta(nós: Id[], props?: ArestaProps): Id {
    const id = this.nextId();
    this.db[id] = { nós, arestas: [], props };
    nós.forEach(nó => this.db[nó].arestas.push(id));
    return id;
  }

  get(id: Id): Nó | Aresta | undefined {
    return this.db[id];
  }

  buscarNó(valor: string): Id | undefined {
    return Object.keys(this.db).find(id =>
      'valor' in this.db[id] ? this.db[id].valor === valor : false,
    );
  }

  buscarArestaByIds(nós: Id[]): Id | undefined {
    return Object.keys(this.db).find(id =>
      'nós' in this.db[id] ?
        this.db[id].nós.every((nó, i) => nó === nós[i])
      : false,
    );
  }

  buscarArestaByLabel(label: string): Id | undefined {
    return Object.keys(this.db).find(id =>
      'props' in this.db[id] ? this.db[id].props?.label === label : false,
    );
  }

  /**
   * Retorna o id da aresta cujos nós coincidem com os valores informados.
   * Se não encontrar cria uma nova aresta reaproveitando os nós existentes
   * e cria novos nós sempre que necessário.
   */
  aresta(nós: (string | { id: Id })[], props?: ArestaProps): { id: Id } {
    const ids = nós.map(nó =>
      typeof nó === 'object' ? nó.id : this.buscarNó(nó) || this.novoNó(nó),
    );
    const id = this.buscarArestaByIds(ids) || this.novaAresta(ids, props);
    return { id };
  }

  /**
   * Descreve vértice do grafo criando uma estrutura de árvore, percorrendo as arestas em largura. O limite da profundidade das buscas é definido pelo parâmetro `profundidade`. Há também um critério de parada por nós específicos definido por `pararEm`.
   */
  descrever(id: Id, profundidade = 2, pararEm?: string[]): Descrição {
    // TODO: remover obrigatoriedade de `arestas` em `Descrição`?
    const visitados = new Set<Id>();

    const descreverNó = (id: Id): Descrição => {
      const vértice = this.db[id];
      if ('valor' in vértice) {
        return { id, valor: vértice.valor, arestas: [] };
      } else {
        // TODO: definir como descrever nós arestas
        return { id, nós: [], arestas: [] };
      }
    };

    // Monta a descrição do primeiro vértice
    const vértice = this.get(id);
    if (!vértice) throw new Error(`Nó não encontrado ${id}`);

    let desc1ºVértice: Descrição;
    if ('valor' in vértice) {
      desc1ºVértice = { id, valor: vértice.valor, arestas: [] };
    } else {
      desc1ºVértice = { id, nós: [], arestas: [] };
    }

    const fila: Descrição[] = [desc1ºVértice];
    while (fila.length) {
      const descriçãoCorrente = fila.shift()!;
      const vértice = this.db[descriçãoCorrente.id];

      const incluiArestaNaFila = (id: Id) => {
        if (visitados.has(id)) return;
        visitados.add(id);

        const aresta = this.db[id] as Aresta;
        const nós = aresta.nós.map(descreverNó);

        const descriçãoAresta: Descrição = { id, nós, arestas: [] };
        descriçãoCorrente.arestas.push(descriçãoAresta);

        fila.push(descriçãoAresta);
      };

      vértice.arestas.forEach(incluiArestaNaFila);
    }

    return desc1ºVértice;
  }

  /**
   *
   * @param arquivo
   */
  async salvar(arquivo: string) {
    const dados = await prettier.format(JSON.stringify(this.db), {
      parser: 'json',
    });
    await writeFile(arquivo, dados);
  }
}

export const graphit2 = new Graphit2();
