import { useState } from 'react'
import { supabase } from './supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function getNormalizedEmail() {
    return email.trim().toLowerCase()
  }

  function isValidEmail(value) {
    return /^\S+@\S+\.\S+$/.test(value)
  }

  async function signUp() {
    const normalizedEmail = getNormalizedEmail()
    if (!isValidEmail(normalizedEmail)) {
      alert('Please enter a valid email like name@example.com')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email: normalizedEmail, password })
    setLoading(false)
    if (error) alert(error.message)
    else alert('Sign-up successful. Check your email if confirmation is enabled.')
  }

  async function signIn() {
    const normalizedEmail = getNormalizedEmail()
    if (!isValidEmail(normalizedEmail)) {
      alert('Please enter a valid email like name@example.com')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
    setLoading(false)
    if (error) alert(error.message)
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Login / Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <button onClick={signIn} disabled={loading} style={{ marginRight: '10px' }}>
        Sign in
      </button>
      <button onClick={signUp} disabled={loading}>
        Sign up
      </button>
    </div>
  )
}