import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Verify session
        const userRes = await api.get("/auth/me");
        setUser(userRes.data.user);

        // 2. Fetch protected data
        const itemsRes = await api.get("/items");
        setItems(itemsRes.data);
      } catch (err) {
        console.error("Not authenticated", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // Will redirect

  return (
    <div className="dashboard-container">
      <header>
        <h1>Welcome, {user.email}</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section>
        <h2>Your Items</h2>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
