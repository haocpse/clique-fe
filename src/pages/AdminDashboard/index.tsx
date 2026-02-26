import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const AdminDashboard = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-black/95 p-5">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl w-full shadow-2xl">
          <h1 className="text-4xl font-bold text-gold mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-white/60 mb-6">System Management & Partner Approvals.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
              <h3 className="text-xl text-white font-semibold">Total Partners</h3>
              <p className="text-3xl font-bold text-gold mt-2">--</p>
            </div>
            <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
              <h3 className="text-xl text-white font-semibold">Pending Approvals</h3>
              <p className="text-3xl font-bold text-red-400 mt-2">--</p>
            </div>
            <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
              <h3 className="text-xl text-white font-semibold">Total Users</h3>
              <p className="text-3xl font-bold text-blue-400 mt-2">--</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
