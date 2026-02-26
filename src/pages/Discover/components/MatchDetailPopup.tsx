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
    partnerId: undefined,
  });
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleError, setScheduleError] = useState("");

  const [cancelScheduleItem, setCancelScheduleItem] =
    useState<MatchSchedule | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelSaving, setCancelSaving] = useState(false);

  const [showUnmatchConfirm, setShowUnmatchConfirm] = useState(false);
  const [unmatchLoading, setUnmatchLoading] = useState(false);

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

  const openAddSchedule = (selectedDate: string) => {
    setEditingSchedule(null);
    setScheduleForm({
      scheduledAt: `${selectedDate}T12:00`,
      location: "",
      message: "",
      partnerId: undefined,
    });
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
      partnerId: schedule.partner?.id,
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
        partnerId: scheduleForm.partnerId,
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

  const handleUnmatchClick = () => {
    setShowUnmatchConfirm(true);
  };

  const confirmUnmatch = async () => {
    setUnmatchLoading(true);
    try {
      await matchService.unmatch(detailMatch.id);
      onMatchRemove(detailMatch.id);
      handleClose();
    } catch {
      alert("Failed to unmatch. Please try again later.");
      setUnmatchLoading(false);
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

            {/* Schedule list */}
            <ScheduleList
              schedules={detailMatch.schedules || []}
              displayName={displayName}
              onAddClick={openAddSchedule}
              onEdit={openEditSchedule}
              onAction={handleScheduleAction}
              onCancelClick={openCancelPopup}
              styles={styles}
              getStatusClass={getStatusClass}
            />
          </div>

          {/* Unmatch Action */}
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button
              onClick={handleUnmatchClick}
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

      {/* Cancel Schedule Popup */}
      {cancelScheduleItem && (
        <div
          className={styles.matchPopupOverlay}
          style={{ zIndex: 4000 }}
          onClick={() => setCancelScheduleItem(null)}
        >
          <div
            className={styles.matchPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={styles.matchPopupTitle}
              style={{ fontSize: "1.5rem" }}
            >
              Cancel Schedule
            </h3>
            <p className={styles.matchPopupText}>Why are you cancelling?</p>
            <div
              className={styles.formGroup}
              style={{ textAlign: "left", marginBottom: "1.5rem" }}
            >
              <input
                type="text"
                className={styles.formInput}
                placeholder="Enter reason..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                autoFocus
              />
            </div>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                className={styles.scheduleFormCancel}
                onClick={() => setCancelScheduleItem(null)}
                disabled={cancelSaving}
              >
                Back
              </button>
              <button
                className={styles.scheduleFormSave}
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  borderColor: "rgba(239, 68, 68, 0.4)",
                  color: "#fc8282",
                }}
                onClick={handleConfirmCancel}
                disabled={cancelSaving}
              >
                {cancelSaving ? "Cancelling..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unmatch Confirm Popup */}
      {showUnmatchConfirm && (
        <div
          className={styles.matchPopupOverlay}
          style={{ zIndex: 4000 }}
          onClick={() => setShowUnmatchConfirm(false)}
        >
          <div
            className={styles.matchPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className={styles.matchPopupTitle}
              style={{
                fontSize: "1.5rem",
                background: "none",
                WebkitTextFillColor: "initial",
                color: "#fc8282",
              }}
            >
              Unmatch {displayName}?
            </h3>
            <p className={styles.matchPopupText}>
              Are you sure you want to unmatch? This cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              <button
                className={styles.scheduleFormCancel}
                onClick={() => setShowUnmatchConfirm(false)}
                disabled={unmatchLoading}
              >
                Cancel
              </button>
              <button
                className={styles.scheduleFormSave}
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  borderColor: "rgba(239, 68, 68, 0.4)",
                  color: "#fc8282",
                }}
                onClick={confirmUnmatch}
                disabled={unmatchLoading}
              >
                {unmatchLoading ? "Unmatching..." : "Unmatch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDetailPopup;
