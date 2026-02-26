import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { partnerService } from "@/services/partner.service";
import type { PartnerResponse, MatchSchedule } from "@/types";

const PartnerProfile = () => {
  const [partner, setPartner] = useState<PartnerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "schedule">("profile");
  const [schedules, setSchedules] = useState<MatchSchedule[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);

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

  useEffect(() => {
    if (activeTab === "schedule") {
      const fetchSchedules = async () => {
        setSchedulesLoading(true);
        try {
          const res = await partnerService.getPartnerSchedules();
          if (res.data?.data) {
            setSchedules(res.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch partner schedules", error);
        } finally {
          setSchedulesLoading(false);
        }
      };
      fetchSchedules();
    }
  }, [activeTab]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-black/90 p-5 pt-24">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-[80%] shadow-xl mt-12 mb-12">
          <h1 className="text-3xl font-bold text-gold mb-2 italic">Partner Info</h1>
          <p className="text-white/50 mb-8">Manage your organization details here.</p>
          
          <div className="flex space-x-4 mb-6">
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-gold text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'schedule' ? 'bg-gold text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedules
            </button>
          </div>

          {activeTab === 'profile' && (
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
          )}

          {activeTab === 'schedule' && (
            <div className="text-white/90 p-6 border border-white/10 bg-white/5 rounded-xl text-left">
              {schedulesLoading ? (
                <p className="text-center text-white/50">Loading schedules...</p>
              ) : schedules.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(
                    schedules.reduce((acc, schedule) => {
                      const date = new Date(schedule.scheduledAt).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                      if (!acc[date]) acc[date] = [];
                      acc[date].push(schedule);
                      return acc;
                    }, {} as Record<string, MatchSchedule[]>)
                  ).map(([date, daySchedules]) => (
                    <div key={date}>
                      <h3 className="text-lg font-bold text-gold mb-3 border-b border-white/10 pb-2">{date}</h3>
                      <div className="space-y-3">
                        {daySchedules.map(schedule => (
                          <div key={schedule.id} className="p-4 rounded-lg bg-black/40 border border-white/10 flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="font-semibold text-white/90">
                                {new Date(schedule.scheduledAt).toLocaleTimeString(undefined, {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                schedule.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                schedule.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                schedule.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              }`}>{schedule.status}</span>
                            </div>
                            <div className="text-sm text-white/80"><span className="text-white/40">Location:</span> {schedule.location}</div>
                            {schedule.message && <div className="text-sm text-white/80"><span className="text-white/40">Message:</span> {schedule.message}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-white/50">No schedules found.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PartnerProfile;

