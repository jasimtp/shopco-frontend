import { useState } from "react";
import styles from "./HelpContactPage.module.css";

const faqs = [
  {
    q: "How can I track my order?",
    a: "Go to My Orders page and select an order to view delivery status.",
  },
  {
    q: "Can I cancel an order?",
    a: "Yes, you can cancel orders before they are delivered.",
  },
  {
    q: "How do I change delivery address?",
    a: "Go to Profile page and update your saved addresses.",
  },
];

const HelpContactPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <span>Support</span>
          <h1>Help & Contact</h1>
          <p>Need help? Contact us or find answers to common questions.</p>
        </div>

        <div className={styles.layout}>
          <section className={styles.contactCard}>
            <h2>Contact Us</h2>

            <div className={styles.field}>
              <label>Your Name</label>
              <input placeholder="Enter your name" />
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input placeholder="example@gmail.com" />
            </div>

            <div className={styles.field}>
              <label>Message</label>
              <textarea placeholder="How can we help you?" />
            </div>

            <button className={styles.sendBtn}>Send Message</button>
          </section>

          <section className={styles.side}>
            <div className={styles.quickCard}>
              <h2>Quick Support</h2>

              <div className={styles.supportItem}>
                <span>📧</span>
                <div>
                  <h3>Email</h3>
                  <p>support@shopco.com</p>
                </div>
              </div>

              <div className={styles.supportItem}>
                <span>📞</span>
                <div>
                  <h3>Phone</h3>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className={styles.supportItem}>
                <span>⏱️</span>
                <div>
                  <h3>Working Hours</h3>
                  <p>Mon - Sat, 9 AM - 8 PM</p>
                </div>
              </div>
            </div>

            <div className={styles.faqCard}>
              <h2>FAQs</h2>

              {faqs.map((faq, index) => (
                <div className={styles.faqItem} key={index}>
                  <button onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                    {faq.q}
                    <span>{openIndex === index ? "−" : "+"}</span>
                  </button>

                  {openIndex === index && <p>{faq.a}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpContactPage;