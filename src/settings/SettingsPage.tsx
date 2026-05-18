import { useEffect, useState } from "react";
import styles from "./SettingsPage.module.css";
const SettingsPage = () => {
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);
const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);

useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}, [darkMode]);

const toggleDarkMode = () => {
  const newMode = !darkMode;
  const theme = newMode ? "dark" : "light";

  setDarkMode(newMode);
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
};

  return (
    <div className={`${styles.page} ${darkMode ? styles.dark : ""}`}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <span>Account</span>
          <h1>Settings</h1>
          <p>Manage your preferences, notifications and account privacy.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Profile Preferences</h2>

            <div className={styles.field}>
              <label>Display Name</label>
              <input placeholder="Enter your name" />
            </div>

            <div className={styles.field}>
              <label>Email Address</label>
              <input placeholder="example@gmail.com" />
            </div>

            <button className={styles.primaryBtn}>Save Changes</button>
          </div>

          <div className={styles.card}>
            <h2>Notifications</h2>

            <div className={styles.settingRow}>
              <div>
                <h3>Email Notifications</h3>
                <p>Receive order updates through email.</p>
              </div>
              <button
                className={emailNotify ? styles.switchOn : styles.switch}
                onClick={() => setEmailNotify(!emailNotify)}
              >
                <span></span>
              </button>
            </div>

            <div className={styles.settingRow}>
              <div>
                <h3>SMS Alerts</h3>
                <p>Get delivery status updates on phone.</p>
              </div>
              <button
                className={smsNotify ? styles.switchOn : styles.switch}
                onClick={() => setSmsNotify(!smsNotify)}
              >
                <span></span>
              </button>
            </div>

            <div className={styles.settingRow}>
              <div>
                <h3>Dark Mode</h3>
                <p>Use dark appearance for better night browsing.</p>
              </div>
            <button
  className={darkMode ? styles.switchOn : styles.switch}
  onClick={toggleDarkMode}
>
  <span></span>
</button>
            </div>
          </div>

          <div className={styles.card}>
            <h2>Security</h2>

            <div className={styles.field}>
              <label>Current Password</label>
              <input type="password" placeholder="Current password" />
            </div>

            <div className={styles.field}>
              <label>New Password</label>
              <input type="password" placeholder="New password" />
            </div>

            <button className={styles.dangerBtn}>Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;