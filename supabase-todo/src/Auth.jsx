import { useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function getNormalizedEmail() {
    return email.trim().toLowerCase();
  }

  function isValidEmail(value) {
    return /^\S+@\S+\.\S+$/.test(value);
  }

  async function signUp() {
    const normalizedEmail = getNormalizedEmail();
    if (!isValidEmail(normalizedEmail)) {
      alert("Please enter a valid email like name@example.com");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });
    setLoading(false);
    if (error) alert(error.message);
    else
      alert("Sign-up successful. Check your email if confirmation is enabled.");
  }

  async function signIn() {
    const normalizedEmail = getNormalizedEmail();
    if (!isValidEmail(normalizedEmail)) {
      alert("Please enter a valid email like name@example.com");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    setLoading(false);
    if (error) alert(error.message);
  }

  return (
    <div className="app-shell" style={{ maxWidth: "420px" }}>
      <h2>Login / Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="inline-input"
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="inline-input"
        style={{ display: "block", width: "100%", marginBottom: "12px" }}
      />
      <button
        onClick={signIn}
        disabled={loading}
        className="btn btn-primary"
        style={{ marginRight: "10px" }}
      >
        Sign in
      </button>
      <button onClick={signUp} disabled={loading} className="btn btn-secondary">
        Sign up
      </button>
    </div>
  );
}
