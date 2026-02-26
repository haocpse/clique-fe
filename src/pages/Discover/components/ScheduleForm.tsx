import { useState, useEffect } from "react";
import type { MatchSchedule } from "@/types";
import type { ScheduleRequest } from "@/services/match.service";
import { partnerService } from "@/services/partner.service";
import type { PartnerResponse } from "@/types";

interface ScheduleFormProps {
  editingSchedule: MatchSchedule | null;
  scheduleForm: ScheduleRequest;
  setScheduleForm: React.Dispatch<React.SetStateAction<ScheduleRequest>>;
  scheduleError: string;
  scheduleSaving: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  styles: Record<string, string>;
}

const ScheduleForm = ({
  editingSchedule,
  scheduleForm,
  setScheduleForm,
  scheduleError,
  scheduleSaving,
  onSubmit,
  onCancel,
  styles,
}: ScheduleFormProps) => {
  const [partners, setPartners] = useState<PartnerResponse[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await partnerService.getAllPartners();
        if (res.data?.data) {
          setPartners(res.data.data.filter((p) => p.status === "APPROVED"));
        }
      } catch (error) {
        console.error("Failed to fetch partners", error);
      }
    };
    fetchPartners();
  }, []);

  const selectedPartner = partners.find(p => p.id === scheduleForm.partnerId);

  return (
    <div
      className={styles.matchPopupOverlay}
      style={{ zIndex: 4000 }}
      onClick={onCancel}
    >
      <div className={styles.matchPopup} style={{ maxWidth: '80%', width: '80%' }} onClick={(e) => e.stopPropagation()}>
        <h3
          className={styles.matchPopupTitle}
          style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}
        >
          {editingSchedule ? "Edit Schedule" : "New Schedule"}
        </h3>

        <div
          className={styles.scheduleFormFields}
          style={{ textAlign: "left", marginBottom: "1.5rem" }}
        >
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Scheduled At *</label>
            <input
              type="datetime-local"
              className={styles.formInput}
              value={scheduleForm.scheduledAt}
              onChange={(e) =>
                setScheduleForm((f) => ({
                  ...f,
                  scheduledAt: e.target.value,
                }))
              }
            />
          </div>
          <div className={styles.formGroup} style={{ marginTop: "0.85rem" }}>
            <label className={styles.formLabel}>Location *</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. THU DUC"
              value={scheduleForm.location}
              onChange={(e) =>
                setScheduleForm((f) => ({
                  ...f,
                  location: e.target.value,
                }))
              }
            />
          </div>
          <div className={styles.formGroup} style={{ marginTop: "0.85rem" }}>
            <label className={styles.formLabel}>Message</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Optional message"
              value={scheduleForm.message}
              onChange={(e) =>
                setScheduleForm((f) => ({
                  ...f,
                  message: e.target.value,
                }))
              }
            />
          </div>
          <div className={styles.formGroup} style={{ marginTop: "0.85rem" }}>
            <label className={styles.formLabel}>Partner (Optional)</label>
            <select
              className={styles.formInput}
              value={scheduleForm.partnerId || ""}
              onChange={(e) =>
                setScheduleForm((f) => ({
                  ...f,
                  partnerId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            >
              <option value="">Select a partner</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.organizationName}
                </option>
              ))}
            </select>
          </div>
          
          {selectedPartner && (
            <div className={styles.partnerPreview} style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "12px", border: "1px solid rgba(243, 206, 131, 0.2)" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                {selectedPartner.images && selectedPartner.images.length > 0 && (
                  <img 
                    src={selectedPartner.images[0].imageUrl} 
                    alt={selectedPartner.organizationName} 
                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                )}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h4 style={{ margin: "0 0 0.5rem", color: "#f3ce83", fontSize: "1rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {selectedPartner.organizationName}
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "flex-start", gap: "0.5rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <span style={{ marginTop: "2px" }}>📍</span> 
                    {selectedPartner.address || "No address provided"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {scheduleError && (
          <div
            className={styles.scheduleFormError}
            style={{ marginBottom: "1rem" }}
          >
            {scheduleError}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            className={styles.scheduleFormCancel}
            onClick={onCancel}
            disabled={scheduleSaving}
          >
            Cancel
          </button>
          <button
            className={styles.scheduleFormSave}
            onClick={onSubmit}
            disabled={scheduleSaving}
          >
            {scheduleSaving
              ? "Saving..."
              : editingSchedule
                ? "Update"
                : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
