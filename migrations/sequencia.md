# Sequencia de criacao das tabelas

Execute os arquivos nesta ordem:

1. `001_base_funcoes.sql`
2. `002_categorias.sql`
3. `003_produtos.sql`
4. `004_produto_imagens.sql`
5. `005_storage_bucket_produtos.sql`

## Motivo da ordem

- `001_base_funcoes.sql`: cria a funcao `set_updated_at()` usada pelos triggers.
- `002_categorias.sql`: cria `categorias`, que e referenciada por `produtos`.
- `003_produtos.sql`: cria `produtos`, que e referenciada por `produto_imagens`.
- `004_produto_imagens.sql`: cria as imagens de cada produto (relacao 1:N).
- `005_storage_bucket_produtos.sql`: cria bucket `produtos` no Storage e politicas para upload/listagem.

## Campos de preco no produto

Na tabela `produtos`, os campos ja incluem:

- `preco_custo numeric(12,2) not null default 0`
- `preco_venda numeric(12,2) not null default 0`

Ambos aceitam somente valores maiores ou iguais a zero.
