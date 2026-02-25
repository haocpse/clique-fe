import type { MatchSchedule } from "@/types";
import type { ScheduleRequest } from "@/services/match.service";

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
  return (
    <div
      className={styles.matchPopupOverlay}
      style={{ zIndex: 4000 }}
      onClick={onCancel}
    >
      <div className={styles.matchPopup} onClick={(e) => e.stopPropagation()}>
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
