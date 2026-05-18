import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./UpiPaymentPage.module.css";

const scannerImg = "/scaner.png";
const gpayLogo = "/gpay.png";
const phonepeLogo = "/phonepay.png";
const paytmLogo = "/paytm.png";

const shopUpiId = "yourupi@bank";
const shopName = "SHOP.CO";

type UpiApp = {
  id: string;
  name: string;
  logo: string;
};

const upiApps: UpiApp[] = [
  {
    id: "gpay",
    name: "Google Pay",
    logo: gpayLogo,
  },
  {
    id: "phonepe",
    name: "PhonePe",
    logo: phonepeLogo,
  },
  {
    id: "paytm",
    name: "Paytm",
    logo: paytmLogo,
  },
];

export default function UpiPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const amount = location.state?.amount || 2499;
  const itemCount = location.state?.itemCount || 1;

  const [orderId] = useState(
    location.state?.orderId || "SHOP" + Date.now().toString().slice(-6)
  );

  const [selectedApp, setSelectedApp] = useState<UpiApp>(upiApps[0]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

const handlePayment = (app: UpiApp) => {
  if (timeLeft <= 0) {
    alert("Payment time expired. Please go back to checkout.");
    return;
  }

  setSelectedApp(app);
  setLoading(true);
  setSuccess(false);

  setTimeout(() => {
    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      navigate("/orders");
    }, 1200);
  }, 3000);
};;

  return (
    <main className={styles.upiPage}>
      <section className={styles.paymentBox}>
        <div className={styles.leftBox}>
          <Link to="/checkout" className={styles.backLink}>
            ←
          </Link>

          <p className={styles.subtitle}>
            Select your preferred UPI app and complete your SHOP.CO payment.
          </p>

          <div className={styles.orderInfo}>
            <div>
              <span>Order ID</span>
              <strong>#{orderId}</strong>
            </div>

            <div>
              <span>Items</span>
              <strong>
                {itemCount} Product{itemCount > 1 ? "s" : ""}
              </strong>
            </div>

            <div>
              <span>Total Amount</span>
              <strong>₹{amount.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className={styles.appList}>
            {upiApps.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => handlePayment(app)}
                className={`${styles.appItem} ${
                  selectedApp.id === app.id ? styles.active : ""
                }`}
              >
                <div className={styles.logoBox}>
                  <img src={app.logo} alt={app.name} />
                </div>

                <span className={styles.appText}>
                  <strong>{app.name}</strong>
                  <small>
                    {loading && selectedApp.id === app.id
                      ? `Opening ${app.name}...`
                      : `Click to pay with ${app.name}`}
                  </small>
                </span>

                {loading && selectedApp.id === app.id && (
                  <span className={styles.loader}></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.rightBox}>
          <div className={styles.scannerCard}>
            <h2>SHOP.CO</h2>
            <p className={styles.scanTitle}>Scan & Pay</p>

            <div className={styles.amountBox}>
              Amount: <strong>₹{amount.toLocaleString("en-IN")}</strong>
            </div>

            <div className={styles.timerBox}>
              Expires in:{" "}
              <strong>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </strong>
            </div>

            <div className={styles.qrBox}>
              <img src={scannerImg} alt="SHOP.CO UPI Scanner" />
            </div>

            <p className={styles.scanText}>Scan this QR using any UPI app</p>
<button
  type="button"
  className={styles.payBtn}
  onClick={() => handlePayment(selectedApp)}
  disabled={loading || timeLeft <= 0}
>
  {timeLeft <= 0
    ? "Payment Expired"
    : loading
    ? "Processing Order..."
    : success
    ? "Order Successful"
    : `Pay ₹${amount.toLocaleString("en-IN")}`}
</button>
{loading && (
  <div className={styles.deliveryAnim}>
    <div className={styles.box}>📦</div>
    <div className={styles.truck}>🚚</div>
    <p>Processing your order...</p>
  </div>
)}

{success && (
  <div className={styles.successBox}>
    ✅ Order Successful
  </div>
)}

            <div className={styles.secureBadge}>🔒 100% Secure UPI Payment</div>
          </div>
        </div>
      </section>
    </main>
  );
}