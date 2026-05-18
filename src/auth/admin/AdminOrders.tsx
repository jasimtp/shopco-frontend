import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Eye, Truck, CheckCircle, Clock } from "lucide-react";
import styles from "./AdminOrders.module.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://shopco-backend-qtvr.onrender.com/api/order");
      setOrders(res.data);
    } catch (err) {
      console.error("Admin orders error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`https://shopco-backend-qtvr.onrender.com/api/order/status/${id}`, {
        status,
      });

      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchText = `
      ${order.id}
      ${order.userId}
      ${order.paymentMethod}
      ${order.deliveryMethod}
      ${order.status}
    `.toLowerCase();

    const matchSearch = searchText.includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All Status" || order.status === statusFilter;

    return matchSearch && matchStatus;
  });

const getImageUrl = (img: string) => {
  if (!img) return "/placeholder.png";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return `https://shopco-backend-qtvr.onrender.com${img}`;
  return `https://shopco-backend-qtvr.onrender.com/${img}`;
};

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <span className={styles.badge}>Orders</span>
          <h1>Order Management</h1>
          <p>Track, manage and update customer orders.</p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <Clock size={22} />
          <div>
            <h3>Placed</h3>
            <p>{orders.filter((o) => o.status === "Placed").length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <Truck size={22} />
          <div>
            <h3>Shipped</h3>
            <p>{orders.filter((o) => o.status === "Shipped").length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <CheckCircle size={22} />
          <div>
            <h3>Delivered</h3>
            <p>{orders.filter((o) => o.status === "Delivered").length}</p>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Placed</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className={styles.tableCard}>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>User ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Update Status</th>
              <th className={styles.actionHead}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "30px" }}>
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.id}</strong>
                  </td>

                  <td>{order.userId || "Guest"}</td>

                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                  <td>{order.items?.length || 0}</td>

                  <td>₹{order.total}</td>

                  <td>{order.paymentMethod}</td>

                  <td>
                    <span
                      className={
                        order.status === "Delivered"
                          ? styles.delivered
                          : order.status === "Shipped"
                          ? styles.shipped
                          : styles.pending
                      }
                    >
                      {order.status}
                    </span>
                  </td>

                <td>
  <select
    className={styles.statusSelect}
    value={order.status}
    onChange={(e) => updateStatus(order.id, e.target.value)}
  >
    <option value="Placed">Placed</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</td>

                  <td>
                    <button
  className={styles.viewBtn}
  onClick={() => setSelectedOrder(order)}
>
  <Eye size={16} />
  View
</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>Order #{selectedOrder.id}</h2>

        <button onClick={() => setSelectedOrder(null)}>✕</button>
      </div>

      <div className={styles.modalBody}>
        <p>
          <strong>Status:</strong> {selectedOrder.status}
        </p>

        <p>
          <strong>Total:</strong> ₹{selectedOrder.total}
        </p>

        <p>
          <strong>Payment:</strong> {selectedOrder.paymentMethod}
        </p>

        <p>
          <strong>Delivery:</strong> {selectedOrder.deliveryMethod}
        </p>

        <hr />

        <h3>Items</h3>

        {selectedOrder.items?.map((item: any, index: number) => (
          <div key={index} className={styles.modalItem}>
           <img
  src={getImageUrl(item.img)}
  alt={item.name}
/>

            <div>
              <h4>{item.name}</h4>

              <p>
                {item.size} • {item.color}
              </p>

              <strong>
                ₹{item.price} × {item.qty}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
    </div>
    
  );
}