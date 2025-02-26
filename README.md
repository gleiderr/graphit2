# Graphit

A proposta deste projeto é construir uma arquitetura emergente para estudo da Bíblia.
As construções são simples para garantir sua utilidade desde o primeiro dia.
Para cada implementação, é utilizada uma abordagem ad-hoc para garantir a utilidade imediata da implementação, mas sempre pensando-se nas consequências futuras.

## Príncípios
- V
- E
- Li
- T
- S

# Bíblia
Ao compilar os versículos da Bíblia são executadas as seguintes operações:
- São identificados os fatos, os apostos, locuções adverbiais, pronomes, sujeitos ocultos e (predicados ocultos?  )
- Cada aposto é transformado em uma expressão independente
- Locuções adverbiais são transformadas em expressões dependentes da expressão individual
- Pronomes são substituídos por seus respectivos substantivos
- Os sujeitos ocultos e predicados ocultos são identificados e trazidos para a expressão
- Os  são identificados e tratados

## Versão Baasa
### Fazer
- Incluir estatísticas por dia
- Remover ato de ignorar o primeiro termo no markdown
- Converter arquivos markdown em html
- Instalar tufte.css
- Publicar no Github
- Tag "Baasa" em git

### Feito
- Incluir exclusão e movimentação via linha de comando
- Renomeia 'aresta' para 'expressão'
- Organizar arquivos e pastas
- Carregar Bíblia.json
- Movimentar arestas

## Versão Obede-Edom
### Fazer
- No estudo a respeito de Jeroboão o trecho abaixo pode ser resumido reaproveitando a expressão "Baasa fez o que o Senhor reprova".
  ```md
  - Baasa fez o que o Senhor reprova andando nos caminhos de Jeroboão (1 Rs 15.34)
  - Baasa fez o que o Senhor reprova andando nos pecados que Jeroboão tinha levado Israel a cometer (1 Rs 15.34)
  ```
- Incluir ordenação "automática"
- Incluir identificação automática de sub expressões
- Criar relação de equivalência entre expressões para evitar repetição de informações
- Imprimir análise dos versículos por expressões
- Destokenizar
- Implementar testes unitários
- Remover '-' do nível zero?

## Referências
São impressas à frete de cada impressão de aresta e seus respectivos versículos são impressas no final de cada título impresso