import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="glass-header sticky top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
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
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden sm:flex text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/login"
            className="rounded-full bg-gradient-to-r from-gold to-gold-soft px-6 py-2.5 text-sm font-bold text-black hover:brightness-110 transition-all shadow-lg shadow-gold/20"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
