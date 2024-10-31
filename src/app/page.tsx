"use client"

// pages/post.js
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

export default function Home() {

  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [posts, setPosts] = useState([]);

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('gestores')
      .insert([
        { nome, sexo }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Post added:', data);
      setNome('');
      setSexo('');
      fetchPosts(); // Recarrega a lista de posts
    }
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('gestores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data as any);
    }
  };

  useEffect(() => {
    fetchPosts(); // Chama a função ao carregar o componente
  }, []);

  return (
    <main className='p-5 px-28'>
      <h1 className="font-medium text-3xl">Shadcn-UI</h1>

      <div className="listar mr-20">

      <h1> Listar os Gestores </h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nome" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
        />
        <input 
          placeholder="Sexo" 
          value={sexo} 
          onChange={(e) => setSexo(e.target.value)} 
          required 
        />
        <button type="submit">Submit</button>
      </form>

      <h2>Posts</h2>
      <ul>
        {posts.map(item => (
          <li key={item.id}>
            <h3>{item.nome}</h3>
            <p>{item.sexo}</p>
            <small>{new Date(item.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      </div>

    </main>
  );
}
