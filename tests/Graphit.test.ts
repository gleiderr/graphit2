import { Expressão, Graphit, Termo } from '../Graphit';

describe('Graphit', () => {
  let graphit: Graphit;

  beforeEach(() => {
    // Cria uma nova instancia do Graphit antes de cada teste
    // para garantir que os testes sejam independentes
    graphit = new Graphit();
  });

  test('não deve permitir expressões vazias', () => {
    expect(() => graphit.expressão('')).toThrow(
      'Não são permitidas expressões vazias'
    );
    expect(() => graphit.expressão(' ')).toThrow(
      'Não são permitidas expressões vazias'
    );
  });

  test('Não deve permitir expressões com apenas um termo', () => {
    expect(() => graphit.expressão('Baasa')).toThrow(
      'Não são permitidas expressões com apenas um termo'
    );
  });

  test('deve descrever uma expressão simples', () => {
    const { id } = graphit.expressão('Baasa, filho de Aías');
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
    const { id: id } = graphit.expressão('Baasa, filho de Aías');
    const expressão = graphit.get(id) as Expressão;

    const baasa = graphit.get(expressão.termos[0]) as Termo;
    expect(baasa).toHaveProperty('pertence_a', [id]);
  });

  test('deve reaproveitar termos existentes', () => {
    const { id: id1 } = graphit.expressão('Baasa, filho de Aías');
    const { id: id2 } = graphit.expressão('Baasa, rei de Israel');
    const filhoDeAías = graphit.get(id1) as Expressão;
    const reiDeIsrael = graphit.get(id2) as Expressão;

    const baasa1 = filhoDeAías.termos[0];
    const baasa2 = reiDeIsrael.termos[0];

    expect(baasa1).toEqual(baasa2);
  });

  test('deve evitar duplicação de expressões', () => {
    const { id: id1 } = graphit.expressão('Baasa, filho de Aías');
    const { id: id2 } = graphit.expressão('Baasa, filho de Aías');

    expect(id1).toBe(id2);
  });

  test('deve diferenciar expressões com mesmos termos em ordem diferente', () => {
    const { id: id1 } = graphit.expressão('Baasa, filho de Aías');
    const { id: id2 } = graphit.expressão('filho de Aías, Baasa');

    expect(id1).not.toBe(id2);
  });

  test('deve lidar com termos ocultos', () => {
    const { id: id1 } = graphit.expressão('filho de Aías', {
      contém: ['Baasa'],
    });
    const expressão = graphit.get(id1) as Expressão;

    expect(expressão).toBeDefined();
    expect(expressão.termos).toHaveLength(3);
    expect(expressão.termosOcultos).toHaveLength(1);

    const Baasa = graphit.get(expressão.termosOcultos[0]) as Termo;

    expect(Baasa).toBeDefined();
    expect(Baasa).toHaveProperty('valor', 'Baasa');
    expect(Baasa).toHaveProperty('pertence_a');
    expect(Baasa.pertence_a).toEqual([id1]);
  });

  test('deve reconhecer um termo mandatório já presente na expressão', () => {
    const { id: id1 } = graphit.expressão('Baasa, filho de Aías', {
      contém: ['Baasa'],
    });
    const expressão = graphit.get(id1) as Expressão;

    expect(expressão).toBeDefined();
    expect(expressão.termosOcultos).toHaveLength(0);
  });

  test('deve lidar com expressões ocultas', () => {
    const { id: id1 } = graphit.expressão('filho de Tabriom', {
      contém: ['Ben-Hadade'],
    });

    const expressão = graphit.get(id1) as Expressão;
    expect(expressão).toBeDefined();
    expect(expressão.expressõesOcultas).toHaveLength(1);

    const benHadadeId = expressão.expressõesOcultas[0];
    const benHadade = graphit.get(benHadadeId) as Expressão;
    expect(benHadade).toBeDefined();
    expect(benHadade).toHaveProperty('termos');

    expect(
      benHadade.termos
        .map(termoId => graphit.get(termoId) as Termo)
        .map(termo => termo.valor)
    ).toEqual(['Ben', '-', 'Hadade']);
  });

  test('deve reconhecer uma expressão oculta já presente na expressão', () => {
    const { id: id1 } = graphit.expressão('Ben-Hadade, filho de Tabriom', {
      contém: ['Ben-Hadade'],
    });

    const expressão = graphit.get(id1) as Expressão;
    expect(expressão).toBeDefined();
    expect(expressão.subexpressões).toHaveLength(1);
    expect(expressão.expressõesOcultas).toHaveLength(0);
  });

  test('deve relacionar as subexpressões já existentes às novas expressões', () => {
    const { id: filhoDeId } = graphit.expressão('filho de');
    const { id: filiaçãoId } = graphit.expressão('Baasa, filho de Aías');
    const { id: ataqueId } = graphit.expressão(
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

    expect(ataque.contidaEm).toEqual([]);
    expect(filiação.contidaEm).toEqual([ataqueId]);

    expect(filhoDe.contidaEm).toHaveLength(2);
    expect(filhoDe.contidaEm).toEqual(
      expect.arrayContaining([filiaçãoId, ataqueId])
    );
  });

  test('deve relacionar as novas subexpressões às expressões existentes', () => {
    const { id: ataqueId } = graphit.expressão(
      'Baasa, filho de Aías, atacou Judá'
    );
    const { id: filiaçãoId } = graphit.expressão('Baasa, filho de Aías');
    const { id: filhoDeId } = graphit.expressão('filho de');

    const filhoDe = graphit.get(filhoDeId) as Expressão;
    const filiação = graphit.get(filiaçãoId) as Expressão;
    const ataque = graphit.get(ataqueId) as Expressão;

    expect(filhoDe.subexpressões).toEqual([]);
    expect(filiação.subexpressões).toEqual([filhoDeId]);

    expect(ataque.subexpressões).toHaveLength(2);
    expect(ataque.subexpressões).toEqual(
      expect.arrayContaining([filhoDeId, filiaçãoId])
    );

    expect(ataque.contidaEm).toEqual([]);
    expect(filiação.contidaEm).toEqual([ataqueId]);

    expect(filhoDe.contidaEm).toHaveLength(2);
    expect(filhoDe.contidaEm).toEqual(
      expect.arrayContaining([filiaçãoId, ataqueId])
    );
  });

  test('deve ser recuperar toda informação de expressões já cadastradas', () => {
    const expressão1 = graphit.expressão('Filho de Aías', {
      contém: ['Baasa'],
    });
    const expressão2 = graphit.expressão('Filho de Aías');

    expect(expressão2).toEqual(expressão1);
  });
});
