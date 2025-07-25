// src/app/signup/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { supabase } from '@/lib/supabaseClient';

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [, setUser] = useLocalStorage<{ email: string } | null>(
    'pl_user',
    null
  );

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    // Validate form
    if (!email.trim() || !password.trim()) {
      setError("Please fill both email and password.");
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Signup via Supabase Auth
      const { data, error: supaError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (supaError) {
        if (supaError.message.includes('User already registered')) {
          setError("An account with this email already exists. Please try signing in instead.");
        } else {
          setError(supaError.message);
        }
        return;
      }
      
      // Set user in local storage with email
      setUser({ email });
      
      // Redirect ke halaman verifikasi atau request course
      router.push("/request-course/step1");
    } catch (err: any) {
      setError("Network error. Please check your connection and try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Sign up to learn</h1>
        
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSignUp}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className={styles.signUpBtn}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <Link href="/login" className={styles.backLink}>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
