import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { partnerService } from "@/services/partner.service";
import type { PartnerResponse, PartnerOverviewResponse } from "@/types";
import { getImageUrl } from "@/utils/profile";

const AdminDashboard = () => {
  const [partners, setPartners] = useState<PartnerResponse[]>([]);
  const [overview, setOverview] = useState<PartnerOverviewResponse>({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [overviewRes, partnersRes] = await Promise.all([
        partnerService.getPartnerOverview(),
        partnerService.getAllPartners(),
      ]);
      if (overviewRes.data?.data) {
        setOverview(overviewRes.data.data);
      }
      if (partnersRes.data?.data) {
        setPartners(partnersRes.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      await partnerService.updatePartnerStatus(id, action);
      // Refresh data
      fetchData();
      // Also update selected partner status if modal is open
      if (selectedPartner && selectedPartner.id === id) {
        setSelectedPartner({ ...selectedPartner, status: action === 'approve' ? 'approve' : 'reject' });
      }
    } catch (error) {
      console.error(`Failed to ${action} partner`, error);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      setIsModalOpen(true);
      setLoadingDetail(true);
      const res = await partnerService.getPartnerById(id);
      if (res.data?.data) {
        setSelectedPartner(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch partner details", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-black/95 p-5 pt-24">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-[80%] shadow-2xl mt-12 mb-12 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-bold text-gold mb-2 tracking-tight">Admin Dashboard</h1>
            <p className="text-white/60">System Management & Partner Approvals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
              <h3 className="text-xl text-white font-semibold">Total Partners</h3>
              <p className="text-3xl font-bold text-gold mt-2">
                {overview.pending + overview.approved + overview.rejected}
              </p>
            </div>
            <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
              <h3 className="text-xl text-white font-semibold">Approved</h3>
              <p className="text-3xl font-bold text-green-400 mt-2">{overview.approved}</p>
            </div>
            <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
              <h3 className="text-xl text-white font-semibold">Pending</h3>
              <p className="text-3xl font-bold text-yellow-400 mt-2">{overview.pending}</p>
            </div>
            <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
              <h3 className="text-xl text-white font-semibold">Rejected</h3>
              <p className="text-3xl font-bold text-red-400 mt-2">{overview.rejected}</p>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-white mb-4">Partner Requests</h2>
            {loading ? (
              <p className="text-white/60">Loading requests...</p>
            ) : partners.length === 0 ? (
              <p className="text-white/60">No partners found.</p>
            ) : (
              <div className="space-y-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="p-5 border border-white/10 bg-white/5 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h3 className="text-xl text-gold font-semibold">{partner.organizationName}</h3>
                      <p className="text-white/70 text-sm mt-1">{partner.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-white/50">
                        <span>Email: {partner.user?.email}</span>
                        <span>Phone: {partner.phone}</span>
                        <span>Status: <span className={`font-semibold ${partner.status === 'PENDING' ? 'text-yellow-400' : partner.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{partner.status || 'PENDING'}</span></span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewDetails(partner.id)}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        View Details
                      </button>
                      {(!partner.status || partner.status === 'PENDING') && (
                        <>
                          <button
                            onClick={() => handleAction(partner.id, "approve")}
                            className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(partner.id, "reject")}
                            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Partner Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-[80%] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#1a1a1a] z-10">
              <h2 className="text-2xl font-bold text-gold">Partner Details</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPartner(null);
                }}
                className="text-white/50 hover:text-white transition-colors text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-8">
              {loadingDetail ? (
                <p className="text-center text-white/50 py-12">Loading details...</p>
              ) : selectedPartner ? (
                <div className="space-y-6 text-white/90">
                  <div className="flex border-b border-white/10 pb-4">
                    <div className="w-1/4 text-white/50">Organization Name</div>
                    <div className="w-3/4 font-semibold text-white text-lg">{selectedPartner.organizationName}</div>
                  </div>
                  <div className="flex border-b border-white/10 pb-4">
                    <div className="w-1/4 text-white/50">Status</div>
                    <div className="w-3/4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedPartner.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        selectedPartner.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {selectedPartner.status || 'PENDING'}
                      </span>
                    </div>
                  </div>
                  <div className="flex border-b border-white/10 pb-4">
                    <div className="w-1/4 text-white/50">Contact Email</div>
                    <div className="w-3/4">{selectedPartner.user?.email || '--'}</div>
                  </div>
                  <div className="flex border-b border-white/10 pb-4">
                    <div className="w-1/4 text-white/50">Description</div>
                    <div className="w-3/4 whitespace-pre-wrap">{selectedPartner.description || '--'}</div>
                  </div>
                  <div className="flex border-b border-white/10 pb-4">
                    <div className="w-1/4 text-white/50">Phone</div>
                    <div className="w-3/4">{selectedPartner.phone || '--'}</div>
                  </div>
                  <div className="flex border-b border-white/10 pb-4">
                    <div className="w-1/4 text-white/50">Website</div>
                    <div className="w-3/4">
                      {selectedPartner.website ? (
                        <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          {selectedPartner.website}
                        </a>
                      ) : (
                        '--'
                      )}
                    </div>
                  </div>
                  <div className="flex border-b border-white/10 pb-4">
                    <div className="w-1/4 text-white/50">Address</div>
                    <div className="w-3/4">{selectedPartner.address || '--'}</div>
                  </div>
                  
                  {selectedPartner.images && selectedPartner.images.length > 0 && (
                    <div className="flex flex-col pt-4">
                      <div className="text-white/50 mb-4 text-lg border-b border-white/10 pb-2">Gallery Images</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {selectedPartner.images.map((img) => (
                          <div key={img.id} className="aspect-square rounded-lg overflow-hidden border border-white/10 relative group">
                            <img 
                              src={getImageUrl(img.imageUrl)} 
                              alt={`Gallery ${img.id}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a1a1a/gold?text=Image';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions inside modal if pending */}
                  {(!selectedPartner.status || selectedPartner.status === 'PENDING') && (
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-white/10">
                      <button
                        onClick={() => handleAction(selectedPartner.id, "reject")}
                        className="px-6 py-2.5 bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-colors font-medium"
                      >
                        Reject Partner
                      </button>
                      <button
                        onClick={() => handleAction(selectedPartner.id, "approve")}
                        className="px-6 py-2.5 bg-green-500/20 text-green-500 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-colors font-medium"
                      >
                        Approve Partner
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-white/50 py-12">No data found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AdminDashboard;

