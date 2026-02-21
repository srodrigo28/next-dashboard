-- 005_storage_bucket_produtos.sql
-- Cria bucket de imagens de produtos e politicas de acesso
-- Observacao: esta configuracao permite uso direto no frontend com anon key.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'produtos',
  'produtos',
  true,
  5242880,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Em Supabase, `storage.objects` normalmente ja usa RLS e essa tabela
-- pode nao permitir ALTER TABLE para o role atual no SQL Editor.
-- Por isso, nao forcar `enable row level security` aqui.

drop policy if exists "Produtos public read" on storage.objects;
create policy "Produtos public read"
on storage.objects
for select
to public
using (bucket_id = 'produtos');

drop policy if exists "Produtos anon upload" on storage.objects;
create policy "Produtos anon upload"
on storage.objects
for insert
to anon
with check (bucket_id = 'produtos');

drop policy if exists "Produtos anon update" on storage.objects;
create policy "Produtos anon update"
on storage.objects
for update
to anon
using (bucket_id = 'produtos')
with check (bucket_id = 'produtos');

drop policy if exists "Produtos anon delete" on storage.objects;
create policy "Produtos anon delete"
on storage.objects
for delete
to anon
using (bucket_id = 'produtos');

commit;
