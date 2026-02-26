import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { partnerService } from "@/services/partner.service";
import type { PartnerResponse } from "@/types";

const PartnerProfile = () => {
  const [partner, setPartner] = useState<PartnerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await partnerService.getPartnerMe();
        if (res.data?.data) {
          setPartner(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch partner profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-black/90 p-5 pt-24">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-[80%] shadow-xl mt-12 mb-12">
          <h1 className="text-3xl font-bold text-gold mb-2 italic">Partner Info</h1>
          <p className="text-white/50 mb-8">Manage your organization details here.</p>
          
          <div className="text-white/90 p-6 border border-white/10 bg-white/5 rounded-xl text-left">
            {loading ? (
              <p className="text-center text-white/50">Loading profile...</p>
            ) : partner ? (
              <div className="space-y-6">
                <div className="flex border-b border-white/10 pb-4">
                  <div className="w-1/3 text-white/50">Organization Name</div>
                  <div className="w-2/3 font-semibold text-white">{partner.organizationName}</div>
                </div>
                <div className="flex border-b border-white/10 pb-4">
                  <div className="w-1/3 text-white/50">Status</div>
                  <div className="w-2/3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      partner.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      partner.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {partner.status || 'PENDING'}
                    </span>
                  </div>
                </div>
                <div className="flex border-b border-white/10 pb-4">
                  <div className="w-1/3 text-white/50">Description</div>
                  <div className="w-2/3">{partner.description || '--'}</div>
                </div>
                <div className="flex border-b border-white/10 pb-4">
                  <div className="w-1/3 text-white/50">Phone</div>
                  <div className="w-2/3">{partner.phone || '--'}</div>
                </div>
                <div className="flex border-b border-white/10 pb-4">
                  <div className="w-1/3 text-white/50">Website</div>
                  <div className="w-2/3">
                    {partner.website ? (
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                        {partner.website}
                      </a>
                    ) : (
                      '--'
                    )}
                  </div>
                </div>
                <div className="flex border-b border-white/10 pb-4">
                  <div className="w-1/3 text-white/50">Address</div>
                  <div className="w-2/3">{partner.address || '--'}</div>
                </div>
                {partner.images && partner.images.length > 0 && (
                  <div className="flex flex-col pt-2">
                    <div className="text-white/50 mb-4">Gallery Images</div>
                    <div className="grid grid-cols-3 gap-4">
                      {partner.images.map((img) => (
                        <div key={img.id} className="aspect-square rounded-lg overflow-hidden border border-white/10 relative">
                          <img 
                            src={img.imageUrl} 
                            alt={`Gallery ${img.id}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a1a1a/gold?text=Image';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-white/50">No partner profile found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PartnerProfile;

