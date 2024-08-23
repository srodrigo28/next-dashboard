import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Home, LogOutIcon, Package, Package2, PanelBottom, Settings2, ShoppingBag, User, User2 } from "lucide-react";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

export function Sidebar(){
    return(
        <div className="flex flex-col bg-muted/40">

            <aside 
                className="fixed inset-y-0 left-0 z-20 hidden w-14 border-r bg-background sm:flex flex-col">
                <nav className="flex flex-col items-center gap-5 px-2 py-5">
                    <TooltipProvider>
                        <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary
                        text-primary-foreground rounded-full">
                            <Package className="h-5 w-5" />
                            <span className="sr-only">Dashboard Avatar</span>
                        </Link>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-10 2-10 shrink-0 items-center justify-center rounded-lg
                                    text-muted-foreground transition-colors hover:text-foreground">
                                    <Home className="h-5 w-5" />
                                </Link> 
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">Início</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-10 2-10 shrink-0 items-center justify-center rounded-lg
                                    text-muted-foreground transition-colors hover:text-foreground ">
                                    <ShoppingBag className="h-5 w-5" />
                                </Link> 
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">Pedidos</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-10 2-10 shrink-0 items-center justify-center rounded-lg
                                    text-muted-foreground transition-colors hover:text-foreground ">
                                    <Package2 className="h-5 w-5" />
                                </Link> 
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">Produtos</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-10 2-10 shrink-0 items-center justify-center rounded-lg
                                    text-muted-foreground transition-colors hover:text-foreground ">
                                    <User2 className="h-5 w-5" />
                                </Link> 
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">Clientes</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-10 2-10 shrink-0 items-center justify-center rounded-lg
                                    text-muted-foreground transition-colors hover:text-foreground ">
                                    <Settings2 className="h-5 w-5" />
                                </Link> 
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">Configurações</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-5 px-2 py5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-10 2-10 shrink-0 items-center justify-center rounded-lg
                                    text-muted-foreground transition-colors hover:text-foreground ">
                                    <LogOutIcon className="h-5 w-5 hover:text-red-500" />
                                </Link> 
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">Sair</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>

            </aside>

            <div className="sm:hidden flex flex-col sm:gap-5 sm:py-5 sm:pl-14">
                <header 
                    className="
                        sticky top-0 z-10 flex gap-5 h-14 items-center px-5 border-b 
                        bg-background sm:h-auto sm:border-spacing-6 sm:bg-transparent">
                    <Sheet >
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className="sm:hidden ">
                                <PanelBottom className="w-5 h-5" />
                                <span className="sr-only">Abrir / fechar menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-x" side="top">
                            <nav className="grid text-lg font-medium">
                                <Link href="#"
                                    className="bg-blue-300 flex items-center gap-2 p-3 w-full rounded-md mt-5 text-white hover:bg-blue-400"
                                >
                                    <Package className="h-10 w-10 transition-all bg-primary p-3 rounded-full" />
                                    <h3>Next Shadcn - UI</h3>
                                    <span className="sr-only">Logo do projeto</span>
                                </Link>

                                <Link href="#"
                                    className="bg-blue-300 flex items-center p-3 w-full rounded-md mt-3 text-white hover:bg-blue-400"
                                >
                                    <Home className="h-10 w-10 transition-all p-3 rounded-full text-3xl " />
                                    Início
                                </Link>

                                <Link href="#"
                                    className="bg-blue-300 flex items-center p-3 w-full rounded-md mt-3 text-white hover:bg-blue-400"
                                >
                                    <ShoppingBag className="h-10 w-10 transition-all p-3 rounded-full text-3xl " />
                                    Produtos
                                </Link>

                                <Link href="#"
                                    className="bg-blue-300 flex items-center p-3 w-full rounded-md mt-3 text-white hover:bg-blue-400"
                                >
                                    <User className="h-10 w-10 transition-all p-3 rounded-full text-3xl " />
                                    Clientes
                                </Link>

                                <Link href="#"
                                    className="bg-blue-300 flex items-center p-3 w-full rounded-md mt-3 text-white hover:bg-blue-400"
                                >
                                    <Settings2 className="h-10 w-10 transition-all p-3 rounded-full text-3xl " />
                                    Configurações
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <h2 className="font-medium">Menu</h2>
                </header>
            </div>
        </div>
    )
}