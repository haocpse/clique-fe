import type { UserResponse } from "@/types";
import { formatLabel, calcAge } from "@/utils/profile";
import Lightbox from "@/components/ui/Lightbox";

interface ProfileViewProps {
  user: UserResponse;
  lightboxIdx: number | null;
  setLightboxIdx: (idx: number | null) => void;
  styles: Record<string, string>;
}

const ProfileView = ({
  user,
  lightboxIdx,
  setLightboxIdx,
  styles,
}: ProfileViewProps) => {
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
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          photos={photos}
          activeIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onNavigate={(idx) => setLightboxIdx(idx)}
          styles={styles}
        />
      )}
    </>
  );
};

export default ProfileView;
