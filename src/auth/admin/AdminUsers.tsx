import { Search, Shield, User, Trash2, Eye, X } from "lucide-react";
import styles from "./AdminUsers.module.css";
import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All Roles");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewUser, setViewUser] = useState<UserType | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users ❌");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      role === "All Roles" || user.role.toLowerCase() === role.toLowerCase();

    return matchSearch && matchRole;
  });

  const adminsCount = users.filter((user) => user.role === "admin").length;

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteUser(deleteId);
      setUsers((prev) => prev.filter((user) => user.id !== deleteId));
      toast.success("User deleted successfully ✅");
      setDeleteId(null);
    } catch (err) {
      toast.error("Error deleting user ❌");
    }
  };

  return (
    <div className={styles.page}>
      <ToastContainer position="top-right" autoClose={2500} />

      <div className={styles.header}>
        <div>
          <span className={styles.badge}>Customers</span>
          <h1>Users Management</h1>
          <p>View customers, roles, account status and activity.</p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <User size={22} />
          <div>
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <Shield size={22} />
          <div>
            <h3>Admins</h3>
            <p>{adminsCount}</p>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>All Roles</option>
          <option>Admin</option>
          <option>User</option>
        </select>
      </div>

      <div className={styles.tableCard}>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th className={styles.actionHead}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={
                        user.role === "admin"
                          ? styles.adminRole
                          : styles.userRole
                      }
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span className={styles.activeStatus}>Active</span>
                  </td>

                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => setViewUser(user)}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteId(user.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "30px" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <button
              className={styles.closeBtn}
              onClick={() => setDeleteId(null)}
            >
              <X size={18} />
            </button>

            <h2>Delete User?</h2>
            <p>Are you sure you want to delete this user?</p>

            <div className={styles.modalActions}>
              <button onClick={() => setDeleteId(null)}>Cancel</button>
              <button className={styles.dangerBtn} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {viewUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <button
              className={styles.closeBtn}
              onClick={() => setViewUser(null)}
            >
              <X size={18} />
            </button>

            <h2>User Details</h2>
            <p><b>Name:</b> {viewUser.name}</p>
            <p><b>Email:</b> {viewUser.email}</p>
            <p><b>Role:</b> {viewUser.role}</p>
            <p><b>Joined:</b> {new Date(viewUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}