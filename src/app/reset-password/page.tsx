// src/app/reset-password/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.scss";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/validate-email-for-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("No account found with this email address.");
        } else if (response.status === 429) {
          setError("Too many attempts. Please try again later.");
        } else {
          setError(data.error || "Failed to validate email. Please try again.");
        }
        return;
      }
      
      // Email exists, redirect to change password page
      router.push(`/reset-password/change?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError("Network error. Please check your connection and try again.");
      console.error("Email validation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Reset Password</h1>
        
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleReset}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className={styles.resetBtn}
            disabled={isLoading}
          >
            {isLoading ? "Validating..." : "Continue"}
          </button>
        </form>

        <Link href="/login" className={styles.backLink}>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
