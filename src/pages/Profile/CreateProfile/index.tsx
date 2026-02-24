import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Profile.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import { ROUTES } from "@/constants";
import type { CreateProfileRequest } from "@/types";

const CreateProfile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState<CreateProfileRequest>({
    firstName: "",
    lastName: "",
    displayName: "",
    phoneNumber: "",
    birthday: "",
    gender: "MALE",
    bio: "",
    city: "",
    country: "",
    occupation: "",
    company: "",
    school: "",
    heightCm: undefined,
    drinkingHabit: undefined,
    smokingHabit: undefined,
    zodiacSign: undefined,
    interestedIn: undefined,
    minAgePreference: 18,
    maxAgePreference: 30,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "heightCm" ||
        name === "minAgePreference" ||
        name === "maxAgePreference"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const validate = (): string | null => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.birthday) return "Birthday is required.";
    if (new Date(form.birthday) >= new Date())
      return "Birthday must be a past date.";
    if (
      form.heightCm !== undefined &&
      (form.heightCm < 50 || form.heightCm > 300)
    )
      return "Height must be between 50 and 300 cm.";
    if (
      form.minAgePreference !== undefined &&
      (form.minAgePreference < 18 || form.minAgePreference > 50)
    )
      return "Min age preference must be between 18 and 50.";
    if (
      form.maxAgePreference !== undefined &&
      (form.maxAgePreference < 18 || form.maxAgePreference > 50)
    )
      return "Max age preference must be between 18 and 50.";
    if (
      form.minAgePreference !== undefined &&
      form.maxAgePreference !== undefined &&
      form.minAgePreference > form.maxAgePreference
    )
      return "Min age cannot be greater than max age.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user) {
      setError("User not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      await userService.createProfile(user.id, form);
      await refreshUser();
      navigate(ROUTES.PROFILE_ME);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Failed to create profile. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.profilePageWrapper}>
        <form className={styles.profileContainer} onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <h1 className={styles.pageTitle}>Create Your Profile</h1>
            <p className={styles.pageSubtitle}>
              Tell us about yourself so we can find your perfect match.
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {/* ─── Basic Info ─── */}
          <div className={styles.formSectionCard}>
            <h3 className={styles.sectionTitle}>Basic Info</h3>

            <div className={styles.fieldRow}>
              <div>
                <label className={styles.label}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className={styles.input}
                  placeholder="Hao"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={styles.label}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={styles.input}
                  placeholder="Phu"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div>
                <label className={styles.label}>Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  className={styles.input}
                  placeholder="HaoPhu"
                  value={form.displayName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className={styles.input}
                  placeholder="0123456789"
                  value={form.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div>
                <label className={styles.label}>Birthday *</label>
                <input
                  type="date"
                  name="birthday"
                  className={styles.input}
                  value={form.birthday}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={styles.label}>Gender *</label>
                <select
                  name="gender"
                  className={styles.select}
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NON_BINARY">Non Binary</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldRowSingle}>
              <label className={styles.label}>Bio</label>
              <textarea
                name="bio"
                className={styles.textarea}
                placeholder="Tell us about yourself..."
                value={form.bio}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ─── Location & Work ─── */}
          <div className={styles.formSectionCard}>
            <h3 className={styles.sectionTitle}>Location & Work</h3>

            <div className={styles.fieldRow}>
              <div>
                <label className={styles.label}>City</label>
                <input
                  type="text"
                  name="city"
                  className={styles.input}
                  placeholder="Ho Chi Minh"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={styles.label}>Country</label>
                <input
                  type="text"
                  name="country"
                  className={styles.input}
                  placeholder="Vietnam"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div>
                <label className={styles.label}>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  className={styles.input}
                  placeholder="Developer"
                  value={form.occupation}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={styles.label}>Company</label>
                <input
                  type="text"
                  name="company"
                  className={styles.input}
                  placeholder="ABC Corp"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.fieldRowSingle}>
              <label className={styles.label}>School</label>
              <input
                type="text"
                name="school"
                className={styles.input}
                placeholder="HCMUT"
                value={form.school}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ─── Lifestyle ─── */}
          <div className={styles.formSectionCard}>
            <h3 className={styles.sectionTitle}>Lifestyle</h3>

            <div className={styles.fieldRow}>
              <div>
                <label className={styles.label}>Height (cm)</label>
                <input
                  type="number"
                  name="heightCm"
                  className={styles.input}
                  placeholder="170"
                  min={50}
                  max={300}
                  value={form.heightCm ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={styles.label}>Zodiac Sign</label>
                <select
                  name="zodiacSign"
                  className={styles.select}
                  value={form.zodiacSign ?? ""}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  {[
                    "ARIES",
                    "TAURUS",
                    "GEMINI",
                    "CANCER",
                    "LEO",
                    "VIRGO",
                    "LIBRA",
                    "SCORPIO",
                    "SAGITTARIUS",
                    "CAPRICORN",
                    "AQUARIUS",
                    "PISCES",
                  ].map((z) => (
                    <option key={z} value={z}>
                      {z.charAt(0) + z.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div>
                <label className={styles.label}>Drinking</label>
                <select
                  name="drinkingHabit"
                  className={styles.select}
                  value={form.drinkingHabit ?? ""}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="NEVER">No</option>
                  <option value="SOCIALLY">Social</option>
                  <option value="REGULARLY">Regular</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Smoking</label>
                <select
                  name="smokingHabit"
                  className={styles.select}
                  value={form.smokingHabit ?? ""}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="NEVER">No</option>
                  <option value="SOCIALLY">Social</option>
                  <option value="REGULARLY">Regular</option>
                </select>
              </div>
            </div>
          </div>

          {/* ─── Preferences ─── */}
          <div className={styles.formSectionCard}>
            <h3 className={styles.sectionTitle}>Preferences</h3>

            <div className={styles.fieldRow}>
              <div>
                <label className={styles.label}>Interested In</label>
                <select
                  name="interestedIn"
                  className={styles.select}
                  value={form.interestedIn ?? ""}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>
              <div />
            </div>

            <div className={styles.fieldRow}>
              <div>
                <label className={styles.label}>Min Age</label>
                <input
                  type="number"
                  name="minAgePreference"
                  className={styles.input}
                  min={18}
                  max={50}
                  value={form.minAgePreference ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={styles.label}>Max Age</label>
                <input
                  type="number"
                  name="maxAgePreference"
                  className={styles.input}
                  min={18}
                  max={50}
                  value={form.maxAgePreference ?? ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ─── Photos ─── */}
          <div className={styles.formSectionCard}>
            <h3 className={styles.sectionTitle}>Photos</h3>
            <p
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.4)",
                margin: "0 0 0.75rem",
              }}
            >
              You can add photos after creating your profile.
            </p>
            <div className={styles.photoGrid}>
              <div className={styles.photoSlot}>+</div>
              <div className={styles.photoSlot}>+</div>
              <div className={styles.photoSlot}>+</div>
            </div>
          </div>

          {/* ─── Actions ─── */}
          <div className={styles.actionsCard}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Creating Profile..." : "Create Profile"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateProfile;
