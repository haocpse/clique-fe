import { useState, useEffect, useCallback } from "react";
import styles from "./Discover.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { userService } from "@/services/user.service";
import type { UserResponse, AvailabilityResponse } from "@/types";

const Discover = () => {
  const [swipeIds, setSwipeIds] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [profileData, setProfileData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [slideKey, setSlideKey] = useState(0);

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

  /* ─── Swipe actions ─── */
  const handleNext = () => {
    setSlideKey((k) => k + 1);
    setCurrentIdx((i) => i + 1);
    setLightboxIdx(null);
  };

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
  const availabilities: AvailabilityResponse[] =
    profileData.availabilities ?? [];

  const initial =
    profile?.firstName?.charAt(0)?.toUpperCase() ||
    profileData.email?.charAt(0)?.toUpperCase() ||
    "?";

  if (!profile) {
    // User exists but has no profile — skip
    handleNext();
    return null;
  }

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

            {/* Availability card */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Availability</h3>
              </div>
              {availabilities.length > 0 ? (
                <div className={styles.availList}>
                  {availabilities
                    .filter((a) => a.isActive)
                    .map((slot) => (
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
                            <span className={styles.availItemNote}>
                              {slot.note}
                            </span>
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
              ) : (
                <p className={styles.availEmpty}>
                  No availability info shared yet.
                </p>
              )}
            </div>
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
              onClick={handleNext}
              title="Pass"
            >
              ✕
            </button>
            <button
              className={`${styles.actionBtn} ${styles.likeBtn}`}
              onClick={handleNext}
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
    </>
  );
};

export default Discover;
