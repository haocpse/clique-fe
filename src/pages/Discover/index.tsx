import { useState, useEffect, useCallback } from "react";
import styles from "./Discover.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { userService } from "@/services/user.service";
import { swipeService } from "@/services/swipe.service";
import { matchService } from "@/services/match.service";
import type { UserResponse, MatchItem, MatchSchedule } from "@/types";
import type { ScheduleRequest } from "@/services/match.service";

type TabType = "discover" | "matches";

const Discover = () => {
  const [activeTab, setActiveTab] = useState<TabType>("discover");

  /* ═══════ DISCOVER STATE ═══════ */
  const [swipeIds, setSwipeIds] = useState<number[]>([]);
  const [currentIdx] = useState(0);
  const [profileData, setProfileData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [slideKey, setSlideKey] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [matchPopup, setMatchPopup] = useState(false);

  /* ═══════ MATCHES STATE ═══════ */
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState("");
  const [detailMatch, setDetailMatch] = useState<MatchItem | null>(null);
  const [detailLightboxIdx, setDetailLightboxIdx] = useState<number | null>(
    null,
  );

  /* ═══════ SCHEDULE FORM STATE ═══════ */
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

  /* ─── Load swipe order on mount ─── */
  useEffect(() => {
    const init = async () => {
      try {
        const res = await userService.getMyProfile();
        const raw = res.data.data.swipeOrder;
        if (raw) {
          const ids: number[] = JSON.parse(raw);
          setSwipeIds(ids);
        }
      } catch {
        setError("Failed to load discover queue.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /* ─── Fetch profile for current swipe index ─── */
  const fetchProfile = useCallback(async (id: number) => {
    setProfileLoading(true);
    setError("");
    try {
      const res = await userService.getUserById(id);
      setProfileData(res.data.data);
    } catch {
      setError("Failed to load profile.");
      setProfileData(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (swipeIds.length > 0 && currentIdx < swipeIds.length) {
      fetchProfile(swipeIds[currentIdx]);
    }
  }, [swipeIds, currentIdx, fetchProfile]);

  /* ─── Load matches when tab switches ─── */
  const fetchMatches = useCallback(async () => {
    setMatchesLoading(true);
    setMatchesError("");
    try {
      const res = await matchService.getMatches();
      setMatches(res.data.data);
    } catch {
      setMatchesError("Failed to load matches.");
    } finally {
      setMatchesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "matches") {
      fetchMatches();
    }
  }, [activeTab, fetchMatches]);

  /* ─── Skip users with no profile (via useEffect to avoid render-loop) ─── */
  useEffect(() => {
    if (profileData && !profileData.profile && swipeIds.length > 0) {
      // Remove profile-less user from swipeIds
      setSwipeIds((ids) => ids.filter((id) => id !== profileData.id));
      setSlideKey((k) => k + 1);
    }
  }, [profileData, swipeIds]);

  /* ─── Swipe actions ─── */
  const handleSwipe = async (action: "LIKE" | "DISLIKE") => {
    if (swiping || !profileData) return;
    setSwiping(true);
    try {
      const res = await swipeService.swipeAction(profileData.id, action);

      // Update swipeOrder: remove the current user id
      const newSwipeIds = swipeIds.filter((_, idx) => idx !== currentIdx);
      setSwipeIds(newSwipeIds);

      // Persist updated swipeOrder to backend
      try {
        await swipeService.updateSwipeOrder(JSON.stringify(newSwipeIds));
      } catch {
        // Non-critical: swipeOrder sync failed, continue
      }

      const isMatch = res.data.data;
      if (isMatch && action === "LIKE") {
        setMatchPopup(true);
      } else {
        // Don't increment index since we removed current element
        setSlideKey((k) => k + 1);
        setLightboxIdx(null);
      }
    } catch {
      setError("Failed to process swipe.");
    } finally {
      setSwiping(false);
    }
  };

  const dismissMatchPopup = () => {
    setMatchPopup(false);
    // Don't increment index since we already removed from swipeIds
    setSlideKey((k) => k + 1);
    setLightboxIdx(null);
  };

  /* ─── Schedule form handlers ─── */
  const openAddSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({ scheduledAt: "", location: "", message: "" });
    setScheduleError("");
    setShowScheduleForm(true);
  };

  const openEditSchedule = (schedule: MatchSchedule) => {
    setEditingSchedule(schedule);
    // Convert the datetime string to local datetime-local input format
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
    if (!detailMatch) return;
    if (!scheduleForm.scheduledAt || !scheduleForm.location) {
      setScheduleError("Scheduled time and location are required.");
      return;
    }

    setScheduleSaving(true);
    setScheduleError("");

    try {
      // Convert local datetime to ISO string
      const isoDate = new Date(scheduleForm.scheduledAt).toISOString();
      const payload: ScheduleRequest = {
        scheduledAt: isoDate,
        location: scheduleForm.location,
        message: scheduleForm.message,
      };

      if (editingSchedule) {
        // Update
        const res = await matchService.updateSchedule(
          detailMatch.user.id,
          editingSchedule.id,
          payload,
        );
        const updated = res.data.data;
        // Update in detailMatch
        setDetailMatch({
          ...detailMatch,
          schedules: detailMatch.schedules.map((s) =>
            s.id === updated.id ? updated : s,
          ),
        });
        // Update in matches list
        setMatches((prev) =>
          prev.map((m) =>
            m.user.id === detailMatch.user.id
              ? {
                  ...m,
                  schedules: m.schedules.map((s) =>
                    s.id === updated.id ? updated : s,
                  ),
                }
              : m,
          ),
        );
      } else {
        // Add
        const res = await matchService.addSchedule(
          detailMatch.user.id,
          payload,
        );
        const newSchedule = res.data.data;
        setDetailMatch({
          ...detailMatch,
          schedules: [...(detailMatch.schedules || []), newSchedule],
        });
        // Update in matches list
        setMatches((prev) =>
          prev.map((m) =>
            m.user.id === detailMatch.user.id
              ? { ...m, schedules: [...(m.schedules || []), newSchedule] }
              : m,
          ),
        );
      }
      closeScheduleForm();
    } catch {
      setScheduleError("Failed to save schedule.");
    } finally {
      setScheduleSaving(false);
    }
  };

  /* ─── Helpers ─── */
  const formatLabel = (val?: string) =>
    val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "—";

  const calcAge = (birthday: string): number | null => {
    try {
      const bd = new Date(birthday);
      const now = new Date();
      let age = now.getFullYear() - bd.getFullYear();
      const m = now.getMonth() - bd.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
      return age;
    } catch {
      return null;
    }
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      AUTO: "Auto",
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      AUTO: styles.badgeAuto,
      PENDING: styles.badgePending,
      CONFIRMED: styles.badgeConfirmed,
      CANCELLED: styles.badgeCancelled,
      COMPLETED: styles.badgeCompleted,
    };
    return map[status] || "";
  };

  /* ─── Profile rendering helper (shared between discover & detail) ─── */
  const renderProfileView = (user: UserResponse, isPopup: boolean = false) => {
    const profile = user.profile;
    const photos = [...(user.photos ?? [])].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
    const primaryPhoto = photos[0];
    const initial =
      profile?.firstName?.charAt(0)?.toUpperCase() ||
      user.email?.charAt(0)?.toUpperCase() ||
      "?";

    if (!profile) return null;

    const age = calcAge(profile.birthday);
    const displayName =
      profile.displayName ||
      `${profile.firstName} ${profile.lastName || ""}`.trim();

    const basicInfoItems = [
      {
        label: "Height",
        value: profile.heightCm ? `${profile.heightCm} cm` : null,
      },
      { label: "Occupation", value: profile.occupation || null },
      { label: "School", value: profile.school || null },
      { label: "Company", value: profile.company || null },
    ].filter((i) => i.value);

    const lifestyleItems = [
      {
        label: "Drinking",
        value: profile.drinkingHabit
          ? formatLabel(profile.drinkingHabit)
          : null,
      },
      {
        label: "Smoking",
        value: profile.smokingHabit ? formatLabel(profile.smokingHabit) : null,
      },
      {
        label: "Zodiac",
        value: profile.zodiacSign ? formatLabel(profile.zodiacSign) : null,
      },
    ].filter((i) => i.value);

    const lightboxState = isPopup ? detailLightboxIdx : lightboxIdx;
    const setLightbox = isPopup ? setDetailLightboxIdx : setLightboxIdx;

    return (
      <>
        <div className={styles.discoverLayout}>
          {/* Hero Photo Card */}
          <div className={styles.heroCard}>
            {primaryPhoto ? (
              <img
                src={primaryPhoto.photoUrl}
                alt={displayName}
                className={styles.heroImage}
              />
            ) : (
              <div className={styles.heroPlaceholder}>
                <span className={styles.heroInitial}>{initial}</span>
              </div>
            )}
            <div className={styles.heroOverlay}>
              <h1 className={styles.heroName}>
                {displayName}
                {age !== null && <span>, {age}</span>}
              </h1>
              <div className={styles.heroMeta}>
                {profile.occupation && <span>{profile.occupation}</span>}
                {profile.occupation && (profile.city || profile.country) && (
                  <span className={styles.heroDot} />
                )}
                {(profile.city || profile.country) && (
                  <span>
                    {[profile.city, profile.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {basicInfoItems.length > 0 && (
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Basic Info</h3>
                </div>
                {basicInfoItems.map((item, idx) => (
                  <div key={idx} className={styles.infoRow}>
                    <span className={styles.infoLabel}>{item.label}</span>
                    <span className={styles.infoValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
            {lifestyleItems.length > 0 && (
              <div className={styles.infoCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Lifestyle</h3>
                </div>
                <div className={styles.tagsRow}>
                  {lifestyleItems.map((item, idx) => (
                    <span key={idx} className={styles.tag}>
                      {item.label}: {item.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* About */}
          <div className={`${styles.aboutCard} ${styles.fullWidth}`}>
            <span className={styles.aboutTitle}>About</span>
            {profile.bio ? (
              <p className={styles.aboutText}>{profile.bio}</p>
            ) : (
              <p
                className={styles.aboutText}
                style={{ opacity: 0.4, fontStyle: "italic" }}
              >
                No bio shared.
              </p>
            )}
          </div>

          {/* Photo Gallery */}
          {photos.length > 1 && (
            <div className={`${styles.galleryCard} ${styles.fullWidth}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Photos</h3>
                <span className={styles.infoLabel}>
                  {photos.length} photo{photos.length !== 1 && "s"}
                </span>
              </div>
              <div className={styles.galleryGrid}>
                {photos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className={styles.galleryItem}
                    onClick={() => setLightbox(idx)}
                  >
                    <img
                      src={photo.photoUrl}
                      alt={`Photo ${idx + 1}`}
                      className={styles.galleryImg}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lightbox */}
        {lightboxState !== null && photos[lightboxState] && (
          <div className={styles.lightbox} onClick={() => setLightbox(null)}>
            <button
              className={styles.lightboxClose}
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
            {photos.length > 1 && (
              <>
                <button
                  className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox(
                      (lightboxState - 1 + photos.length) % photos.length,
                    );
                  }}
                >
                  ‹
                </button>
                <button
                  className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((lightboxState + 1) % photos.length);
                  }}
                >
                  ›
                </button>
              </>
            )}
            <img
              src={photos[lightboxState].photoUrl}
              alt={`Photo ${lightboxState + 1}`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  };

  /* ═══════════════════════════════════════
     TAB BAR (always shown)
     ═══════════════════════════════════════ */
  const TabBar = (
    <div className={styles.tabBar}>
      <button
        className={`${styles.tabBtn} ${activeTab === "discover" ? styles.tabBtnActive : ""}`}
        onClick={() => setActiveTab("discover")}
      >
        Discover
      </button>
      <button
        className={`${styles.tabBtn} ${activeTab === "matches" ? styles.tabBtnActive : ""}`}
        onClick={() => setActiveTab("matches")}
      >
        Matches
      </button>
    </div>
  );

  /* ═══════════════════════════════════════
     MATCH DETAIL POPUP
     ═══════════════════════════════════════ */
  const renderMatchDetailPopup = () => {
    if (!detailMatch) return null;
    const user = detailMatch.user;
    const profile = user.profile;
    const displayName =
      profile?.displayName ||
      `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
      "Unknown";

    return (
      <div
        className={styles.matchDetailOverlay}
        onClick={() => {
          setDetailMatch(null);
          setDetailLightboxIdx(null);
          closeScheduleForm();
        }}
      >
        <div
          className={styles.matchDetailModal}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className={styles.matchDetailClose}
            onClick={() => {
              setDetailMatch(null);
              setDetailLightboxIdx(null);
              closeScheduleForm();
            }}
          >
            ✕
          </button>

          {/* Profile view */}
          <div className={styles.matchDetailContent}>
            {renderProfileView(user, true)}

            {/* ─── Schedules Section ─── */}
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
                    <div className={styles.scheduleFormError}>
                      {scheduleError}
                    </div>
                  )}
                  <div className={styles.scheduleFormActions}>
                    <button
                      className={styles.scheduleFormCancel}
                      onClick={closeScheduleForm}
                      disabled={scheduleSaving}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.scheduleFormSave}
                      onClick={handleScheduleSubmit}
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
              )}

              {/* Schedule list */}
              {detailMatch.schedules && detailMatch.schedules.length > 0 ? (
                <div className={styles.scheduleList}>
                  {detailMatch.schedules.map((schedule: MatchSchedule) => (
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
                          <button
                            className={styles.scheduleEditBtn}
                            onClick={() => openEditSchedule(schedule)}
                            title="Edit"
                          >
                            ✎
                          </button>
                        </div>
                      </div>
                      <div className={styles.scheduleItemBody}>
                        <div className={styles.scheduleDetail}>
                          <span className={styles.scheduleIcon}>🕐</span>
                          <span>{formatDateTime(schedule.scheduledAt)}</span>
                        </div>
                        <div className={styles.scheduleDetail}>
                          <span className={styles.scheduleIcon}>📍</span>
                          <span>{schedule.location}</span>
                        </div>
                        {schedule.message && (
                          <div className={styles.scheduleDetail}>
                            <span className={styles.scheduleIcon}>💬</span>
                            <span>{schedule.message}</span>
                          </div>
                        )}
                        {schedule.status === "CANCELLED" &&
                          schedule.cancelReason && (
                            <div
                              className={`${styles.scheduleDetail} ${styles.cancelReason}`}
                            >
                              <span className={styles.scheduleIcon}>⚠️</span>
                              <span>Reason: {schedule.cancelReason}</span>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
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

  /* ═══════════════════════════════════════
     MATCHES TAB
     ═══════════════════════════════════════ */
  if (activeTab === "matches") {
    return (
      <>
        <Header />
        <div className={styles.pageWrapper}>
          {TabBar}

          {matchesLoading && (
            <div
              className={styles.loadingText}
              style={{ textAlign: "center", padding: "3rem 0" }}
            >
              Loading matches…
            </div>
          )}

          {matchesError && (
            <div
              className={styles.error}
              style={{ maxWidth: "80%", margin: "0 auto" }}
            >
              {matchesError}
            </div>
          )}

          {!matchesLoading && !matchesError && matches.length === 0 && (
            <div className={styles.matchesContainer}>
              <div className={styles.emptyCard}>
                <div className={styles.emptyIcon}>💕</div>
                <h2>No matches yet</h2>
                <p>Keep swiping to find your match!</p>
              </div>
            </div>
          )}

          {!matchesLoading && matches.length > 0 && (
            <div className={styles.matchesContainer}>
              <div className={styles.matchesList}>
                {matches.map((match) => {
                  const user = match.user;
                  const profile = user.profile;
                  const photo = user.photos?.sort(
                    (a, b) => a.displayOrder - b.displayOrder,
                  )[0];
                  const name =
                    profile?.displayName ||
                    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
                    "Unknown";
                  const age = profile?.birthday
                    ? calcAge(profile.birthday)
                    : null;

                  return (
                    <div key={user.id} className={styles.matchCard}>
                      <div className={styles.matchCardMain}>
                        <div className={styles.matchCardPhoto}>
                          {photo ? (
                            <img src={photo.photoUrl} alt={name} />
                          ) : (
                            <div className={styles.matchCardInitial}>
                              {name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className={styles.matchCardInfo}>
                          <h3 className={styles.matchCardName}>
                            {name}
                            {age !== null && <span>, {age}</span>}
                          </h3>
                          {profile?.occupation && (
                            <p className={styles.matchCardOccupation}>
                              {profile.occupation}
                            </p>
                          )}
                          {(profile?.city || profile?.country) && (
                            <p className={styles.matchCardLocation}>
                              📍{" "}
                              {[profile?.city, profile?.country]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                          {match.schedules && match.schedules.length > 0 && (
                            <span className={styles.scheduleBadgeCount}>
                              {match.schedules.length} schedule
                              {match.schedules.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <button
                          className={styles.matchDetailBtn}
                          onClick={() => {
                            setDetailMatch(match);
                            setDetailLightboxIdx(null);
                            closeScheduleForm();
                          }}
                        >
                          View Detail
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <Footer />

        {/* Match Detail Popup */}
        {renderMatchDetailPopup()}
      </>
    );
  }

  /* ═══════════════════════════════════════
     DISCOVER TAB
     ═══════════════════════════════════════ */

  /* ─── Loading state ─── */
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingText}>Discovering people…</div>
      </div>
    );
  }

  /* ─── All swiped / empty ─── */
  if (swipeIds.length === 0 || currentIdx >= swipeIds.length) {
    return (
      <>
        <Header />
        <div className={styles.pageWrapper}>
          {TabBar}
          <div className={styles.discoverLayout}>
            <div className={styles.emptyCard}>
              <div className={styles.emptyIcon}>✨</div>
              <h2>No more profiles</h2>
              <p>Check back later for new people to discover!</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ─── Profile loading ─── */
  if (profileLoading || !profileData) {
    return (
      <>
        <Header />
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingText}>Loading profile…</div>
        </div>
        <Footer />
      </>
    );
  }

  const profile = profileData.profile;

  if (!profile) {
    return (
      <>
        <Header />
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingText}>Loading profile…</div>
        </div>
        <Footer />
      </>
    );
  }

  const displayName =
    profile.displayName ||
    `${profile.firstName} ${profile.lastName || ""}`.trim();

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        {TabBar}
        <div key={slideKey} className={styles.slideIn}>
          {error && (
            <div
              className={styles.error}
              style={{ maxWidth: "80%", margin: "0 auto 1rem" }}
            >
              {error}
            </div>
          )}

          {renderProfileView(profileData)}

          {/* ─── Swipe Actions ─── */}
          <div className={styles.swipeActionsWrapper}>
            <div className={styles.actionsRow}>
              <button
                className={`${styles.actionBtn} ${styles.passBtn}`}
                onClick={() => handleSwipe("DISLIKE")}
                disabled={swiping}
                title="Pass"
              >
                ✕
              </button>
              <button
                className={`${styles.actionBtn} ${styles.likeBtn}`}
                onClick={() => handleSwipe("LIKE")}
                disabled={swiping}
                title="Like"
              >
                ♥
              </button>
            </div>
            <div className={styles.counter}>
              {currentIdx + 1} / {swipeIds.length}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* ─── Match Popup ─── */}
      {matchPopup && (
        <div className={styles.matchPopupOverlay} onClick={dismissMatchPopup}>
          <div
            className={styles.matchPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.matchPopupIcon}>🎉</div>
            <h2 className={styles.matchPopupTitle}>It's a Match!</h2>
            <p className={styles.matchPopupText}>
              You and <strong>{displayName}</strong> liked each other!
            </p>
            <button
              className={styles.matchPopupBtn}
              onClick={dismissMatchPopup}
            >
              Keep Swiping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Discover;
