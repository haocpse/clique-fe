import { useState } from "react";
import { userService } from "@/services/user.service";
import type { DayOfWeek, AvailabilityResponse } from "@/types";

const DAYS_OF_WEEK: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

interface AvailabilitySectionProps {
  styles: Record<string, string>;
}

const AvailabilitySection = ({ styles }: AvailabilitySectionProps) => {
  const [isRecurring, setIsRecurring] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("MONDAY");
  const [specificDate, setSpecificDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availNote, setAvailNote] = useState("");
  const [availSubmitting, setAvailSubmitting] = useState(false);
  const [availSuccess, setAvailSuccess] = useState("");
  const [availError, setAvailError] = useState("");
  const [addedSlots, setAddedSlots] = useState<AvailabilityResponse[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvailSubmitting(true);
    setAvailSuccess("");
    setAvailError("");
    try {
      const res = await userService.addAvailability({
        dayOfWeek: isRecurring ? dayOfWeek : undefined,
        specificDate: !isRecurring ? specificDate : undefined,
        startTime,
        endTime,
        isRecurring,
        note: availNote || undefined,
      });
      setAddedSlots((prev) => [res.data.data, ...prev]);
      setAvailSuccess("Availability added successfully!");
      setStartTime("");
      setEndTime("");
      setAvailNote("");
      setTimeout(() => setAvailSuccess(""), 3000);
    } catch {
      setAvailError("Failed to add availability. Please try again.");
      setTimeout(() => setAvailError(""), 4000);
    } finally {
      setAvailSubmitting(false);
    }
  };

  return (
    <div className={`${styles.availabilityCard} ${styles.fullWidth}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Availability</h3>
      </div>

      {/* Toggle: Recurring vs Specific Date */}
      <div className={styles.availToggleRow}>
        <button
          type="button"
          className={`${styles.availToggleBtn} ${
            isRecurring ? styles.availToggleActive : ""
          }`}
          onClick={() => setIsRecurring(true)}
        >
          Recurring
        </button>
        <button
          type="button"
          className={`${styles.availToggleBtn} ${
            !isRecurring ? styles.availToggleActive : ""
          }`}
          onClick={() => setIsRecurring(false)}
        >
          Specific Date
        </button>
      </div>

      <form className={styles.availForm} onSubmit={handleSubmit}>
        <div className={styles.availRow}>
          {/* Day or Date picker */}
          <div className={styles.availField}>
            <label className={styles.availLabel}>
              {isRecurring ? "Day of Week" : "Date"}
            </label>
            {isRecurring ? (
              <select
                className={styles.availSelect}
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0) + d.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="date"
                className={styles.availInput}
                value={specificDate}
                onChange={(e) => setSpecificDate(e.target.value)}
                required={!isRecurring}
              />
            )}
          </div>

          {/* Note */}
          <div className={styles.availField}>
            <label className={styles.availLabel}>Note (optional)</label>
            <textarea
              className={styles.availTextarea}
              value={availNote}
              onChange={(e) => setAvailNote(e.target.value)}
              placeholder="e.g. Available for coffee"
              rows={1}
            />
          </div>
        </div>

        <div className={styles.availRow}>
          <div className={styles.availField}>
            <label className={styles.availLabel}>Start Time</label>
            <input
              type="time"
              className={styles.availInput}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className={styles.availField}>
            <label className={styles.availLabel}>End Time</label>
            <input
              type="time"
              className={styles.availInput}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className={styles.availSubmitBtn}
          disabled={availSubmitting}
        >
          {availSubmitting ? "Adding…" : "+ Add Availability"}
        </button>
      </form>

      {availSuccess && (
        <div className={styles.availSuccess}>{availSuccess}</div>
      )}
      {availError && <div className={styles.availError}>{availError}</div>}

      {/* Added entries */}
      {addedSlots.length > 0 && (
        <>
          <div className={styles.availDivider} />
          <div className={styles.availList}>
            {addedSlots.map((slot) => (
              <div key={slot.id} className={styles.availItem}>
                <div className={styles.availItemInfo}>
                  <span className={styles.availItemDay}>
                    {slot.isRecurring
                      ? slot.dayOfWeek &&
                        slot.dayOfWeek.charAt(0) +
                          slot.dayOfWeek.slice(1).toLowerCase()
                      : slot.specificDate}
                  </span>
                  <span className={styles.availItemTime}>
                    {slot.startTime} – {slot.endTime}
                  </span>
                  {slot.note && (
                    <span className={styles.availItemNote}>{slot.note}</span>
                  )}
                </div>
                <span
                  className={`${styles.availItemBadge} ${
                    slot.isRecurring
                      ? styles.availBadgeRecurring
                      : styles.availBadgeSpecific
                  }`}
                >
                  {slot.isRecurring ? "Recurring" : "One-time"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AvailabilitySection;
