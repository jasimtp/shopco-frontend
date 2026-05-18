import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import styles from "./Auth.module.css";
import { registerUser } from "../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const name = (form.elements[0] as HTMLInputElement).value;
    const email = (form.elements[1] as HTMLInputElement).value;
    const password = (form.elements[2] as HTMLInputElement).value;
    const confirmPassword = (form.elements[3] as HTMLInputElement).value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        name,
        email,
        password,
      });

      alert("Registered successfully");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.left}>
          <div className={styles.logoBadge}>S</div>
          <h1>Create Account</h1>
          <p>
            Join SHOP.CO and enjoy exclusive offers, fast checkout, and order
            tracking.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleRegister}>
          <h2>Register</h2>

          <label>Full Name</label>
          <div className={styles.inputBox}>
            <User size={18} />
            <input type="text" placeholder="Enter your name" required />
          </div>

          <label>Email Address</label>
          <div className={styles.inputBox}>
            <Mail size={18} />
            <input type="email" placeholder="Enter your email" required />
          </div>

          <label>Password</label>
          <div className={styles.inputBox}>
            <Lock size={18} />
            <input type="password" placeholder="Create password" required />
          </div>

          <label>Confirm Password</label>
          <div className={styles.inputBox}>
            <Lock size={18} />
            <input type="password" placeholder="Confirm password" required />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Account <ArrowRight size={18} />
          </button>

          <p className={styles.switchText}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}