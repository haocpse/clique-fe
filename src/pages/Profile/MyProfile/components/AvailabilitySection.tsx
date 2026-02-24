import { useState } from "react";
import { userService } from "@/services/user.service";
import type { DayOfWeek, AvailabilityResponse } from "@/types";

const DAYS_OF_WEEK: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

interface AvailabilitySectionProps {
  styles: Record<string, string>;
}

const AvailabilitySection = ({ styles }: AvailabilitySectionProps) => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("MONDAY");
  const [specificDate, setSpecificDate] = useState("");
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const currentYear = currentMonthDate.getFullYear();
  const currentMonth = currentMonthDate.getMonth();

  const handlePrevMonth = () =>
    setCurrentMonthDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () =>
    setCurrentMonthDate(new Date(currentYear, currentMonth + 1, 1));

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availNote, setAvailNote] = useState("");
  const [availSubmitting, setAvailSubmitting] = useState(false);
  const [availSuccess, setAvailSuccess] = useState("");
  const [availError, setAvailError] = useState("");
  const [addedSlots, setAddedSlots] = useState<AvailabilityResponse[]>(() => {
    const userStr = localStorage.getItem("profile");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj && Array.isArray(userObj.availabilities)) {
          return userObj.availabilities;
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    return [];
  });

  const getSlotByDate = (dateString: string) => {
    return addedSlots.find(
      (slot) => !slot.isRecurring && slot.specificDate === dateString,
    );
  };

  const getSlotByDayOfWeek = (dayName: DayOfWeek) => {
    return addedSlots.find(
      (slot) => slot.isRecurring && slot.dayOfWeek === dayName,
    );
  };

  // The currently selected slot that we are either adding or updating
  const selectedSlot = isRecurring
    ? getSlotByDayOfWeek(dayOfWeek)
    : specificDate
      ? getSlotByDate(specificDate)
      : undefined;

  const handleDateClick = (formattedDate: string) => {
    if (specificDate === formattedDate) {
      setSpecificDate("");
      setStartTime("");
      setEndTime("");
      setAvailNote("");
      return;
    }
    setSpecificDate(formattedDate);
    const existingSlot = getSlotByDate(formattedDate);
    if (existingSlot) {
      setStartTime(existingSlot.startTime.slice(0, 5));
      setEndTime(existingSlot.endTime.slice(0, 5));
      setAvailNote(existingSlot.note || "");
    } else {
      setStartTime("");
      setEndTime("");
      setAvailNote("");
    }
  };

  const handleDaySelect = (dayName: DayOfWeek) => {
    setDayOfWeek(dayName);
    const existingSlot = getSlotByDayOfWeek(dayName);
    if (existingSlot) {
      setStartTime(existingSlot.startTime.slice(0, 5));
      setEndTime(existingSlot.endTime.slice(0, 5));
      setAvailNote(existingSlot.note || "");
    } else {
      setStartTime("");
      setEndTime("");
      setAvailNote("");
    }
  };

  const handleToggleRecurring = (recurring: boolean) => {
    setIsRecurring(recurring);
    if (recurring) {
      handleDaySelect(dayOfWeek);
    } else if (specificDate) {
      handleDateClick(specificDate);
    }
  };

  const saveToLocalStorage = (slots: AvailabilityResponse[]) => {
    const userStr = localStorage.getItem("profile");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        userObj.availabilities = slots;
        localStorage.setItem("profile", JSON.stringify(userObj));
      } catch (e) {
        console.error("Failed to update user in localStorage", e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvailSubmitting(true);
    setAvailSuccess("");
    setAvailError("");
    try {
      const payload = {
        dayOfWeek: isRecurring ? dayOfWeek : undefined,
        specificDate: !isRecurring ? specificDate : undefined,
        startTime,
        endTime,
        isRecurring,
        note: availNote || undefined,
      };

      if (selectedSlot) {
        // Update
        const res = await userService.updateAvailability(
          selectedSlot.id,
          payload,
        );
        const updatedSlot = res.data.data;
        const newSlots = addedSlots.map((s) =>
          s.id === selectedSlot.id ? updatedSlot : s,
        );
        setAddedSlots(newSlots);
        saveToLocalStorage(newSlots);
        setAvailSuccess("Availability updated successfully!");
      } else {
        // Create
        const res = await userService.addAvailability(payload);
        const newSlot = res.data.data;
        const newSlots = [newSlot, ...addedSlots];
        setAddedSlots(newSlots);
        saveToLocalStorage(newSlots);
        setAvailSuccess("Availability added successfully!");
      }

      setStartTime("");
      setEndTime("");
      setAvailNote("");
      if (!isRecurring) setSpecificDate("");
      setTimeout(() => setAvailSuccess(""), 3000);
    } catch {
      setAvailError("Failed to save availability. Please try again.");
      setTimeout(() => setAvailError(""), 4000);
    } finally {
      setAvailSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSlot) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this availability?",
    );
    if (!confirmDelete) return;

    setAvailSubmitting(true);
    setAvailSuccess("");
    setAvailError("");
    try {
      await userService.deleteAvailability(selectedSlot.id);
      const newSlots = addedSlots.filter((s) => s.id !== selectedSlot.id);
      setAddedSlots(newSlots);
      saveToLocalStorage(newSlots);

      setAvailSuccess("Availability deleted successfully!");
      setStartTime("");
      setEndTime("");
      setAvailNote("");
      if (!isRecurring) setSpecificDate("");
      setTimeout(() => setAvailSuccess(""), 3000);
    } catch {
      setAvailError("Failed to delete availability. Please try again.");
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
            !isRecurring ? styles.availToggleActive : ""
          }`}
          onClick={() => handleToggleRecurring(false)}
        >
          Specific Date
        </button>
        <button
          type="button"
          className={`${styles.availToggleBtn} ${
            isRecurring ? styles.availToggleActive : ""
          }`}
          onClick={() => handleToggleRecurring(true)}
        >
          Recurring
        </button>
      </div>

      <form className={styles.availForm} onSubmit={handleSubmit}>
        <div className={styles.availFieldFull}>
          <label className={styles.availLabel}>
            {isRecurring ? "Day of Week" : "Select Date"}
          </label>
          {isRecurring ? (
            <select
              className={styles.availSelect}
              value={dayOfWeek}
              onChange={(e) => handleDaySelect(e.target.value as DayOfWeek)}
            >
              {[
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY",
              ].map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          ) : (
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

                  const cellDate = new Date(currentYear, currentMonth, day);
                  cellDate.setHours(0, 0, 0, 0);

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const isPast = cellDate < today;

                  const isSelected = specificDate === formattedDate;

                  const isSpecificAdded =
                    getSlotByDate(formattedDate) !== undefined;
                  const dayNameOfWeek =
                    DAYS_OF_WEEK[
                      new Date(currentYear, currentMonth, day).getDay()
                    ];
                  const isRecurringAdded =
                    getSlotByDayOfWeek(dayNameOfWeek) !== undefined;

                  return (
                    <div
                      key={day}
                      className={`${styles.calendarDay} ${
                        isSelected ? styles.calendarDaySelected : ""
                      } ${isPast ? styles.calendarDayDisabled : ""} ${
                        isSpecificAdded
                          ? styles.calendarDaySpecificAdded
                          : isRecurringAdded
                            ? styles.calendarDayRecurringAdded
                            : ""
                      }`}
                      onClick={() => handleDateClick(formattedDate)}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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

        <div className={styles.availToggleRow}>
          <button
            type="submit"
            className={styles.availSubmitBtn}
            disabled={availSubmitting || (!isRecurring && !specificDate)}
          >
            {availSubmitting ? "Saving…" : selectedSlot ? "Update" : "Add"}
          </button>

          {selectedSlot && (
            <button
              type="button"
              className={styles.availDeleteBtn}
              onClick={handleDelete}
              disabled={availSubmitting}
            >
              Delete
            </button>
          )}
        </div>
      </form>

      {availSuccess && (
        <div className={styles.availSuccess}>{availSuccess}</div>
      )}
      {availError && <div className={styles.availError}>{availError}</div>}
    </div>
  );
};

export default AvailabilitySection;
