"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { FolderTree } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Categoria = {
  id: number;
  nome: string;
  slug: string;
  descricao: string | null;
  ativa: boolean;
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON;
const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoriasPage() {
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativa, setAtiva] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const slugSugestao = useMemo(() => toSlug(nome), [nome]);

  const fetchCategorias = async () => {
    const { data, error } = await supabase.from("categorias").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao listar categorias:", error);
      return;
    }

    setCategorias((data as Categoria[]) || []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      nome: nome.trim(),
      slug: (slug.trim() || slugSugestao).trim(),
      descricao: descricao.trim() || null,
      ativa,
    };

    const { error } = await supabase.from("categorias").insert([payload]);

    if (error) {
      console.error("Erro ao cadastrar categoria:", error);
    } else {
      setNome("");
      setSlug("");
      setDescricao("");
      setAtiva(true);
      await fetchCategorias();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-100 to-slate-200/70 px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <Card className="border-slate-200 bg-white/90 shadow-sm backdrop-blur">
            <CardContent className="flex items-center gap-3 p-4 sm:p-5">
              <div className="rounded-full bg-slate-900 p-2 text-white">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Catalogo</p>
                <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">Cadastro de Categorias</h1>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 bg-white/95 shadow-sm lg:col-span-1">
          <CardHeader className="space-y-1">
            <CardTitle>Nova categoria</CardTitle>
            <CardDescription>Cadastre categorias para organizar os produtos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="nome" className="text-sm font-medium text-slate-700">
                  Nome
                </label>
                <Input
                  id="nome"
                  placeholder="Ex: Camisetas"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="slug" className="text-sm font-medium text-slate-700">
                  Slug
                </label>
                <Input
                  id="slug"
                  placeholder={slugSugestao || "ex: camisetas"}
                  value={slug}
                  onChange={(e) => setSlug(toSlug(e.target.value))}
                  className="border-slate-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="descricao" className="text-sm font-medium text-slate-700">
                  Descricao
                </label>
                <textarea
                  id="descricao"
                  placeholder="Descricao curta da categoria"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={ativa}
                  onChange={(e) => setAtiva(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Categoria ativa
              </label>

              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={loading}>
                {loading ? "Salvando..." : "Salvar categoria"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/95 shadow-sm lg:col-span-2">
          <CardHeader className="space-y-1">
            <CardTitle>Categorias cadastradas</CardTitle>
            <CardDescription>Utilize essas categorias no cadastro de produtos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categorias.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  Nenhuma categoria encontrada.
                </p>
              )}

              {categorias.map((item) => (
                <article key={item.id} className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{item.nome}</h3>
                      <p className="text-xs text-slate-500">/{item.slug}</p>
                    </div>
                    <span
                      className={[
                        "inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium",
                        item.ativa ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600",
                      ].join(" ")}
                    >
                      {item.ativa ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                  {item.descricao && <p className="mt-2 text-sm text-slate-600">{item.descricao}</p>}
                </article>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
