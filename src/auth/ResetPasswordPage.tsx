import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import styles from "./Auth.module.css";
import { resetPassword } from "../services/authService";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid reset link");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, { password });

      alert("Password reset successful");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.left}>
          <div className={styles.logoBadge}>S</div>
          <h1>Reset Password</h1>
          <p>Create a new password for your SHOP.CO account.</p>
        </div>

        <form className={styles.form} onSubmit={handleResetPassword}>
          <h2>New Password</h2>

          <label>New Password</label>
          <div className={styles.inputBox}>
            <Lock size={18} />
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label>Confirm Password</label>
          <div className={styles.inputBox}>
            <Lock size={18} />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Reset Password <ArrowRight size={18} />
          </button>

          <p className={styles.switchText}>
            Remember password? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}