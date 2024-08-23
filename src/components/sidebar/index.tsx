import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Home, Package, PanelBottom, Settings2, ShoppingBag, User } from "lucide-react";

export function Sidebar(){
    return(
        <div className="flex flex-col bg-muted/40">

            

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