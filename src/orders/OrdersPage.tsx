import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "./OrdersPage.module.css";
type OrderItem = {
  name: string;
  img: string;
  size?: string;
  color?: string;
  qty: number;
  price: number;
};
type AddressType = {
  fullName?: string;
  name?: string;

  phone?: string;
  mobile?: string;

  house?: string;
  street?: string;
  address?: string;

  city?: string;
  state?: string;

  pincode?: string;
};

type Order = {
  id: number;
  createdAt: string;
  status: string;
  paymentMethod: string;
  total: number;
  items: OrderItem[];

  addressId?: number;

  address?: AddressType;

  deliveredAt?: string;
  estimatedDelivery?: string;
};
const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

const fetchOrders = async () => {
  try {
    const res = await axios.get("https://shopco-backend-qtvr.onrender.com/api/order/my-orders");

    console.log("ORDERS RESPONSE:", res.data);
    console.log("FIRST ORDER:", res.data[0]);

    setOrders(res.data);

    if (res.data.length > 0) {
      setSelectedId(res.data[0].id);
    }
  } catch (err) {
    console.error("Orders error:", err);
  }
};

  const getImageUrl = (img: string) => {
    if (!img) return "/placeholder.png";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return `https://shopco-backend-qtvr.onrender.com${img}`;
    return `https://shopco-backend-qtvr.onrender.com/${img}`;
  };

  const getStep = (status: string) => {
    if (status === "Placed") return 1;
    if (status === "Shipped") return 2;
    if (status === "Delivered") return 3;
    if (status === "Cancelled") return 0;
    return 1;
  };

  const cancelOrder = async () => {
    if (!cancelId) return;

    try {
      await axios.patch(`https://shopco-backend-qtvr.onrender.com/api/order/cancel/${cancelId}`);
      await fetchOrders();
      setCancelId(null);
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };



  
  const filteredOrders = useMemo(() => {
    if (filter === "All") return orders;
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedId) || filteredOrders[0];

  const statuses = ["All", "Placed", "Shipped", "Delivered", "Cancelled"];

const address = selectedOrder?.address;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <span className={styles.smallLabel}>Account</span>
            <h1>My Orders</h1>
            <p>Track, review and manage all your purchases.</p>
          </div>

          <div className={styles.orderCount}>
            <strong>{orders.length}</strong>
            <span>Total Orders</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛍️</div>
            <h2>No orders found</h2>
            <p>Your purchased products will appear here.</p>
          </div>
        ) : (
          <div className={styles.layout}>
            <aside className={styles.leftPanel}>
              <div className={styles.filterBox}>
                {statuses.map((status) => (
                  <button
                    key={status}
                    className={filter === status ? styles.activeFilter : styles.filterBtn}
                    onClick={() => {
                      setFilter(status);
                      setSelectedId(null);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className={styles.orderList}>
                {filteredOrders.length === 0 ? (
                  <div className={styles.noFilter}>No {filter} orders</div>
                ) : (
                  filteredOrders.map((order) => (
                    <button
                      key={order.id}
                      className={
                        selectedOrder?.id === order.id
                          ? styles.activeOrder
                          : styles.orderMini
                      }
                      onClick={() => setSelectedId(order.id)}
                    >
                      <div className={styles.orderMiniTop}>
                        <strong>#{order.id}</strong>
                        <span className={`${styles.statusBadge} ${styles[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className={styles.orderMiniItems}>
                        {order.items.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={getImageUrl(item.img)}
                            alt={item.name}
                          />
                        ))}
                      </div>

                      <div className={styles.orderMiniBottom}>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <strong>${order.total}</strong>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </aside>

            {selectedOrder && (
              <main className={styles.detailsPanel}>
                <div className={styles.detailsHeader}>
                  <div>
                    <span className={styles.smallLabel}>Selected Order</span>
                    <h2>Order #{selectedOrder.id}</h2>
                    <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>

                  <div className={styles.headerActions}>
                    <span
                      className={`${styles.statusLarge} ${
                        styles[selectedOrder.status] || ""
                      }`}
                    >
                      {selectedOrder.status}
                    </span>

                    {selectedOrder.status !== "Cancelled" &&
                      selectedOrder.status !== "Delivered" && (
                        <button
                          className={styles.cancelBtn}
                          onClick={() => setCancelId(selectedOrder.id)}
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>

                <div className={styles.trackingCard}>
                  <h3>Delivery Status</h3>

                  {selectedOrder.status === "Cancelled" ? (
                    <div className={styles.cancelledBox}>
                      This order has been cancelled.
                    </div>
                  ) : (
                    <div className={styles.tracking}>
                      {["Placed", "Shipped", "Delivered"].map((stepName, index) => {
                        const step = getStep(selectedOrder.status);
                        const done = step >= index + 1;

                        return (
                          <div className={styles.trackGroup} key={stepName}>
                            <div className={done ? styles.doneCircle : styles.circle}>
                              {done ? "✓" : index + 1}
                            </div>
                            <p className={done ? styles.doneText : ""}>{stepName}</p>
                            {index !== 2 && (
                              <div className={done ? styles.doneLine : styles.line}></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoCard}>
                    <h3>Delivery Address</h3>
                  {address ? (
  <>
    <strong>
      {address.fullName || address.name || "Customer"}
    </strong>

    <p>
      {address.house || address.street || address.address}
      <br />
      {address.city}, {address.state}
      <br />
      {address.pincode}
      <br />
      Phone: {address.phone || address.mobile}
    </p>
  </>
) : (
  <p>No address available</p>
)}
                  </div>

                  <div className={styles.infoCard}>
                    <h3>Payment Details</h3>
                    <p>Method: {selectedOrder.paymentMethod}</p>
                    <p>Items: {selectedOrder.items.length}</p>
                    <strong>Total: ${selectedOrder.total}</strong>
                  </div>

                  <div className={styles.infoCard}>
                    <h3>Order Date</h3>
                    <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>

                  <div className={styles.infoCard}>
                    <h3>Delivery Date</h3>
                    <p>
                      {selectedOrder.deliveredAt
                        ? new Date(selectedOrder.deliveredAt).toLocaleString()
                        : selectedOrder.estimatedDelivery
                        ? new Date(selectedOrder.estimatedDelivery).toLocaleDateString()
                        : selectedOrder.status === "Delivered"
                        ? "Delivered"
                        : "Not delivered yet"}
                    </p>
                  </div>
                </div>

                <div className={styles.productsCard}>
                  <h3>Ordered Items</h3>

                  <div className={styles.products}>
                    {selectedOrder.items.map((item, index) => (
                      <div className={styles.productItem} key={index}>
                        <img src={getImageUrl(item.img)} alt={item.name} />

                        <div className={styles.productInfo}>
                          <h4>{item.name}</h4>
                          <p>
                            {item.size || "Size N/A"} • {item.color || "Color N/A"} • Qty{" "}
                            {item.qty}
                          </p>
                        </div>

                        <strong>${item.price * item.qty}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            )}
          </div>
        )}

        {cancelId && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <div className={styles.warningIcon}>!</div>
              <h3>Cancel Order?</h3>
              <p>Are you sure you want to cancel this order?</p>

              <div className={styles.modalActions}>
                <button className={styles.noBtn} onClick={() => setCancelId(null)}>
                  No
                </button>

                <button className={styles.yesBtn} onClick={cancelOrder}>
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;