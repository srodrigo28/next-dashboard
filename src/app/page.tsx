"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
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
    <main className="min-h-screen w-full bg-slate-100 px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Cadastrar gestor</CardTitle>
            <CardDescription>Preencha os dados para criar um novo registro.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Sexo"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
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
