import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Auth from './Auth'

export default function App() {
  const [session, setSession] = useState(null)
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return

    loadTodos()

    const channel = supabase
      .channel('todos-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        () => {
          loadTodos()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  async function loadTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setTodos(data ?? [])
  }

  async function addTodo(e) {
    e.preventDefault()
    if (!text.trim() || !session?.user) return

    const { error } = await supabase
      .from('todos')
      .insert([{ text: text.trim(), user_id: session.user.id }])

    if (!error) {
      setText('')
      loadTodos()
    }
  }

  async function deleteTodo(id) {
    if (!session?.user) return

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (!error) {
      loadTodos()
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  if (!session) return <Auth />

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Supabase Todo App</h1>
      <button onClick={signOut} style={{ marginBottom: '20px' }}>Sign out</button>

      <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a todo"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ padding: 0, listStyle: 'none' }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '10px',
            }}
          >
            <span>{todo.text}</span>
            <button type="button" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}