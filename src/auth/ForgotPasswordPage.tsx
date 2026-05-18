import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import styles from "./Auth.module.css";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await forgotPassword({ email });

      alert("Reset link generated");
      setResetLink(res.data.resetLink);
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.left}>
          <div className={styles.logoBadge}>S</div>
          <h1>Forgot Password</h1>
          <p>Enter your email and get a password reset link.</p>
        </div>

        <form className={styles.form} onSubmit={handleForgotPassword}>
          <h2>Reset Link</h2>

          <label>Email Address</label>
          <div className={styles.inputBox}>
            <Mail size={18} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Generate Link <ArrowRight size={18} />
          </button>

          {resetLink && (
            <p className={styles.switchText}>
              Reset Link: <br />
              <Link to={resetLink.replace("http://localhost:5173", "")}>
                Click here to reset password
              </Link>
            </p>
          )}

          <p className={styles.switchText}>
            Remember password? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}