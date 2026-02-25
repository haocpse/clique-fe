import { useState } from "react";
import type { MatchSchedule } from "@/types";
import { formatDateTime, getStatusLabel } from "@/utils/profile";

interface ScheduleListProps {
  schedules: MatchSchedule[];
  displayName: string;
  onAddClick: (selectedDate: string) => void;
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
  onAddClick,
  onEdit,
  onAction,
  onCancelClick,
  styles,
  getStatusClass,
}: ScheduleListProps) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const currentYear = currentMonthDate.getFullYear();
  const currentMonth = currentMonthDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  // Map schedules by date string YYYY-MM-DD (local time)
  const schedulesByDate = new Map<string, MatchSchedule[]>();
  schedules.forEach((schedule) => {
    // get local date string
    const d = new Date(schedule.scheduledAt);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d.getDate()).padStart(2, "0")}`;

    if (!schedulesByDate.has(dateStr)) {
      schedulesByDate.set(dateStr, []);
    }
    schedulesByDate.get(dateStr)!.push(schedule);
  });

  const handleDateClick = (formattedDate: string) => {
    if (selectedDate === formattedDate) {
      setSelectedDate(null); // toggle off
    } else {
      setSelectedDate(formattedDate);
    }
  };

  const selectedSchedules = selectedDate
    ? schedulesByDate.get(selectedDate) || []
    : [];

  const getStatusColorClass = (status: string) => {
    // Return a dot CSS class based on status
    switch (status) {
      case "CONFIRMED":
        return styles.dotConfirmed || "";
      case "PENDING":
        return styles.dotPending || "";
      case "CANCELLED":
        return styles.dotCancelled || "";
      case "COMPLETED":
        return styles.dotCompleted || "";
      case "AUTO":
        return styles.dotAuto || "";
      default:
        return "";
    }
  };

  return (
    <div className={styles.scheduleCalendarWrapper}>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <button
            type="button"
            className={styles.calendarNavBtn}
            onClick={handlePrevMonth}
          >
            &lt;
          </button>
          <div className={styles.calendarTitle}>
            {currentMonthDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <button
            type="button"
            className={styles.calendarNavBtn}
            onClick={handleNextMonth}
          >
            &gt;
          </button>
        </div>
        <div className={styles.calendarGrid}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className={styles.calendarDayName}>
              {d}
            </div>
          ))}
          {calendarDays.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className={`${styles.calendarDay} ${styles.calendarDayEmpty}`}
                />
              );
            }
            const formattedDate = `${currentYear}-${String(
              currentMonth + 1,
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const isSelected = selectedDate === formattedDate;
            const daySchedules = schedulesByDate.get(formattedDate);
            const hasSchedule =
              daySchedules !== undefined && daySchedules.length > 0;

            // To show dots for each schedule
            const scheduleDots = daySchedules
              ?.slice(0, 3)
              .map((sch, i) => (
                <span
                  key={i}
                  className={`${styles.calendarDot} ${getStatusColorClass(sch.status)}`}
                />
              ));

            return (
              <div
                key={day}
                className={`${styles.calendarDay} ${
                  isSelected ? styles.calendarDaySelected : ""
                } ${hasSchedule ? styles.calendarDayHasSchedule : ""}`}
                onClick={() => handleDateClick(formattedDate)}
              >
                <div className={styles.calendarDayNumber}>{day}</div>
                {hasSchedule && (
                  <div className={styles.calendarDotsRow}>
                    {scheduleDots}
                    {daySchedules!.length > 3 && (
                      <span className={styles.calendarDotMore}>+</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Schedules Detail Panel */}
      {selectedDate && (
        <div className={styles.selectedDaySchedules}>
          <div className={styles.scheduleHeaderRow}>
            <h3
              className={styles.cardTitle}
              style={{
                textTransform: "none",
                fontSize: "0.85rem",
                color: "#fff",
              }}
            >
              Schedules for{" "}
              {new Date(selectedDate).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </h3>
            <button
              className={styles.addScheduleBtn}
              onClick={() => onAddClick(selectedDate)}
            >
              + Add Schedule
            </button>
          </div>

          {selectedSchedules.length > 0 ? (
            <div className={styles.scheduleList}>
              {selectedSchedules.map((schedule) => (
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
                      {schedule.status === "PENDING" &&
                        !schedule.isRequester && (
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
                      <span>Time: {formatDateTime(schedule.scheduledAt)}</span>
                    </div>
                    <div className={styles.scheduleDetail}>
                      <span>Location: {schedule.location}</span>
                    </div>
                    {schedule.message && (
                      <div className={styles.scheduleDetail}>
                        <span>Message: {schedule.message}</span>
                      </div>
                    )}
                    {schedule.status === "CANCELLED" &&
                      schedule.cancelReason && (
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
          ) : (
            <p className={styles.noSchedules}>No schedules on this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
