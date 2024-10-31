// pages/post.js
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

export default function Listar() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { title, content }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Post added:', data);
      setTitle('');
      setContent('');
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
    <div>
      <h1>Create a Post</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
        />
        <button type="submit">Submit</button>
      </form>

      <h2>Posts</h2>
      <ul className='m-10 bg-blue-600'>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>{new Date(post.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
