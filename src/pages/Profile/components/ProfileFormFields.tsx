import type { CreateProfileRequest } from "@/types";

interface ProfileFormFieldsProps {
  form: CreateProfileRequest;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  styles: Record<string, string>;
  /** Placeholders only shown in create mode */
  showPlaceholders?: boolean;
}

const ProfileFormFields = ({
  form,
  handleChange,
  styles,
  showPlaceholders = false,
}: ProfileFormFieldsProps) => {
  return (
    <>
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
              placeholder={showPlaceholders ? "Hao" : undefined}
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
              placeholder={showPlaceholders ? "Phu" : undefined}
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
              placeholder={showPlaceholders ? "HaoPhu" : undefined}
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
              placeholder={showPlaceholders ? "0123456789" : undefined}
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
            placeholder={
              showPlaceholders ? "Tell us about yourself..." : undefined
            }
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
              placeholder={showPlaceholders ? "Ho Chi Minh" : undefined}
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
              placeholder={showPlaceholders ? "Vietnam" : undefined}
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
              placeholder={showPlaceholders ? "Developer" : undefined}
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
              placeholder={showPlaceholders ? "ABC Corp" : undefined}
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
            placeholder={showPlaceholders ? "HCMUT" : undefined}
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
              placeholder={showPlaceholders ? "170" : undefined}
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
    </>
  );
};

export default ProfileFormFields;
