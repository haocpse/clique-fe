import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const PartnerProfile = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-black/90 p-5">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl w-full text-center shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2 italic">Partner Info</h1>
          <p className="text-white/50 mb-8">Manage your organization details here.</p>
          <div className="text-white/80 p-4 border border-gold/30 bg-gold/5 rounded-lg">
            Profile details will go here.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PartnerProfile;
