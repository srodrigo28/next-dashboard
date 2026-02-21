"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderTree, Home, LogOutIcon, Package, Package2, PanelLeft, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type MenuItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
};

const menuItems: MenuItem[] = [
  { label: "Inicio", icon: Home, href: "/" },
  { label: "Categorias", icon: FolderTree, href: "/categorias" },
  { label: "Produtos", icon: Package2, href: "/produtos" },
  { label: "Pedidos", icon: ShoppingBag, href: "/pedidos" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-16 border-r border-slate-200/80 bg-white/95 backdrop-blur sm:flex sm:flex-col">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm"
          >
            <Package className="h-5 w-5" />
            <span className="sr-only">Dashboard</span>
          </Link>

          <TooltipProvider>
            {menuItems.map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href;
              return (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
                        isActive
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span className="sr-only">Sair</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Sair
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      <div className="sm:hidden">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur">
          <h2 className="text-sm font-semibold text-slate-800">Dashboard</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Abrir menu" className="border-slate-300">
                <PanelLeft className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 border-slate-200 p-0">
              <nav className="grid gap-1 p-4">
                <Link
                  href="/"
                  className="mb-3 flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-3 text-white"
                >
                  <Package className="h-5 w-5" />
                  <span className="font-medium">Next Dashboard</span>
                </Link>

                {menuItems.map(({ label, icon: Icon, href }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={label}
                      href={href}
                      className={[
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
}
