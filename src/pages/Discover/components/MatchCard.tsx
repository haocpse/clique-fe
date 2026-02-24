import type { MatchItem } from "@/types";
import { calcAge } from "@/utils/profile";
import { useNavigate } from "react-router-dom";

interface MatchCardProps {
  match: MatchItem;
  styles: Record<string, string>;
}

const MatchCard = ({ match, styles }: MatchCardProps) => {
  const navigate = useNavigate();
  const user = match.user;
  const profile = user.profile;
  const photo = user.photos?.sort((a, b) => a.displayOrder - b.displayOrder)[0];
  const name =
    profile?.displayName ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    "Unknown";
  const age = profile?.birthday ? calcAge(profile.birthday) : null;

  return (
    <div className={styles.matchCard}>
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
            <p className={styles.matchCardOccupation}>{profile.occupation}</p>
          )}
          {(profile?.city || profile?.country) && (
            <p className={styles.matchCardLocation}>
              📍 {[profile?.city, profile?.country].filter(Boolean).join(", ")}
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
            navigate(`/match/${match.id}`, {
              state: { match },
            })
          }
        >
          View Detail
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
