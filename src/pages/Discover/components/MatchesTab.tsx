import type { MatchItem } from "@/types";
import MatchCard from "./MatchCard";

interface MatchesTabProps {
  matches: MatchItem[];
  matchesLoading: boolean;
  matchesError: string;
  onViewDetail: (match: MatchItem) => void;
  styles: Record<string, string>;
}

const MatchesTab = ({
  matches,
  matchesLoading,
  matchesError,
  onViewDetail,
  styles,
}: MatchesTabProps) => {
  if (matchesLoading) {
    return (
      <div
        className={styles.loadingText}
        style={{ textAlign: "center", padding: "3rem 0" }}
      >
        Loading matches…
      </div>
    );
  }

  if (matchesError) {
    return (
      <div
        className={styles.error}
        style={{ maxWidth: "80%", margin: "0 auto" }}
      >
        {matchesError}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className={styles.matchesContainer}>
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>💕</div>
          <h2>No matches yet</h2>
          <p>Keep swiping to find your match!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.matchesContainer}>
      <div className={styles.matchesList}>
        {matches.map((match) => (
          <MatchCard
            key={match.user.id}
            match={match}
            onViewDetail={onViewDetail}
            styles={styles}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchesTab;
