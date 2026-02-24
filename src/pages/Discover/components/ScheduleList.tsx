import type { MatchSchedule } from "@/types";
import { formatDateTime, getStatusLabel } from "@/utils/profile";

interface ScheduleListProps {
  schedules: MatchSchedule[];
  displayName: string;
  onEdit: (schedule: MatchSchedule) => void;
  onAction: (
    schedule: MatchSchedule,
    action: "CONFIRMED" | "CANCELLED",
    reason?: string,
  ) => void;
  onCancelClick: (schedule: MatchSchedule) => void;
  styles: Record<string, string>;
  /** CSS class getter for status badges */
  getStatusClass: (status: string) => string;
}

const ScheduleList = ({
  schedules,
  displayName,
  onEdit,
  onAction,
  onCancelClick,
  styles,
  getStatusClass,
}: ScheduleListProps) => {
  return (
    <div className={styles.scheduleList}>
      {schedules.map((schedule) => (
        <div key={schedule.id} className={styles.scheduleItem}>
          <div className={styles.scheduleItemHeader}>
            <span
              className={`${styles.scheduleBadge} ${getStatusClass(schedule.status)}`}
            >
              {getStatusLabel(schedule.status)}
            </span>
            <div className={styles.scheduleHeaderRight}>
              <span className={styles.scheduleRole}>
                {schedule.isRequester
                  ? "You requested"
                  : `${displayName} requested`}
              </span>
              {schedule.status === "PENDING" && !schedule.isRequester && (
                <button
                  className={styles.scheduleEditBtn}
                  onClick={() => onAction(schedule, "CONFIRMED")}
                  title="Confirm"
                  type="button"
                >
                  ✓
                </button>
              )}
              {schedule.status !== "CANCELLED" &&
                schedule.status !== "COMPLETED" && (
                  <button
                    className={styles.scheduleEditBtn}
                    onClick={() => onCancelClick(schedule)}
                    title="Cancel"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              <button
                className={styles.scheduleEditBtn}
                onClick={() => onEdit(schedule)}
                title="Edit"
                type="button"
              >
                ✎
              </button>
            </div>
          </div>
          <div className={styles.scheduleItemBody}>
            <div className={styles.scheduleDetail}>
              <span>{formatDateTime(schedule.scheduledAt)}</span>
            </div>
            <div className={styles.scheduleDetail}>
              <span>{schedule.location}</span>
            </div>
            {schedule.message && (
              <div className={styles.scheduleDetail}>
                <span>{schedule.message}</span>
              </div>
            )}
            {schedule.status === "CANCELLED" && schedule.cancelReason && (
              <div
                className={`${styles.scheduleDetail} ${styles.cancelReason}`}
              >
                <span>Reason: {schedule.cancelReason}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;
