import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.newsletter}>
        <h2>STAY UPTO DATE ABOUT<br />OUR LATEST OFFERS</h2>

        <div className={styles.subscribe}>
          <input type="email" placeholder="Enter your email address" />
          <button>Subscribe to Newsletter</button>
        </div>
      </div>

      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <h2>SHOP.CO</h2>
          <p>
            We have clothes that suits your style and which you’re proud to wear.
            From women to men.
          </p>

          <div className={styles.socials}>
            <span>𝕏</span>
            <span>f</span>
            <span>◎</span>
            <span>⌾</span>
          </div>
        </div>

        <FooterColumn
          title="COMPANY"
          links={["About", "Features", "Works", "Career"]}
        />
        <FooterColumn
          title="HELP"
          links={["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"]}
        />
        <FooterColumn
          title="FAQ"
          links={["Account", "Manage Deliveries", "Orders", "Payments"]}
        />
        <FooterColumn
          title="RESOURCES"
          links={["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"]}
        />
      </div>

      <div className={styles.bottom}>
        <p>Shop.co © 2000-2023, All Rights Reserved</p>

        <div className={styles.payments}>
          <span>VISA</span>
          <span>🔴</span>
          <span>PayPal</span>
          <span>Pay</span>
          <span>GPay</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className={styles.column}>
      <h4>{title}</h4>
      {links.map((link) => (
        <a href="#" key={link}>{link}</a>
      ))}
    </div>
  );
}