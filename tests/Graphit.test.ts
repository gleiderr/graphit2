import { DescriçãoExpressão, DescriçãoTermo, graphit } from '../Graphit';

describe('Graphit', () => {
  test('não deve permitir expressões vazias', () => {
    expect(() => graphit.expressão('')).toThrow(
      'Não são permitidas expressões vazias',
    );
    expect(() => graphit.expressão(' ')).toThrow(
      'Não são permitidas expressões vazias',
    );
  });

  test('Não deve permitir expressões com apenas um termo', () => {
    expect(() => graphit.expressão('Baasa')).toThrow(
      'Não são permitidas expressões com apenas um termo',
    );
  });

  test('deve descrever uma expressão simples', () => {
    const { id } = graphit.expressão('Baasa, filho de Aías');
    const descrição = graphit.descrever(id) as DescriçãoExpressão;

    expect(descrição).toBeDefined();
    expect(descrição).toHaveProperty('id', id);
    expect(descrição).toHaveProperty('contém');
    expect(Array.isArray(descrição.contém)).toBe(true);
    expect(descrição.contém.length).toBe(5); // "Baasa, filho de Aías"

    expect(descrição.contém[0]).toHaveProperty('valor', 'Baasa');
    expect(descrição.contém[1]).toHaveProperty('valor', ',');
    expect(descrição.contém[2]).toHaveProperty('valor', 'filho');
    expect(descrição.contém[3]).toHaveProperty('valor', 'de');
    expect(descrição.contém[4]).toHaveProperty('valor', 'Aías');
  });

  test('os termos devem ser descritos corretamente', () => {
    const { id: idExpressão } = graphit.expressão('Baasa, filho de Aías');
    const descriçãoExpressão = graphit.descrever(
      idExpressão,
    ) as DescriçãoExpressão;

    const baasa = descriçãoExpressão.contém[0];
    expect(baasa).toHaveProperty('valor', 'Baasa');

    const descriçãoBaasa = graphit.descrever(baasa.id) as DescriçãoTermo;
    expect(descriçãoBaasa).toBeDefined();
    expect(descriçãoBaasa).toHaveProperty('id', baasa.id);
    expect(descriçãoBaasa).toHaveProperty('valor', 'Baasa');
    expect(descriçãoBaasa).toHaveProperty('pertence_a', [descriçãoExpressão]);
  });

  test('deve reaproveitar termos existentes', () => {
    const { id: id1 } = graphit.expressão('Baasa, filho de Aías');
    const { id: id2 } = graphit.expressão('Baasa, rei de Israel');
    const descrição1 = graphit.descrever(id1) as DescriçãoExpressão;
    const descrição2 = graphit.descrever(id2) as DescriçãoExpressão;

    const baasa1 = descrição1.contém[0];
    const baasa2 = descrição2.contém[0];

    expect(baasa1).toEqual(baasa2);
  });

  test('deve evitar duplicação de expressões', () => {
    const { id: id1 } = graphit.expressão('Baasa, filho de Aías');
    const { id: id2 } = graphit.expressão('Baasa, filho de Aías');

    expect(id1).toBe(id2);
  });

  test('deve diferenciar expressões se estiverem em ordem diferente', () => {
    const { id: id1 } = graphit.expressão('Baasa, filho de Aías');
    const { id: id2 } = graphit.expressão('filho de Aías, Baasa');

    expect(id1).not.toBe(id2);
  });

  test.skip('deve lidar com expressões aninhadas', () => {
    const { id: id1 } = graphit.expressão('primeiro nível');
    const { id: id2 } = graphit.expressão('segundo nível');
    const { id: idPai } = graphit.expressão(
      `expressão composta ${id1} e ${id2}`,
    );

    const descrição = graphit.descrever(idPai) as DescriçãoExpressão;

    expect(descrição).toHaveProperty('contém');
    expect(
      descrição.contém.some(
        item =>
          'contém' in item &&
          item.contém.some(
            subItem => 'valor' in subItem && subItem.valor === 'primeiro',
          ),
      ),
    ).toBe(true);
  });

  test.skip('deve evitar loops infinitos com referências circulares', () => {
    // Este teste verifica se o método descrever evita loops infinitos
    // quando há referências circulares entre expressões

    const { id: id1 } = graphit.expressão('expressão um');
    const { id: id2 } = graphit.expressão(`expressão dois com ${id1}`);
    const { id: id3 } = graphit.expressão(`expressão três com ${id2}`);
    // Criando uma referência circular
    graphit.expressão(
      `${id1} atualizada com ${id3}`,
    );

    // Se não houver controle de visitados, isso causaria um loop infinito
    const descrição = graphit.descrever(id1);

    // Verifica se a descrição foi criada sem erros
    expect(descrição).toBeDefined();
  });

  test.skip('deve manter o conjunto de visitados entre chamadas', () => {
    const { id: id1 } = graphit.expressão('teste visitados');
    const { id: id2 } = graphit.expressão('outro teste');

    // Primeira chamada
    graphit.descrever(id1);

    // Segunda chamada deve limpar o conjunto de visitados
    const descrição2 = graphit.descrever(id2);

    expect(descrição2).toBeDefined();
    expect(descrição2.id).toBe(id2);
  });
});
