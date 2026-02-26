import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const storedUser = localStorage.getItem("profile");
  let displayName = user?.email;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      displayName = parsed?.profile?.displayName;
    } catch (err) {
      console.log(err);
    }
  }

  const initial = displayName?.charAt(0)?.toUpperCase() || "?";

  return (
    <header className="glass-header sticky top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
            <img
              alt="Clique"
              className="h-full w-full object-cover"
              src="/profile_clique83.png"
            />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Clique
          </h2>
        </Link>

        {user && (
          <nav className="hidden md:flex gap-6">
            <Link
              to="/discover"
              className="text-sm font-semibold text-slate-300 hover:text-white transition"
            >
              Discover
            </Link>
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-4 relative">
          {/* ───── Guest ───── */}
          {!user && (
            <>
              <Link
                to="/login"
                className="hidden sm:flex text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/partner/register"
                className="rounded-full bg-gradient-to-r from-gold to-gold-soft px-6 py-2.5 text-sm font-bold text-black hover:brightness-110 transition-all shadow-lg shadow-gold/20"
              >
                Become Partner
              </Link>
            </>
          )}

          {/* ───── Logged in ───── */}
          {user && (
            <div className="relative">
              {/* Avatar + Name */}
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20 transition"
              >
                {/* Avatar default */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold">
                  {initial}
                </div>

                {/* Name */}
                <span className="text-sm font-semibold text-white">
                  {user.email}
                </span>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-44 rounded-xl bg-black/90 backdrop-blur border border-white/10 shadow-xl overflow-hidden">
                  <button
                    onClick={() => {
                      navigate("/profile/me");
                      setOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 transition"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-white/10 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
