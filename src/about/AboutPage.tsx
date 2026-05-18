import styles from "./AboutPage.module.css";

const AboutPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <span>About Shop.co</span>
          <h1>Simple shopping. Premium experience.</h1>
          <p>
            We bring quality fashion, smooth checkout, order tracking and reliable
            delivery into one clean ecommerce experience.
          </p>
        </section>

        <section className={styles.stats}>
          <div>
            <strong>10K+</strong>
            <span>Happy Customers</span>
          </div>
          <div>
            <strong>500+</strong>
            <span>Products</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Support</span>
          </div>
        </section>

        <section className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.icon}>🛍️</div>
            <h3>Curated Products</h3>
            <p>Products selected with quality, style and comfort in mind.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>🚚</div>
            <h3>Reliable Delivery</h3>
            <p>Track every order from placed to delivered with clear status.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>🔐</div>
            <h3>Secure Shopping</h3>
            <p>Safe checkout and protected customer information.</p>
          </div>
        </section>

        <section className={styles.story}>
          <h2>Our Story</h2>
          <p>
            Shop.co is built to make online shopping faster, cleaner and more
            enjoyable. From profile management to saved addresses and order tracking,
            every page is designed for a smooth customer journey.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;