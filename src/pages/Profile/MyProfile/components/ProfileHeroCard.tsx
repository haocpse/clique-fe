import type { UserPhoto } from "@/types";
import { calcAge, getImageUrl } from "@/utils/profile";

interface ProfileHeroCardProps {
  displayName: string;
  birthday: string;
  occupation?: string;
  city?: string;
  country?: string;
  primaryPhoto?: UserPhoto;
  initial: string;
  styles: Record<string, string>;
}

const ProfileHeroCard = ({
  displayName,
  birthday,
  occupation,
  city,
  country,
  primaryPhoto,
  initial,
  styles,
}: ProfileHeroCardProps) => {
  const age = calcAge(birthday);

  return (
    <div className={styles.heroCard}>
      {primaryPhoto ? (
        <img
          src={getImageUrl(primaryPhoto.photoUrl)}
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
          {occupation && <span>{occupation}</span>}
          {occupation && (city || country) && (
            <span className={styles.heroDot} />
          )}
          {(city || country) && (
            <span>{[city, country].filter(Boolean).join(", ")}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeroCard;
