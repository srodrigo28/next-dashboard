#### Next Typescript e  Shadcn ui 🔥

#### [x] Criando projeto
*  Criando projeto
```
npm create next-app@latest
```

* Rodando projeto
```
npm run dev
```

#### Shadcn [x] UI
*  *** Site oficial ***
```
https://ui.shadcn.com/docs/installation
```

* Adicionando no projeto NextJS
```
npx shadcn-ui@latest init
```

* Layout Config pasta App.
```
import { cn } from "@/lib/utils" // config
```

```
<html lang="pt-BR"> <br>
    <body className={cn( // config <br>
        "min-h-screen bg-background font-sans antialiased", inter.className <br>
        )}>{children} <br>
    </body> <br>
</html>
```

#### Instalando compononents

#### Testando primeiro components
```
{/* default, destructive, ghost, outline, link,  secondary */} <br>
<Button variant="outline" className='bg-blue-400 text-white'>Entrar</Button>
```
#### Ref. 
* Matheus Fraga
```
https://www.youtube.com/watch?v=PqRe0Q9b5QI
```

#### Narração do roteiro
* 1. criando o projeto

* 2. adicionado o shad-cn-ui
    *** 3:50 ao 7:10 ***

* 3. adicionando components
   Button  *** 7:12 ***
   Card    *** 8:42 ***
   Avatar  *** 8:55 ***
   Sheet   *** 9:08 ***
   Tooltip *** 9:25 ***
   Input   *** 9:45 ***
   Dropdown Menu *** 9:56 ***

* 3. extras
    Dialog
    Hover card
    Alert Dialog

* 4. Iniciando projeto
    Limpando *** 10:25 ***

* 4.1 Primeiro component Header /components/sidebar
    Sider-bar *** 10:50 *** iniciando
    Sider-bar *** 15:38 *** Funcionando
    Sider-bar *** 15:45 *** Lucid-Icons
    ```
    npm install lucide-react
    ```
    Sider-bar *** 16:55 *** Menu Mobile
    Sider-bar *** 36:00 *** Menu Web Lateral

##### conteúdo do side-bar
```
```

##### Supabase
```
npm install @supabase/supabase-js
```
