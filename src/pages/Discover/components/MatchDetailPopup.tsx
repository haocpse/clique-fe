import { useState } from "react";
import type { MatchItem, MatchSchedule } from "@/types";
import type { ScheduleRequest } from "@/services/match.service";
import { matchService } from "@/services/match.service";
import { getDisplayName } from "@/utils/profile";
import ProfileView from "@/components/ui/ProfileView";
import ScheduleForm from "./ScheduleForm";
import ScheduleList from "./ScheduleList";

interface MatchDetailPopupProps {
  detailMatch: MatchItem;
  setDetailMatch: (match: MatchItem | null) => void;
  /** Update matches list when schedule changes */
  onMatchUpdate: (updatedMatch: MatchItem) => void;
  /** Remove match from list when unmatched */
  onMatchRemove: (matchId: number) => void;
  styles: Record<string, string>;
}

const MatchDetailPopup = ({
  detailMatch,
  setDetailMatch,
  onMatchUpdate,
  onMatchRemove,
  styles,
}: MatchDetailPopupProps) => {
  const [detailLightboxIdx, setDetailLightboxIdx] = useState<number | null>(
    null,
  );
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<MatchSchedule | null>(
    null,
  );
  const [scheduleForm, setScheduleForm] = useState<ScheduleRequest>({
    scheduledAt: "",
    location: "",
    message: "",
  });
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleError, setScheduleError] = useState("");

  const [cancelScheduleItem, setCancelScheduleItem] =
    useState<MatchSchedule | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelSaving, setCancelSaving] = useState(false);

  const user = detailMatch.user;
  const profile = user.profile;
  const displayName = getDisplayName(profile);

  const getStatusClass = (status: string): string => {
    const map: Record<string, string> = {
      AUTO: styles.badgeAuto,
      PENDING: styles.badgePending,
      CONFIRMED: styles.badgeConfirmed,
      CANCELLED: styles.badgeCancelled,
      COMPLETED: styles.badgeCompleted,
    };
    return map[status] || "";
  };

  const openAddSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({ scheduledAt: "", location: "", message: "" });
    setScheduleError("");
    setCancelScheduleItem(null);
    setShowScheduleForm(true);
  };

  const openEditSchedule = (schedule: MatchSchedule) => {
    setEditingSchedule(schedule);
    const dt = new Date(schedule.scheduledAt);
    const localDt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setScheduleForm({
      scheduledAt: localDt,
      location: schedule.location,
      message: schedule.message || "",
    });
    setScheduleError("");
    setCancelScheduleItem(null);
    setShowScheduleForm(true);
  };

  const closeScheduleForm = () => {
    setShowScheduleForm(false);
    setEditingSchedule(null);
    setScheduleError("");
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleForm.scheduledAt || !scheduleForm.location) {
      setScheduleError("Scheduled time and location are required.");
      return;
    }

    setScheduleSaving(true);
    setScheduleError("");

    try {
      const isoDate = new Date(scheduleForm.scheduledAt).toISOString();
      const payload: ScheduleRequest = {
        scheduledAt: isoDate,
        location: scheduleForm.location,
        message: scheduleForm.message,
      };

      let updatedMatch: MatchItem;

      if (editingSchedule) {
        const res = await matchService.updateSchedule(
          detailMatch.id,
          editingSchedule.id,
          payload,
        );
        const updated = res.data.data;
        updatedMatch = {
          ...detailMatch,
          schedules: detailMatch.schedules.map((s) =>
            s.id === updated.id ? updated : s,
          ),
        };
      } else {
        const res = await matchService.addSchedule(detailMatch.id, payload);
        const newSchedule = res.data.data;
        updatedMatch = {
          ...detailMatch,
          schedules: [...(detailMatch.schedules || []), newSchedule],
        };
      }

      setDetailMatch(updatedMatch);
      onMatchUpdate(updatedMatch);
      closeScheduleForm();
    } catch {
      setScheduleError("Failed to save schedule.");
    } finally {
      setScheduleSaving(false);
    }
  };

  const handleUnmatch = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to unmatch with ${displayName}? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await matchService.unmatch(detailMatch.id);
      onMatchRemove(detailMatch.id);
      handleClose();
    } catch {
      alert("Failed to unmatch. Please try again later.");
    }
  };

  const handleScheduleAction = async (
    schedule: MatchSchedule,
    action: "CONFIRMED" | "CANCELLED",
    reason?: string,
  ) => {
    try {
      const res = await matchService.updateScheduleStatus(
        detailMatch.id,
        schedule.id,
        action,
        reason,
      );
      const updated = res.data.data;
      const updatedMatch = {
        ...detailMatch,
        schedules: detailMatch.schedules.map((s) =>
          s.id === updated.id ? updated : s,
        ),
      };
      setDetailMatch(updatedMatch);
      onMatchUpdate(updatedMatch);
    } catch {
      alert("Failed to update schedule status.");
    }
  };

  const openCancelPopup = (schedule: MatchSchedule) => {
    setCancelScheduleItem(schedule);
    setCancelReason("");
    setShowScheduleForm(false);
  };

  const handleConfirmCancel = async () => {
    if (!cancelScheduleItem) return;
    setCancelSaving(true);
    await handleScheduleAction(cancelScheduleItem, "CANCELLED", cancelReason);
    setCancelSaving(false);
    setCancelScheduleItem(null);
  };

  const handleClose = () => {
    setDetailMatch(null);
    setDetailLightboxIdx(null);
    closeScheduleForm();
    setCancelScheduleItem(null);
  };

  return (
    <div className={styles.matchDetailOverlay} onClick={handleClose}>
      <div
        className={styles.matchDetailModal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className={styles.matchDetailClose} onClick={handleClose}>
          ✕
        </button>

        {/* Profile view */}
        <div className={styles.matchDetailContent}>
          <ProfileView
            user={user}
            lightboxIdx={detailLightboxIdx}
            setLightboxIdx={setDetailLightboxIdx}
            styles={styles}
          />

          {/* Schedules Section */}
          <div className={styles.matchDetailSchedules}>
            <div className={styles.scheduleHeaderRow}>
              <h3 className={styles.cardTitle}>Schedules</h3>
              <button
                className={styles.addScheduleBtn}
                onClick={openAddSchedule}
              >
                + Add Schedule
              </button>
            </div>

            {/* Schedule form */}
            {showScheduleForm && (
              <ScheduleForm
                editingSchedule={editingSchedule}
                scheduleForm={scheduleForm}
                setScheduleForm={setScheduleForm}
                scheduleError={scheduleError}
                scheduleSaving={scheduleSaving}
                onSubmit={handleScheduleSubmit}
                onCancel={closeScheduleForm}
                styles={styles}
              />
            )}

            {/* Cancel form */}
            {cancelScheduleItem && (
              <div className={styles.scheduleFormCard}>
                <h4 className={styles.scheduleFormTitle}>Cancel Schedule</h4>
                <div className={styles.scheduleFormFields}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Reason</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Why are you cancelling?"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.scheduleFormActions}>
                  <button
                    className={styles.scheduleFormCancel}
                    onClick={() => setCancelScheduleItem(null)}
                    disabled={cancelSaving}
                  >
                    Back
                  </button>
                  <button
                    className={styles.scheduleFormSave}
                    style={{ background: "#ef4444", color: "white" }}
                    onClick={handleConfirmCancel}
                    disabled={cancelSaving}
                  >
                    {cancelSaving ? "Cancelling..." : "Confirm Cancel"}
                  </button>
                </div>
              </div>
            )}

            {/* Schedule list */}
            {detailMatch.schedules && detailMatch.schedules.length > 0 ? (
              <ScheduleList
                schedules={detailMatch.schedules}
                displayName={displayName}
                onEdit={openEditSchedule}
                onAction={handleScheduleAction}
                onCancelClick={openCancelPopup}
                styles={styles}
                getStatusClass={getStatusClass}
              />
            ) : (
              !showScheduleForm &&
              !cancelScheduleItem && (
                <p className={styles.noSchedules}>
                  No schedules yet. Click "Add Schedule" to create one.
                </p>
              )
            )}
          </div>

          {/* Unmatch Action */}
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button
              onClick={handleUnmatch}
              style={{
                background: "transparent",
                color: "#ef4444",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                padding: "8px 16px",
              }}
            >
              Unmatch {displayName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailPopup;
