import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setAuth(true);
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.error || "Error");
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input className="border w-full mb-2 p-2" type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border w-full mb-4 p-2" type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-indigo-600 text-white px-4 py-2 rounded" type="submit">Login</button>
      {msg && <p className="mt-2 text-red-500">{msg}</p>}
    </form>
  );
}
