import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProdutosPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-100 to-slate-200/70 px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto w-full max-w-6xl">
        <Card className="border-slate-200 bg-white/95 shadow-sm">
          <CardHeader>
            <CardTitle>Cadastro de Produtos</CardTitle>
            <CardDescription>
              Proximo passo: montar a tela com preview de produto e vinculacao de categoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Primeiro cadastre as categorias em <strong>/categorias</strong>. Depois partimos para o cadastro completo
              de produtos.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
