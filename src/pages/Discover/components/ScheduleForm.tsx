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
    <div className={styles.scheduleFormCard}>
      <h4 className={styles.scheduleFormTitle}>
        {editingSchedule ? "Edit Schedule" : "New Schedule"}
      </h4>
      <div className={styles.scheduleFormFields}>
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
        <div className={styles.formGroup}>
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
        <div className={styles.formGroup}>
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
        <div className={styles.scheduleFormError}>{scheduleError}</div>
      )}
      <div className={styles.scheduleFormActions}>
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
          {scheduleSaving ? "Saving..." : editingSchedule ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
};

export default ScheduleForm;
