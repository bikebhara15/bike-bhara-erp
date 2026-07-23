"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(e:FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const {error}=await createClient().auth.signInWithPassword({email,password});
    setLoading(false);
    if(error){setError(error.message);return}
    router.push("/dashboard");
  }

  return <div className="login-page">
    <form className="login-card" onSubmit={submit}>
      <Image className="logo" src="/logo.png" width={145} height={115} alt="Logo"/>
      <h1 className="title">বাইক ভাড়া ERP</h1>
      <p className="muted">Owner ও Staff Login</p>
      {error && <div className="error">{error}</div>}
      <label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
      <label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
      <button style={{width:"100%"}} disabled={loading}>{loading?"Logging in...":"Login"}</button>
    </form>
  </div>
}
