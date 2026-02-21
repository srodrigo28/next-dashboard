"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { ChevronDown, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON;
const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

type TypeGestor = {
  id: number;
  nome: string;
  sexo: string;
  created_at: string;
};

export default function Home() {
  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState("");
  const [gestor, setGestor] = useState<TypeGestor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGestor = async () => {
    const { data, error } = await supabase
      .from("gestores")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao listar gestores:", error);
      return;
    }

    setGestor((data as TypeGestor[]) || []);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("gestores").insert([{ nome, sexo }]);

    if (error) {
      console.error("Erro ao cadastrar gestor:", error);
    } else {
      setNome("");
      setSexo("");
      await fetchGestor();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGestor();
  }, []);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-100 to-slate-200/70 px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <Card className="border-slate-200 bg-white/90 shadow-sm backdrop-blur">
            <CardContent className="flex items-center gap-3 p-4 sm:p-5">
              <div className="rounded-full bg-slate-900 p-2 text-white">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Painel</p>
                <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">Cadastro de Gestores</h1>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 bg-white/95 shadow-sm lg:col-span-1">
          <CardHeader className="space-y-1">
            <CardTitle>Cadastrar gestor</CardTitle>
            <CardDescription>Preencha os dados para criar um novo registro.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="nome" className="text-sm font-medium text-slate-700">
                Nome
              </label>
              <Input
                id="nome"
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="border-slate-300 bg-white"
              />

              <div className="space-y-1">
                <label htmlFor="sexo" className="text-sm font-medium text-slate-700">
                  Sexo
                </label>
                <div className="relative">
                  <select
                    id="sexo"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    required
                    className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="" disabled>
                      Selecione o sexo
                    </option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <Button type="submit" className="mt-2 w-full bg-slate-900 hover:bg-slate-800" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/95 shadow-sm lg:col-span-2">
          <CardHeader className="space-y-1">
            <CardTitle>Gestores cadastrados</CardTitle>
            <CardDescription>Listagem em ordem do mais recente para o mais antigo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gestor.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  Nenhum gestor encontrado.
                </p>
              )}

              {gestor.map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border bg-white p-4 shadow-sm transition hover:shadow"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-semibold text-slate-900">{item.nome}</h3>
                    <span className="text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">Sexo: {item.sexo}</p>
                </article>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
