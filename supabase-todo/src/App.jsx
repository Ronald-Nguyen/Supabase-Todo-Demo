import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function App() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading todos:', error)
      return
    }

    setTodos(data)
  }

  async function addTodo(e) {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)

    const { error } = await supabase
      .from('todos')
      .insert([{ text: text.trim() }])

    setLoading(false)

    if (error) {
      console.error('Error adding todo:', error)
      return
    }

    setText('')
    loadTodos()
  }

  useEffect(() => {
    loadTodos()
  }, [])

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Supabase Todo App</h1>

      <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a todo"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add'}
        </button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}