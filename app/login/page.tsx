"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("bikebhara15@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("Supabase URL অথবা Publishable Key পাওয়া যায়নি।");
      return;
    }

    setLoading(true);

    try {
      const timeout = new Promise<never>((_, reject) => {
        window.setTimeout(
          () => reject(new Error("Login request timed out after 20 seconds.")),
          20000
        );
      });

      const loginRequest = supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      const { data, error } = await Promise.race([loginRequest, timeout]);

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.session) {
        setMessage("Login সফল হয়নি। Supabase user এবং password আবার পরীক্ষা করুন।");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login করার সময় অজানা সমস্যা হয়েছে।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <Image
          className="logo"
          src="/logo.png"
          alt="Bike Bhara"
          width={145}
          height={115}
          priority
        />

        <h1 className="title">বাইক ভাড়া ERP</h1>
        <p className="muted">Owner ও Staff Login</p>

        {message && <div className="error">{message}</div>}

        <label>
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button style={{ width: "100%" }} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
