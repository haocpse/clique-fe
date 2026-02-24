import { useState, useEffect, useCallback } from "react";
import styles from "./Discover.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { userService } from "@/services/user.service";
import { swipeService } from "@/services/swipe.service";
import { matchService } from "@/services/match.service";
import type { UserResponse, MatchItem } from "@/types";
import DiscoverTab from "./components/DiscoverTab";
import MatchesTab from "./components/MatchesTab";

type TabType = "discover" | "matches";

const Discover = () => {
  const [activeTab, setActiveTab] = useState<TabType>("discover");

  /* ═══════ DISCOVER STATE ═══════ */
  const [swipeIds, setSwipeIds] = useState<number[]>([]);
  const [currentIdx] = useState(0);
  const [profileData, setProfileData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState("");
  const [slideKey, setSlideKey] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [matchPopup, setMatchPopup] = useState(false);

  /* ═══════ MATCHES STATE ═══════ */
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState("");

  /* ─── Load swipe order on mount ─── */
  useEffect(() => {
    const init = async () => {
      try {
        const stored = localStorage.getItem("profile");
        if (!stored) return;
        const profile = JSON.parse(stored);
        const raw = profile.swipeOrder;
        if (raw) {
          const ids: number[] = JSON.parse(raw);
          if (ids.length === 0) {
            const swipeOrder = await userService.getSwipeOrder(
              profile.refreshSwipeTime! + 1,
            );
            if (JSON.parse(swipeOrder.data.data).length > 0) {
              profile.refreshSwipeTime! += 1;
              localStorage.setItem("profile", JSON.stringify(profile));
              setSwipeIds(JSON.parse(swipeOrder.data.data));
            }
          } else {
            setSwipeIds(ids);
          }
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

  /* ─── Skip users with no profile ─── */
  useEffect(() => {
    if (profileData && !profileData.profile && swipeIds.length > 0) {
      removeCurrentCard();
    }
  }, [profileData]);

  /* ─── Swipe actions ─── */
  const handleSwipe = async (action: "LIKE" | "DISLIKE") => {
    if (swiping || !profileData) return;
    setSwiping(true);
    try {
      const res = await swipeService.swipeAction(profileData.id, action);
      const isMatch = res.data.data;
      console.log(res.data.data);
      if (isMatch && action === "LIKE") {
        setMatchPopup(true);
      } else {
        await removeCurrentCard();
      }
    } catch {
      setError("Failed to process swipe.");
    } finally {
      setSwiping(false);
    }
  };

  const removeCurrentCard = async () => {
    const newSwipeIds = swipeIds.filter((_, idx) => idx !== currentIdx);
    setSwipeIds(newSwipeIds);
    setSlideKey((k) => k + 1);

    const storedProfile = localStorage.getItem("profile");
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        profile.swipeOrder = JSON.stringify(newSwipeIds);
        localStorage.setItem("profile", JSON.stringify(profile));
      } catch (e) {
        console.error("Failed to update swipeOrder in localStorage", e);
      }
    }

    try {
      await swipeService.updateSwipeOrder(newSwipeIds);
    } catch {}
  };

  const dismissMatchPopup = async () => {
    setMatchPopup(false);
    await removeCurrentCard();
  };

  /* ═══════ TAB BAR ═══════ */
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

  /* ═══════ MATCHES TAB ═══════ */
  if (activeTab === "matches") {
    return (
      <>
        <Header />
        <div className={styles.pageWrapper}>
          {TabBar}
          <MatchesTab
            matches={matches}
            matchesLoading={matchesLoading}
            matchesError={matchesError}
            styles={styles}
          />
        </div>
        <Footer />
      </>
    );
  }

  /* ═══════ DISCOVER TAB ═══════ */

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingText}>Discovering people…</div>
      </div>
    );
  }

  if (swipeIds.length === 0 || currentIdx >= swipeIds.length) {
    return (
      <>
        <Header />
        <div className={styles.pageWrapper}>
          {TabBar}
          <div className={styles.discoverLayout}>
            <div className={styles.emptyCard}>
              <h2>No more profiles</h2>
              <p>Check back later for new people to discover!</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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

  if (!profileData.profile) {
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

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        {TabBar}
        <DiscoverTab
          profileData={profileData}
          swipeIds={swipeIds}
          currentIdx={currentIdx}
          slideKey={slideKey}
          swiping={swiping}
          error={error}
          onSwipe={handleSwipe}
          matchPopup={matchPopup}
          onDismissMatchPopup={dismissMatchPopup}
          styles={styles}
        />
      </div>
      <Footer />
    </>
  );
};

export default Discover;
