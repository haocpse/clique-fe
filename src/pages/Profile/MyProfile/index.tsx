import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyProfile.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import { ROUTES } from "@/constants";
import type { UserResponse } from "@/types";

const MyProfile = () => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await userService.getMyProfile();
        setProfileData(res.data.data);
        const profile = res.data.data.profile;
        if (!profile) {
          navigate(ROUTES.PROFILE_CREATE);
        }
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  /* ─── Loading state ─── */
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingText}>Loading profile...</div>
      </div>
    );
  }

  const profile = profileData?.profile;
  const photos = profileData?.photos ?? [];
  const primaryPhoto = photos.find((p) => p.isPrimary) || photos[0];

  const initial =
    profile?.firstName?.charAt(0)?.toUpperCase() ||
    profileData?.email?.charAt(0)?.toUpperCase() ||
    "?";

  /* ─── Empty profile ─── */
  if (!profile) {
    return (
      <>
        <Header />
        <div className={styles.pageWrapper}>
          <div className={styles.profileLayout}>
            <div className={styles.emptyCard}>
              <h2>Welcome to Clique!</h2>
              <p>You haven't created your profile yet. Let's get started!</p>
              <button
                className={styles.createBtn}
                onClick={() => navigate(ROUTES.PROFILE_CREATE)}
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
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

  /* Build lifestyle tags */
  const basicInfoItems = [
    {
      label: "Height",
      value: profile.heightCm ? `${profile.heightCm} cm` : null,
    },
    {
      label: "Occupation",
      value: profile.occupation || null,
    },
    {
      label: "School",
      value: profile.school || null,
    },
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
        <div className={styles.profileLayout}>
          {error && <div className={styles.error}>{error}</div>}

          {/* ─── Left: Hero Photo Card ─── */}
          <div className={styles.heroCard}>
            {primaryPhoto ? (
              <img
                src={primaryPhoto.url}
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
          <div className={styles.sidebar}>
            {/* Preferences card */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Preferences</h3>
                <button
                  className={styles.editLink}
                  onClick={() => navigate(ROUTES.PROFILE_EDIT)}
                >
                  Edit
                </button>
              </div>

              {profile.interestedIn && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Interested In</span>
                  <span className={styles.infoValue}>
                    {formatLabel(profile.interestedIn)}
                  </span>
                </div>
              )}
              {(profile.minAgePreference || profile.maxAgePreference) && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Age Range</span>
                  <span className={styles.infoValue}>
                    {profile.minAgePreference ?? "—"} -{" "}
                    {profile.maxAgePreference ?? "—"}
                  </span>
                </div>
              )}
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Gender</span>
                <span className={styles.infoValue}>
                  {formatLabel(profile.gender)}
                </span>
              </div>
            </div>

            {/* Account card */}
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Account</h3>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{profileData.email}</span>
              </div>
              {profile.phoneNumber && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Phone</span>
                  <span className={styles.infoValue}>
                    {profile.phoneNumber}
                  </span>
                </div>
              )}
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Member Since</span>
                <span className={styles.infoValue}>
                  {new Date(profileData.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>

          {/* ─── About (full width) ─── */}
          <div className={`${styles.aboutCard} ${styles.fullWidth}`}>
            <span className={styles.aboutTitle}>About</span>

            {profile.bio ? (
              <p className={styles.aboutText}>{profile.bio}</p>
            ) : (
              <p
                className={styles.aboutText}
                style={{ opacity: 0.4, fontStyle: "italic" }}
              >
                No bio yet. Edit your profile to add one!
              </p>
            )}

            {/* Basic Info */}
            {basicInfoItems.length > 0 && (
              <div className={styles.sectionBlock}>
                <div className={styles.sectionLabel}>Basic Info</div>
                <div className={styles.basicList}>
                  {basicInfoItems.map((item, idx) => (
                    <div key={idx} className={styles.basicRow}>
                      <span className={styles.basicKey}>{item.label}</span>
                      <span className={styles.basicDot}>•</span>
                      <span className={styles.basicValue}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {lifestyleItems.length > 0 && (
              <div className={styles.sectionBlock}>
                <div className={styles.sectionLabel}>Lifestyle</div>
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

          {/* ─── Photo Gallery (full width) ─── */}
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
                  onClick={() => setLightboxIdx(idx)}
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${idx + 1}`}
                    className={styles.galleryImg}
                  />
                  {photo.isPrimary && <div className={styles.galleryPrimary} />}
                </div>
              ))}

              {photos.length === 0 && (
                <>
                  <div className={styles.galleryEmpty}>No photos</div>
                  <div className={styles.galleryEmpty}>+</div>
                  <div className={styles.galleryEmpty}>+</div>
                </>
              )}
            </div>
          </div>

          {/* ─── Actions (full width) ─── */}
          <div className={`${styles.actionsRow} ${styles.fullWidth}`}>
            <button
              className={styles.editBtn}
              onClick={() => navigate(ROUTES.PROFILE_EDIT)}
            >
              Edit Profile
            </button>
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
            src={photos[lightboxIdx].url}
            alt={`Photo ${lightboxIdx + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default MyProfile;
