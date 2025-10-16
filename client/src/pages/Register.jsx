import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", { email, password });
      setMsg("Registered! Try logging in.");
      setEmail(""); setPassword("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.error || "Error");
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <input className="border w-full mb-2 p-2" type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border w-full mb-4 p-2" type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-indigo-600 text-white px-4 py-2 rounded" type="submit">Register</button>
      {msg && <p className="mt-2 text-red-500">{msg}</p>}
    </form>
  );
}
