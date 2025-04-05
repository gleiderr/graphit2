import { Expressão, Graphit, Termo } from '../Graphit';

// TODO: Revisar testes para cada funcionalidade
// TODO: Validar cobertura de testes
// TODO: Testar com mutations
describe('Graphit', () => {
  let graphit: Graphit;

  beforeEach(() => {
    // Cria uma nova instancia do Graphit antes de cada teste
    // para garantir que os testes sejam independentes
    graphit = new Graphit();
  });

  // REVIEW: Subistituir referências a 'expressão' por 'informação'
  test('não deve permitir expressões vazias', () => {
    expect(() => graphit.informação('')).toThrow(
      'Não são permitidas expressões vazias'
    );
    expect(() => graphit.informação(' ')).toThrow(
      'Não são permitidas expressões vazias'
    );
  });

  test('deve permitir expressões com apenas um termo', () => {
    const termo = graphit.informação('Baasa') as Termo;
    expect(termo).toBeDefined();
    expect(termo.valor).toBe('Baasa');
  });

  test('deve descrever uma expressão simples', () => {
    const { id } = graphit.informação('Baasa, filho de Aías');
    const expressão = graphit.get(id) as Expressão;

    expect(expressão).toBeDefined();
    expect(expressão).toHaveProperty('termos');
    expect(Array.isArray(expressão.termos)).toBe(true);

    const termos = expressão.termos
      .map(termo => graphit.get(termo) as Termo)
      .map(termo => termo.valor);
    expect(termos).toEqual(['Baasa', ',', 'filho', 'de', 'Aías']);
  });

  test('os termos devem informar a que expressão pertencem', () => {
    const { id: id } = graphit.informação('Baasa, filho de Aías');
    const expressão = graphit.get(id) as Expressão;

    const baasa = graphit.get(expressão.termos[0]) as Termo;
    expect(baasa).toHaveProperty('pertence_a', [id]);
  });

  test('deve reaproveitar termos existentes', () => {
    const { id: id1 } = graphit.informação('Baasa, filho de Aías');
    const { id: id2 } = graphit.informação('Baasa, rei de Israel');
    const filhoDeAías = graphit.get(id1) as Expressão;
    const reiDeIsrael = graphit.get(id2) as Expressão;

    const baasa1 = filhoDeAías.termos[0];
    const baasa2 = reiDeIsrael.termos[0];

    expect(baasa1).toEqual(baasa2);
  });

  test('deve evitar duplicação de expressões', () => {
    const { id: id1 } = graphit.informação('Baasa, filho de Aías');
    const { id: id2 } = graphit.informação('Baasa, filho de Aías');

    expect(id1).toBe(id2);
  });

  test('deve diferenciar expressões com mesmos termos em ordem diferente', () => {
    const { id: id1 } = graphit.informação('Baasa, filho de Aías');
    const { id: id2 } = graphit.informação('filho de Aías, Baasa');

    expect(id1).not.toBe(id2);
  });

  test('deve lidar expressões contidas em termos', () => {
    const termo = graphit.informação('Baasa', {
      contém: ['filho de Aías'],
    }) as Termo;
    const filhoDeAías = graphit.informação('filho de Aías');

    expect(termo).toBeDefined();
    expect(termo).toHaveProperty('contém');
    expect(termo.contém).toHaveLength(1);
    expect(termo.contém[0]).toBe(filhoDeAías.id);
  });

  test('deve lidar com termos contidos em expressões', () => {
    const expressão = graphit.informação('filho de Aías', {
      contém: ['Baasa'],
    }) as Expressão;

    expect(expressão).toBeDefined();
    expect(expressão.termos).toHaveLength(3);
    expect(expressão.contém).toHaveLength(1);

    const Baasa = graphit.get(expressão.contém[0]) as Termo;

    expect(Baasa.contidaEm).toHaveLength(1);
    expect(Baasa.contidaEm[0]).toBe(expressão.id);
  });

  test('deve lidar diferenciar termos de uma expressão e seu conteúdo', () => {
    const itens = ['Abacaxi', 'laranja', 'e outras coisas'];
    const lista = graphit.informação(
      'Escrevi a lista de compras abaixo num papel laranja:',
      {
        contém: itens,
      }
    );

    const infoItens = itens.map(item => graphit.informação(item));

    expect(lista).toBeDefined();
    expect(lista.contém).toHaveLength(3);
    expect(lista.contém).toEqual(infoItens.map(item => item.id));
  });

  test('deve lidar com expressões ocultas', () => {
    const { id: id1 } = graphit.informação('filho de Tabriom', {
      contém: ['Ben-Hadade'],
    });

    const expressão = graphit.get(id1) as Expressão;
    expect(expressão).toBeDefined();
    expect(expressão.contém).toHaveLength(1);

    const benHadadeId = expressão.contém[0];
    const benHadade = graphit.get(benHadadeId) as Expressão;
    expect(benHadade).toBeDefined();
    expect(benHadade).toHaveProperty('termos');

    expect(
      benHadade.termos
        .map(termoId => graphit.get(termoId) as Termo)
        .map(termo => termo.valor)
    ).toEqual(['Ben', '-', 'Hadade']);
  });

  test('deve relacionar as subexpressões já existentes às novas expressões', () => {
    const { id: filhoDeId } = graphit.informação('filho de');
    const { id: filiaçãoId } = graphit.informação('Baasa, filho de Aías');
    const { id: ataqueId } = graphit.informação(
      'Baasa, filho de Aías, atacou Judá'
    );

    const filhoDe = graphit.get(filhoDeId) as Expressão;
    const filiação = graphit.get(filiaçãoId) as Expressão;
    const ataque = graphit.get(ataqueId) as Expressão;

    expect(filhoDe.subexpressões).toEqual([]);
    expect(filiação.subexpressões).toEqual([filhoDeId]);

    expect(ataque.subexpressões).toHaveLength(2);
    expect(ataque.subexpressões).toEqual(
      expect.arrayContaining([filhoDeId, filiaçãoId])
    );

    expect(ataque.subexpressãoDe).toEqual([]);
    expect(filiação.subexpressãoDe).toEqual([ataqueId]);

    expect(filhoDe.subexpressãoDe).toHaveLength(2);
    expect(filhoDe.subexpressãoDe).toEqual(
      expect.arrayContaining([filiaçãoId, ataqueId])
    );
  });

  test('deve relacionar as novas subexpressões às expressões existentes', () => {
    const { id: ataqueId } = graphit.informação(
      'Baasa, filho de Aías, atacou Judá'
    );
    const { id: filiaçãoId } = graphit.informação('Baasa, filho de Aías');
    const { id: filhoDeId } = graphit.informação('filho de');

    const filhoDe = graphit.get(filhoDeId) as Expressão;
    const filiação = graphit.get(filiaçãoId) as Expressão;
    const ataque = graphit.get(ataqueId) as Expressão;

    expect(filhoDe.subexpressões).toEqual([]);
    expect(filiação.subexpressões).toEqual([filhoDeId]);

    expect(ataque.subexpressões).toHaveLength(2);
    expect(ataque.subexpressões).toEqual(
      expect.arrayContaining([filhoDeId, filiaçãoId])
    );

    expect(ataque.subexpressãoDe).toEqual([]);
    expect(filiação.subexpressãoDe).toEqual([ataqueId]);

    expect(filhoDe.subexpressãoDe).toHaveLength(2);
    expect(filhoDe.subexpressãoDe).toEqual(
      expect.arrayContaining([filiaçãoId, ataqueId])
    );
  });

  test('deve ser recuperar toda informação de expressões já cadastradas', () => {
    const expressão1 = graphit.informação('Filho de Aías', {
      contém: ['Baasa'],
    });
    const expressão2 = graphit.informação('Filho de Aías');

    expect(expressão2).toEqual(expressão1);
  });
});
