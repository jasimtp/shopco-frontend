import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { login } from "../redux/authSlice";
import styles from "./Auth.module.css";
import { loginUser } from "../services/authService";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await loginUser({ email, password });

      dispatch(
        login({
          user: res.data.user,
          token: res.data.token,
        })
      );

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <main className={styles.authPage}>
      <section className={styles.authCard}>
        <div className={styles.left}>
          <div className={styles.logoBadge}>S</div>
          <h1>SHOP.CO</h1>
          <p>
            Login to continue shopping, track your orders, and manage your
            account.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          <h2>Login</h2>

          <label>Email Address</label>
          <div className={styles.inputBox}>
            <Mail size={18} />
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <label>Password</label>
          <div className={styles.inputBox}>
            <Lock size={18} />
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className={styles.options}>
            <span>
              <input type="checkbox" /> Remember me
            </span>
<Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Login <ArrowRight size={18} />
          </button>

          <p className={styles.switchText}>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </section>
    </main>
  );
}