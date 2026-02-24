import { formatLabel } from "@/utils/profile";
import type { UserProfile } from "@/types";

interface ProfileAboutProps {
  profile: UserProfile;
  styles: Record<string, string>;
}

const ProfileAbout = ({ profile, styles }: ProfileAboutProps) => {
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
  );
};

export default ProfileAbout;
