import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";

export default function App() {
  const [session, setSession] = useState(null);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setTodos([]);
      return;
    }

    loadTodos();

    const channel = supabase
      .channel(`todos-changes-${session.user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "todos",
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          loadTodos();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "todos",
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          loadTodos();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "todos",
        },
        () => {
          loadTodos();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  async function loadTodos() {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error) setTodos(data ?? []);
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!text.trim() || !session?.user) return;

    const { error } = await supabase
      .from("todos")
      .insert([{ text: text.trim(), user_id: session.user.id }]);

    if (!error) {
      setText("");
      loadTodos();
    }
  }

  async function deleteTodo(id) {
    if (!session?.user) return;

    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (!error) {
      loadTodos();
    }
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  async function updateTodo(id) {
    if (!session?.user) return;
    const nextText = editingText.trim();
    if (!nextText) return;

    const { error } = await supabase
      .from("todos")
      .update({ text: nextText })
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (!error) {
      cancelEdit();
      loadTodos();
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (!session) return <Auth />;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "12px",
          left: "12px",
          fontSize: "14px",
          color: "#555",
        }}
      >
        {session.user.email}
      </div>

      <div
        style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}
      >
        <h1>Supabase Todo App</h1>
        <button onClick={signOut} style={{ marginBottom: "20px" }}>
          Sign out
        </button>

        <form
          onSubmit={addTodo}
          style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
        >
          <input
            type="text"
            placeholder="Enter a todo"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <button type="submit">Add</button>
        </form>

        <ul style={{ padding: 0, listStyle: "none" }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px 12px",
                marginBottom: "10px",
              }}
            >
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{ flex: 1, padding: "8px" }}
                  />
                  <button type="button" onClick={() => updateTodo(todo.id)}>
                    Save
                  </button>
                  <button type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1 }}>{todo.text}</span>
                  <button type="button" onClick={() => startEdit(todo)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteTodo(todo.id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
