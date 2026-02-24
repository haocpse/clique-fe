import { useState, useEffect, useCallback } from "react";
import styles from "./Discover.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { userService } from "@/services/user.service";
import { swipeService } from "@/services/swipe.service";
import { matchService } from "@/services/match.service";
import type { UserResponse, MatchItem, MatchSchedule } from "@/types";

type TabType = "discover" | "matches";

const Discover = () => {
  const [activeTab, setActiveTab] = useState<TabType>("discover");

  /* ═══════ DISCOVER STATE ═══════ */
  const [swipeIds, setSwipeIds] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
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
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);

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

  /* ─── Swipe actions ─── */
  const handleSwipe = async (action: "LIKE" | "DISLIKE") => {
    if (swiping || !profileData) return;
    setSwiping(true);
    try {
      const res = await swipeService.swipeAction(profileData.id, action);
      const isMatch = res.data.data;
      if (isMatch && action === "LIKE") {
        setMatchPopup(true);
      } else {
        advanceProfile();
      }
    } catch {
      setError("Failed to process swipe.");
    } finally {
      setSwiping(false);
    }
  };

  const advanceProfile = () => {
    setSlideKey((k) => k + 1);
    setCurrentIdx((i) => i + 1);
    setLightboxIdx(null);
  };

  const dismissMatchPopup = () => {
    setMatchPopup(false);
    advanceProfile();
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
                  const isExpanded = expandedMatchId === user.id;

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
                          onClick={() =>
                            setExpandedMatchId(isExpanded ? null : user.id)
                          }
                        >
                          {isExpanded ? "Hide" : "Detail"}
                        </button>
                      </div>

                      {/* ─── Expanded Schedule Detail ─── */}
                      {isExpanded && (
                        <div className={styles.scheduleSection}>
                          {match.schedules && match.schedules.length > 0 ? (
                            <>
                              <div className={styles.scheduleSectionTitle}>
                                Schedules
                              </div>
                              <div className={styles.scheduleList}>
                                {match.schedules.map(
                                  (schedule: MatchSchedule) => (
                                    <div
                                      key={schedule.id}
                                      className={styles.scheduleItem}
                                    >
                                      <div
                                        className={styles.scheduleItemHeader}
                                      >
                                        <span
                                          className={`${styles.scheduleBadge} ${getStatusClass(schedule.status)}`}
                                        >
                                          {getStatusLabel(schedule.status)}
                                        </span>
                                        <span className={styles.scheduleRole}>
                                          {schedule.isRequester
                                            ? "You requested"
                                            : "They requested"}
                                        </span>
                                      </div>
                                      <div className={styles.scheduleItemBody}>
                                        <div className={styles.scheduleDetail}>
                                          <span className={styles.scheduleIcon}>
                                            🕐
                                          </span>
                                          <span>
                                            {formatDateTime(
                                              schedule.scheduledAt,
                                            )}
                                          </span>
                                        </div>
                                        <div className={styles.scheduleDetail}>
                                          <span className={styles.scheduleIcon}>
                                            📍
                                          </span>
                                          <span>{schedule.location}</span>
                                        </div>
                                        {schedule.message && (
                                          <div
                                            className={styles.scheduleDetail}
                                          >
                                            <span
                                              className={styles.scheduleIcon}
                                            >
                                              💬
                                            </span>
                                            <span>{schedule.message}</span>
                                          </div>
                                        )}
                                        {schedule.status === "CANCELLED" &&
                                          schedule.cancelReason && (
                                            <div
                                              className={`${styles.scheduleDetail} ${styles.cancelReason}`}
                                            >
                                              <span
                                                className={styles.scheduleIcon}
                                              >
                                                ⚠️
                                              </span>
                                              <span>
                                                Reason: {schedule.cancelReason}
                                              </span>
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </>
                          ) : (
                            <p className={styles.noSchedules}>
                              No schedules yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <Footer />
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
  const photos = [...(profileData.photos ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const primaryPhoto = photos[0];

  const initial =
    profile?.firstName?.charAt(0)?.toUpperCase() ||
    profileData.email?.charAt(0)?.toUpperCase() ||
    "?";

  if (!profile) {
    advanceProfile();
    return null;
  }

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
      value: profile.drinkingHabit ? formatLabel(profile.drinkingHabit) : null,
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

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        {TabBar}
        <div className={styles.discoverLayout} key={slideKey}>
          {error && <div className={styles.error}>{error}</div>}

          {/* ─── Left: Hero Photo Card ─── */}
          <div className={`${styles.heroCard} ${styles.slideIn}`}>
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

          {/* ─── Right: Sidebar ─── */}
          <div className={`${styles.sidebar} ${styles.slideIn}`}>
            {/* Basic Info card */}
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

            {/* Lifestyle card */}
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

          {/* ─── About (full width) ─── */}
          <div
            className={`${styles.aboutCard} ${styles.fullWidth} ${styles.slideIn}`}
          >
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

          {/* ─── Photo Gallery (full width) ─── */}
          {photos.length > 1 && (
            <div
              className={`${styles.galleryCard} ${styles.fullWidth} ${styles.slideIn}`}
            >
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
                    onClick={() => setLightboxIdx(idx)}
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

          {/* ─── Swipe Actions (full width) ─── */}
          <div className={`${styles.actionsRow} ${styles.fullWidth}`}>
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

          <div className={`${styles.counter} ${styles.fullWidth}`}>
            {currentIdx + 1} / {swipeIds.length}
          </div>
        </div>
      </div>
      <Footer />

      {/* ─── Lightbox ─── */}
      {lightboxIdx !== null && photos[lightboxIdx] && (
        <div className={styles.lightbox} onClick={() => setLightboxIdx(null)}>
          <button
            className={styles.lightboxClose}
            onClick={() => setLightboxIdx(null)}
          >
            ✕
          </button>

          {photos.length > 1 && (
            <>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(
                    (lightboxIdx - 1 + photos.length) % photos.length,
                  );
                }}
              >
                ‹
              </button>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx((lightboxIdx + 1) % photos.length);
                }}
              >
                ›
              </button>
            </>
          )}

          <img
            src={photos[lightboxIdx].photoUrl}
            alt={`Photo ${lightboxIdx + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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
