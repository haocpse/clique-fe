import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants";
import { userService } from "@/services/user.service";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      const res = await userService.getMyProfile();
      let ids: number[];
      if (!res.data.data.profile) {
        navigate(ROUTES.PROFILE_CREATE);
      }
      localStorage.setItem("profile", JSON.stringify(res.data.data));
      if (!res.data.data.swipeOrder) {
        const swipeOrder = await userService.getSwipeOrder(
          res.data.data.refreshSwipeTime!,
        );
        ids = JSON.parse(swipeOrder.data.data);
      } else {
        ids = JSON.parse(res.data.data.swipeOrder);
      }
      localStorage.setItem("swipeOrder", JSON.stringify(ids));
      navigate(ROUTES.DISCOVER);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          {/* Title */}
          <h1 className={styles.title}>Login to Clique</h1>
          <p className={styles.subtitle}>
            Welcome back to the elite social circle.
          </p>

          {error && <div className={styles.error}>{error}</div>}

          {/* Social Login */}
          <div className={styles.socialRow}>
            <button
              type="button"
              className={styles.socialBtn}
              id="google-login-btn"
            >
              <span className={styles.socialIcon}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
              Google
            </button>
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>Or Credentials</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                className={styles.input}
                placeholder="Email Address"
                id="login-email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="Password"
                  id="login-password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.forgotRow}>
              <a href="#" className={styles.forgotLink}>
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className={styles.loginBtn}
              id="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className={styles.footer}>
            Not a member? <Link to={ROUTES.REGISTER}>Join Now</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
