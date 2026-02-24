import { formatLabel } from "@/utils/profile";
import type { UserProfile, UserResponse } from "@/types";

interface ProfileSidebarProps {
  profile: UserProfile;
  profileData: UserResponse;
  onEditClick: () => void;
  styles: Record<string, string>;
}

const ProfileSidebar = ({
  profile,
  profileData,
  onEditClick,
  styles,
}: ProfileSidebarProps) => {
  return (
    <div className={styles.sidebar}>
      {/* Preferences card */}
      <div className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Preferences</h3>
          <button className={styles.editLink} onClick={onEditClick}>
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
        {profileData.phoneNumber && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Phone</span>
            <span className={styles.infoValue}>{profileData.phoneNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;
