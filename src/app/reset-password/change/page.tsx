// src/app/reset-password/change/page.tsx
"use client";

import { Suspense, useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.scss";

function ChangePasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (!emailParam) {
      setError("Invalid reset link. Please go back and enter your email.");
      return;
    }
    
    setEmail(emailParam);
  }, [searchParams]);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    setMessage("");
    
    // Validate form
    if (!password.trim() || !confirmPassword.trim()) {
      setError("Please fill in both password fields.");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/reset-password-by-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email,
          password 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 400) {
          setError(data.error || "Please check your password.");
        } else if (response.status === 404) {
          setError("No account found with this email address.");
        } else if (response.status === 429) {
          setError("Too many password change attempts. Please try again later.");
        } else {
          setError(data.error || "Failed to reset password. Please try again.");
        }
        return;
      }
      
      setMessage("Password successfully reset! You can now sign in with your new password.");
      setPassword("");
      setConfirmPassword("");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError("Network error. Please check your connection and try again.");
      console.error("Password change error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email && !error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Loading...</h1>
          <div className={styles.message}>Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Change Password</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.message}>{message}</div>}

        {email && !message && (
          <>
            <div className={styles.emailInfo}>
              <p>Changing password for: <strong>{email}</strong></p>
            </div>
            
            <form onSubmit={handleChangePassword}>
              <div className={styles.field}>
                <label className={styles.label}>New Password</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>

              <button 
                type="submit" 
                className={styles.resetBtn}
                disabled={isLoading}
              >
                {isLoading ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          </>
        )}

        <Link href="/login" className={styles.backLink}>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense>
      <ChangePasswordContent />
    </Suspense>
  );
}
