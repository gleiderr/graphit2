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
  test('não deve permitir informações vazias', () => {
    expect(() => graphit.informação('')).toThrow(
      'Não são permitidas informações vazias'
    );
    expect(() => graphit.informação(' ')).toThrow(
      'Não são permitidas informações vazias'
    );
  });

  test('deve permitir informações com apenas um termo', () => {
    const termo = graphit.informação('Baasa') as Termo;
    expect(termo).toBeDefined();
    expect(termo.valor).toBe('Baasa');
  });

  test('deve descrever uma informação simples', () => {
    const expressão = graphit.informação('Baasa, filho de Aías') as Expressão;

    expect(expressão).toBeDefined();

    const termos = expressão.termos
      .map(termo => graphit.get(termo) as Termo)
      .map(termo => termo.valor);
    expect(termos).toEqual(['Baasa', ',', 'filho', 'de', 'Aías']);
  });

  test('os termos devem relacionar a que expressão pertencem', () => {
    const expressão = graphit.informação('Baasa, filho de Aías') as Expressão;

    const baasa = graphit.get(expressão.termos[0]) as Termo;
    expect(baasa).toHaveProperty('pertence_a', [expressão.id]);
  });

  test('deve reaproveitar termos existentes', () => {
    const filhoDeAías = graphit.informação('Baasa, filho de Aías') as Expressão;
    const reiDeIsrael = graphit.informação('Baasa, rei de Israel') as Expressão;

    const baasa1 = filhoDeAías.termos[0];
    const baasa2 = reiDeIsrael.termos[0];

    expect(baasa1).toEqual(baasa2);
  });

  test('deve evitar duplicação de expressões', () => {
    const informação1 = graphit.informação('Baasa, filho de Aías');
    const informação2 = graphit.informação('Baasa, filho de Aías');

    expect(informação1.id).toBe(informação2.id);
  });

  test('deve diferenciar expressões com mesmos termos em ordem diferente', () => {
    const informação1 = graphit.informação('Baasa, filho de Aías');
    const informação2 = graphit.informação('filho de Aías, Baasa');

    expect(informação1.id).not.toBe(informação2.id);
  });

  describe('conteúdo de informações', () => {
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

    test('deve lidar com expressões contidas em expressões', () => {
      const expressão1 = graphit.informação('rei de Israel', {
        contém: ['em Tirza'],
      }) as Expressão;
      const expressão2 = graphit.informação('em Tirza') as Expressão;

      expect(expressão1).toBeDefined();
      expect(expressão2).toBeDefined();
      expect(expressão1.contém).toHaveLength(1);
      expect(expressão1.contém[0]).toBe(expressão2.id);
      expect(expressão2.contidaEm).toHaveLength(1);
      expect(expressão2.contidaEm[0]).toBe(expressão1.id);
    });

    test('deve lidar com termos contidos em termos', () => {
      const termo = graphit.informação('Baasa', { contém: ['rei'] }) as Termo;
      const rei = graphit.informação('rei') as Termo;

      expect(termo).toBeDefined();
      expect(termo.contém).toHaveLength(1);
      expect(termo.contém[0]).toBe(rei.id);

      expect(rei).toBeDefined();
      expect(rei.contidaEm).toHaveLength(1);
      expect(rei.contidaEm[0]).toBe(termo.id);
    });

    test('deve lidar expressões contidas em termos', () => {
      const termo = graphit.informação('Baasa', {
        contém: ['filho de Aías'],
      }) as Termo;
      const filhoDeAías = graphit.informação('filho de Aías');

      expect(termo).toBeDefined();
      expect(termo.contém).toHaveLength(1);
      expect(termo.contém[0]).toBe(filhoDeAías.id);

      expect(filhoDeAías.contidaEm).toHaveLength(1);
      expect(filhoDeAías.contidaEm[0]).toBe(termo.id);
    });

    test('deve diferenciar termos de uma expressão e seu conteúdo', () => {
      const itens = ['Abacaxi', 'laranja', 'e outras coisas'];
      const lista = graphit.informação('Lista escrita num papel laranja:', {
        contém: itens,
      });

      const infoItens = itens.map(item => graphit.informação(item));

      expect(lista).toBeDefined();
      expect(lista.contém).toHaveLength(3);
      expect(lista.contém).toEqual(infoItens.map(item => item.id));
    });
  });

  describe('subexpressões', () => {
    test('deve relacionar as subexpressões já existentes às novas expressões', () => {
      const filhoDe = graphit.informação('filho de') as Expressão;
      const filiação = graphit.informação('Baasa, filho de Aías') as Expressão;
      const ataque = graphit.informação(
        'Baasa, filho de Aías, atacou Judá'
      ) as Expressão;

      expect(filhoDe.subexpressões).toEqual([]);
      expect(filiação.subexpressões).toEqual([filhoDe.id]);
      expect(ataque.subexpressões).toHaveLength(2);
      expect(ataque.subexpressões).toEqual(
        expect.arrayContaining([filhoDe.id, filiação.id])
      );

      expect(ataque.subexpressãoDe).toEqual([]);
      expect(filiação.subexpressãoDe).toEqual([ataque.id]);

      expect(filhoDe.subexpressãoDe).toHaveLength(2);
      expect(filhoDe.subexpressãoDe).toEqual(
        expect.arrayContaining([filiação.id, ataque.id])
      );
    });

    test('deve relacionar as novas subexpressões às expressões existentes', () => {
      const ataque = graphit.informação(
        'Baasa, filho de Aías, atacou Judá'
      ) as Expressão;
      const filiação = graphit.informação('Baasa, filho de Aías') as Expressão;
      const filhoDe = graphit.informação('filho de') as Expressão;

      expect(filhoDe.subexpressões).toEqual([]);
      expect(filiação.subexpressões).toEqual([filhoDe.id]);
      expect(ataque.subexpressões).toHaveLength(2);
      expect(ataque.subexpressões).toEqual(
        expect.arrayContaining([filhoDe.id, filiação.id])
      );

      expect(ataque.subexpressãoDe).toEqual([]);
      expect(filiação.subexpressãoDe).toEqual([ataque.id]);
      expect(filhoDe.subexpressãoDe).toHaveLength(2);
      expect(filhoDe.subexpressãoDe).toEqual(
        expect.arrayContaining([filiação.id, ataque.id])
      );
    });
  });
});
