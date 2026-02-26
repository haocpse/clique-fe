import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { partnerService } from "@/services/partner.service";
import type { PartnerResponse, MatchSchedule, PartnerCreateRequest } from "@/types";
import { getImageUrl } from "@/utils/profile";

const PartnerProfile = () => {
  const [partner, setPartner] = useState<PartnerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "schedule">("profile");
  const [schedules, setSchedules] = useState<MatchSchedule[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PartnerCreateRequest>>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await partnerService.getPartnerMe();
        if (res.data?.data) {
          setPartner(res.data.data);
          setImages(res.data.data.images?.map((img) => ({ id: img.id, url: img.imageUrl })) || []);
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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    if (partner) {
      setEditForm({
        organizationName: partner.organizationName,
        description: partner.description,
        phone: partner.phone,
        website: partner.website,
        address: partner.address,
      });
      setImages(partner.images?.map((img) => ({ id: img.id, url: img.imageUrl })) || []);
    }
    setIsEditing(true);
    setUpdateError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateError("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUpdateLoading(true);
    try {
      const res = await partnerService.uploadImage(file);
      const newImage = res.data.data;
      
      setImages((prev) => [
        ...prev,
        { id: newImage.id, url: newImage.imageUrl },
      ]);
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const removeImage = async (indexToRemove: number) => {
    const imgToRemove = images[indexToRemove];
    setUpdateLoading(true);
    try {
      await partnerService.deleteImage(imgToRemove.id);
      setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || "Failed to delete image.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner?.id) return;
    
    setUpdateLoading(true);
    setUpdateError("");

    try {
      const updatedData: Partial<PartnerCreateRequest> = {
        ...editForm,
        imageIds: images.map(img => img.id)
      };
      
      const res = await partnerService.updatePartner(partner.id, updatedData);
      if (res.data?.data) {
        setPartner(res.data.data);
        setIsEditing(false);
      }
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdateLoading(false);
    }
  };

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
            <div className="text-white/90 p-6 border border-white/10 bg-white/5 rounded-xl text-left relative">
              {loading ? (
              <p className="text-center text-white/50">Loading profile...</p>
            ) : partner ? (
              isEditing ? (
                <form onSubmit={handleUpdateSubmit} className="space-y-6">
                  {updateError && <div className="text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-sm">{updateError}</div>}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/50 text-sm mb-1">Organization Name</label>
                      <input 
                        type="text" name="organizationName" value={editForm.organizationName || ''} onChange={handleEditChange} required
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-sm mb-1">Description</label>
                      <textarea 
                        name="description" value={editForm.description || ''} onChange={handleEditChange} rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-sm mb-1">Phone</label>
                      <input 
                        type="text" name="phone" value={editForm.phone || ''} onChange={handleEditChange} required
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-sm mb-1">Website</label>
                      <input 
                        type="text" name="website" value={editForm.website || ''} onChange={handleEditChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-sm mb-1">Address</label>
                      <input 
                        type="text" name="address" value={editForm.address || ''} onChange={handleEditChange} required
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <label className="block text-white/50 text-sm mb-2">Facility Images</label>
                      <div className="flex items-center justify-center w-full mb-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-2 text-white/50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="text-sm text-white/50 font-semibold">Click to upload images</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={updateLoading}/>
                        </label>
                      </div>

                      {images.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          {images.map((img, idx) => (
                            <div key={img.id} className="aspect-square rounded-lg overflow-hidden border border-white/10 relative group">
                              <img src={getImageUrl(img.url)} alt="preview" className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => removeImage(idx)}
                                disabled={updateLoading}
                                className="absolute top-2 right-2 bg-red-500/80 text-white w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4 border-t border-white/10">
                    <button 
                      type="submit" 
                      disabled={updateLoading}
                      className="px-6 py-2 bg-gold text-black font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCancelEdit}
                      disabled={updateLoading}
                      className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {!isEditing && (
                    <button 
                      onClick={handleEditClick}
                      className="absolute top-6 right-6 px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-all"
                    >
                      Edit Profile
                    </button>
                  )}
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
                    <div className="w-2/3 whitespace-pre-wrap">{partner.description || '--'}</div>
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
                              src={getImageUrl(img.imageUrl)} 
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
              )
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

