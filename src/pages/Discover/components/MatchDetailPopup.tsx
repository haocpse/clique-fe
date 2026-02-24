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
  styles: Record<string, string>;
}

const MatchDetailPopup = ({
  detailMatch,
  setDetailMatch,
  onMatchUpdate,
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
          detailMatch.user.id,
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
        const res = await matchService.addSchedule(
          detailMatch.user.id,
          payload,
        );
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

  const handleClose = () => {
    setDetailMatch(null);
    setDetailLightboxIdx(null);
    closeScheduleForm();
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

            {/* Schedule list */}
            {detailMatch.schedules && detailMatch.schedules.length > 0 ? (
              <ScheduleList
                schedules={detailMatch.schedules}
                displayName={displayName}
                onEdit={openEditSchedule}
                styles={styles}
                getStatusClass={getStatusClass}
              />
            ) : (
              !showScheduleForm && (
                <p className={styles.noSchedules}>
                  No schedules yet. Click "Add Schedule" to create one.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailPopup;
