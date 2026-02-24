const HomePage = () => {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              <h1 className="text-6xl font-extrabold leading-[1.05] tracking-tight text-white lg:text-8xl">
                Come connect <span className="text-gold">Clique.</span>
              </h1>
              <p className="max-w-[500px] text-lg leading-relaxed text-slate-400">
                A space to meet people who share your vibe, your interests, and
                maybe your heart.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] w-full rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
                <div className="h-full w-full overflow-hidden rounded-xl transition-all duration-700">
                  <img
                    alt="Connection"
                    className="h-full w-full object-cover"
                    src="/profile_clique83.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="px-6 py-24 lg:px-10 border-y border-white/5"
        id="features"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="group flex flex-col gap-6">
              <h3 className="text-xl font-bold">Smart Matching</h3>
              <p className="text-slate-500 leading-relaxed">
                Suggestions based on shared core values and niche interests, not
                just mutual friends.
              </p>
            </div>
            <div className="group flex flex-col gap-6">
              <h3 className="text-xl font-bold">Interest Hubs</h3>
              <p className="text-slate-500 leading-relaxed">
                Dedicated, high-quality spaces focused on specific hobbies from
                coding to urbanism.
              </p>
            </div>
            <div className="group flex flex-col gap-6">
              <h3 className="text-xl font-bold">Privacy First</h3>
              <p className="text-slate-500 leading-relaxed">
                A community-moderated environment where your data remains yours,
                always.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
