import { useState } from "react";
import type { UserResponse } from "@/types";
import { getDisplayName } from "@/utils/profile";
import ProfileView from "@/components/ui/ProfileView";

interface DiscoverTabProps {
  profileData: UserResponse;
  swipeIds: number[];
  currentIdx: number;
  slideKey: number;
  swiping: boolean;
  error: string;
  onSwipe: (action: "LIKE" | "DISLIKE") => void;
  /** Called when match popup is dismissed */
  matchPopup: boolean;
  onDismissMatchPopup: () => void;
  styles: Record<string, string>;
}

const DiscoverTab = ({
  profileData,
  swipeIds,
  currentIdx,
  slideKey,
  swiping,
  error,
  onSwipe,
  matchPopup,
  onDismissMatchPopup,
  styles,
}: DiscoverTabProps) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const profile = profileData.profile;
  const displayName = getDisplayName(profile);

  return (
    <>
      <div key={slideKey} className={styles.slideIn}>
        {error && (
          <div
            className={styles.error}
            style={{ maxWidth: "80%", margin: "0 auto 1rem" }}
          >
            {error}
          </div>
        )}

        <ProfileView
          user={profileData}
          lightboxIdx={lightboxIdx}
          setLightboxIdx={setLightboxIdx}
          styles={styles}
        />

        {/* Swipe Actions */}
        <div className={styles.swipeActionsWrapper}>
          <div className={styles.actionsRow}>
            <button
              className={`${styles.actionBtn} ${styles.passBtn}`}
              onClick={() => onSwipe("DISLIKE")}
              disabled={swiping}
              title="Pass"
            >
              ✕
            </button>
            <button
              className={`${styles.actionBtn} ${styles.likeBtn}`}
              onClick={() => onSwipe("LIKE")}
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

      {/* Match Popup */}
      {matchPopup && (
        <div className={styles.matchPopupOverlay} onClick={onDismissMatchPopup}>
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
              onClick={onDismissMatchPopup}
            >
              Keep Swiping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscoverTab;
