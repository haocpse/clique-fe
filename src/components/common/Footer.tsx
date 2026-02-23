const Footer = () => {
  return (
    <footer className="px-6 py-16 lg:px-10 border-t border-gold/20">
      <div className="mx-auto max-w-7xl">
        {/* GRID */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* ───────── Column 1 ───────── */}
          {/* Logo + Slogan */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/clique_logo.jpg"
                alt="Clique Logo"
                className="
                  h-38 w-40 rounded-xl object-cover
                  ring-2 ring-gold/30
                  shadow-lg shadow-gold/10
                "
              />
            </div>
            <p className="text-sm italic text-slate-400 max-w-xs">
              The future of dating is offline.
            </p>
          </div>

          {/* ───────── Column 2 ───────── */}
          {/* Features */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold">
              Features
            </h3>

            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li className="hover:text-white transition cursor-pointer">
                Smart Matching
              </li>

              <li className="hover:text-white transition cursor-pointer">
                Interest Hubs
              </li>

              <li className="hover:text-white transition cursor-pointer">
                Events & Meetups
              </li>

              <li className="hover:text-white transition cursor-pointer">
                Premium Membership
              </li>

              <li className="hover:text-white transition cursor-pointer">
                Privacy First
              </li>
            </ul>
          </div>

          {/* ───────── Column 3 ───────── */}
          {/* Social Media */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold">
              Social
            </h3>

            <div className="flex items-center gap-4">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="
                  group flex h-10 w-10 items-center justify-center
                  rounded-full border border-white/10
                  text-slate-400 transition-all
                  hover:border-gold/50
                  hover:text-gold
                  hover:shadow-md
                  hover:shadow-gold/10
                "
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="
                  group flex h-10 w-10 items-center justify-center
                  rounded-full border border-white/10
                  text-slate-400 transition-all
                  hover:border-gold/50
                  hover:text-gold
                  hover:shadow-md
                  hover:shadow-gold/10
                "
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="#"
                aria-label="TikTok"
                className="
                  group flex h-10 w-10 items-center justify-center
                  rounded-full border border-white/10
                  text-slate-400 transition-all
                  hover:border-gold/50
                  hover:text-gold
                  hover:shadow-md
                  hover:shadow-gold/10
                "
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
            © 2026 CLIQUE CONNECTION CO., LTD
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
