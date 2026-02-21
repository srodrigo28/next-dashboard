"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { Eye, ImagePlus, PackagePlus, Trash2, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Categoria = {
  id: number;
  nome: string;
};

type ProdutoResumo = {
  id: number;
  nome: string;
  preco_venda: number;
  quantidade: number;
  ativo: boolean;
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON;
const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
const produtoBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_PRODUTOS || "produtos";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProdutosPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<ProdutoResumo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [quantidade, setQuantidade] = useState("0");
  const [precoCusto, setPrecoCusto] = useState("0.00");
  const [precoVenda, setPrecoVenda] = useState("0.00");
  const [ativo, setAtivo] = useState(true);

  const [novaImagemUrl, setNovaImagemUrl] = useState("");
  const [imagens, setImagens] = useState<string[]>([]);

  const slugSugestao = useMemo(() => toSlug(nome), [nome]);
  const imagemPrincipal = imagens[0] || "https://placehold.co/900x600/f8fafc/0f172a?text=Preview+do+Produto";

  const fetchCategorias = async () => {
    const { data, error } = await supabase.from("categorias").select("id, nome").eq("ativa", true).order("nome");
    if (error) {
      console.error("Erro ao listar categorias:", error);
      return;
    }
    setCategorias((data as Categoria[]) || []);
  };

  const fetchProdutos = async () => {
    const { data, error } = await supabase
      .from("produtos")
      .select("id, nome, preco_venda, quantidade, ativo, created_at")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Erro ao listar produtos:", error);
      return;
    }
    setProdutos((data as ProdutoResumo[]) || []);
  };

  const addImagem = () => {
    const value = novaImagemUrl.trim();
    if (!value) return;
    if (imagens.includes(value)) {
      setNovaImagemUrl("");
      return;
    }
    setImagens((prev) => [...prev, value]);
    setNovaImagemUrl("");
  };

  const removeImagem = (url: string) => {
    setImagens((prev) => prev.filter((item) => item !== url));
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImages(true);
    const pastaBase = toSlug(slug || nome || "produto");
    const novasUrls: string[] = [];

    for (const file of files) {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
      const filePath = `${pastaBase}/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;

      const { data, error } = await supabase.storage.from(produtoBucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error || !data) {
        console.error("Erro no upload da imagem:", error);
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from(produtoBucket).getPublicUrl(data.path);
      if (publicUrlData?.publicUrl) {
        novasUrls.push(publicUrlData.publicUrl);
      }
    }

    if (novasUrls.length > 0) {
      setImagens((prev) => [...prev, ...novasUrls.filter((url) => !prev.includes(url))]);
    }

    setUploadingImages(false);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      categoria_id: Number(categoriaId),
      nome: nome.trim(),
      slug: slug.trim() || slugSugestao,
      descricao: descricao.trim() || null,
      quantidade: Number(quantidade),
      preco_custo: Number(precoCusto),
      preco_venda: Number(precoVenda),
      ativo,
    };

    const { data, error } = await supabase.from("produtos").insert([payload]).select("id").single();

    if (error || !data) {
      console.error("Erro ao cadastrar produto:", error);
      setLoading(false);
      return;
    }

    if (imagens.length > 0) {
      const rows = imagens.map((url, index) => ({
        produto_id: data.id,
        url,
        ordem: index,
        destaque: index === 0,
      }));

      const { error: imagensError } = await supabase.from("produto_imagens").insert(rows);
      if (imagensError) {
        console.error("Produto salvo, mas falhou ao salvar imagens:", imagensError);
      }
    }

    setNome("");
    setSlug("");
    setDescricao("");
    setCategoriaId("");
    setQuantidade("0");
    setPrecoCusto("0.00");
    setPrecoVenda("0.00");
    setAtivo(true);
    setNovaImagemUrl("");
    setImagens([]);
    await fetchProdutos();
    setLoading(false);
  };

  useEffect(() => {
    fetchCategorias();
    fetchProdutos();
  }, []);

  return (
    <main className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#e2e8f0,_#f8fafc_45%,_#eef2ff)] px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-5">
          <Card className="border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 text-white shadow-xl">
            <CardContent className="flex items-center justify-between gap-3 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">Catalogo Profissional</p>
                <h1 className="text-xl font-semibold sm:text-2xl">Cadastro de Produtos</h1>
              </div>
              <PackagePlus className="h-9 w-9 text-cyan-100" />
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 bg-white/90 shadow-lg xl:col-span-3">
          <CardHeader>
            <CardTitle>Dados do produto</CardTitle>
            <CardDescription>Estrutura pronta para loja com categoria, estoque, precos e galeria.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="nome" className="text-sm font-medium text-slate-700">
                    Nome do produto
                  </label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Camiseta Oversized"
                    required
                    className="border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="categoria" className="text-sm font-medium text-slate-700">
                    Categoria
                  </label>
                  <select
                    id="categoria"
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    required
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="" disabled>
                      Selecione uma categoria
                    </option>
                    {categorias.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="slug" className="text-sm font-medium text-slate-700">
                    Slug
                  </label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(toSlug(e.target.value))}
                    placeholder={slugSugestao || "ex-camiseta-oversized"}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="quantidade" className="text-sm font-medium text-slate-700">
                    Quantidade em estoque
                  </label>
                  <Input
                    id="quantidade"
                    type="number"
                    min={0}
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="preco-custo" className="text-sm font-medium text-slate-700">
                    Preco de custo (R$)
                  </label>
                  <Input
                    id="preco-custo"
                    type="number"
                    min={0}
                    step="0.01"
                    value={precoCusto}
                    onChange={(e) => setPrecoCusto(e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="preco-venda" className="text-sm font-medium text-slate-700">
                    Preco de venda (R$)
                  </label>
                  <Input
                    id="preco-venda"
                    type="number"
                    min={0}
                    step="0.01"
                    value={precoVenda}
                    onChange={(e) => setPrecoVenda(e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="descricao" className="text-sm font-medium text-slate-700">
                  Descricao
                </label>
                <textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={4}
                  placeholder="Descreva os detalhes importantes do produto..."
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm font-medium text-slate-700">Galeria de imagens (1 ou varias)</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={novaImagemUrl}
                    onChange={(e) => setNovaImagemUrl(e.target.value)}
                    placeholder="https://site.com/imagem.jpg"
                    className="border-slate-300 bg-white"
                  />
                  <Button type="button" onClick={addImagem} className="bg-cyan-700 hover:bg-cyan-600">
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-cyan-300 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800 transition hover:bg-cyan-100">
                  <Upload className="h-4 w-4" />
                  {uploadingImages ? "Enviando imagens..." : "Upload de imagens"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadImages}
                    disabled={uploadingImages}
                    className="hidden"
                  />
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {imagens.map((url, index) => (
                    <div key={url} className="flex items-center justify-between gap-2 rounded-lg border bg-white p-2">
                      <p className="truncate text-xs text-slate-600">
                        {index === 0 ? "Capa: " : "Imagem: "}
                        {url}
                      </p>
                      <Button type="button" size="icon" variant="outline" onClick={() => removeImagem(url)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Produto ativo
              </label>

              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={loading}>
                {loading ? "Salvando produto..." : "Salvar produto"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6 xl:col-span-2">
          <Card className="border-0 bg-gradient-to-b from-cyan-950 to-slate-900 text-white shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4" />
                Preview do produto
              </CardTitle>
              <CardDescription className="text-cyan-100/80">Visual de vitrine em tempo real.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagemPrincipal}
                alt="Preview do produto"
                className="h-52 w-full rounded-xl border border-white/20 object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{nome || "Nome do produto"}</h3>
                <p className="mt-1 text-sm text-cyan-100/80">
                  {descricao || "A descricao aparecera aqui assim que voce preencher os dados."}
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm">
                <span>Venda</span>
                <strong>R$ {Number(precoVenda || 0).toFixed(2)}</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm">
                <span>Custo</span>
                <strong>R$ {Number(precoCusto || 0).toFixed(2)}</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm">
                <span>Estoque</span>
                <strong>{quantidade || 0} un.</strong>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/95 shadow-md">
            <CardHeader>
              <CardTitle>Produtos recentes</CardTitle>
              <CardDescription>Ultimos cadastros para validacao rapida.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {produtos.length === 0 && (
                  <p className="rounded-md border border-dashed p-3 text-sm text-slate-500">Nenhum produto ainda.</p>
                )}
                {produtos.map((item) => (
                  <article key={item.id} className="rounded-lg border bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="truncate text-sm font-semibold text-slate-900">{item.nome}</h4>
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          item.ativo ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600",
                        ].join(" ")}
                      >
                        {item.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      R$ {Number(item.preco_venda).toFixed(2)} | Estoque: {item.quantidade}
                    </p>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
