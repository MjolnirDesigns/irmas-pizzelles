import { useState } from "react";
import { Link } from "wouter";

interface AdminOrder {
  id: string;
  orderNumber: string;
  email: string;
  status: string;
  paymentState: string | null;
  fulfillmentMethod: string | null;
  total: string;
  batchLabel: string | null;
  createdAt: string;
  shippingState: string | null;
  shippingCity: string | null;
  items: Array<{ id: string; productName: string; quantity: number; flavor: string | null; packSize: string | null }>;
}

export default function AdminOrders() {
  const [token, setToken] = useState(() => sessionStorage.getItem("irmas-admin-token") || "");
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState("");
  const [database, setDatabase] = useState<boolean | null>(null);

  async function load(nextToken = token) {
    setError("");
    sessionStorage.setItem("irmas-admin-token", nextToken);
    const response = await fetch("/api/admin/orders", {
      headers: nextToken ? { "x-admin-token": nextToken } : {},
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setOrders(null);
      setError(body.message || body.error || "The order desk is locked.");
      return;
    }
    setOrders(body.orders);
    setDatabase(body.databaseConfigured);
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] px-5 py-10 text-[#1c1915]" style={{ fontFamily: "Outfit, sans-serif" }}>
      <div className="mx-auto max-w-5xl">
        <Link href="/v" className="text-sm underline underline-offset-4">Directions</Link>
        <h1 className="mt-4 text-4xl" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>Order desk</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5c564c]">
          Set ADMIN_TOKEN and paste it here. If a session already has a user id, that also opens the desk. Orders live in Postgres when DATABASE_URL is set, and in memory otherwise.
        </p>
        <form
          className="mt-6 flex flex-wrap gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void load();
          }}
        >
          <label className="text-sm">
            Admin token
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-1 block w-64 border border-[#d9d1c6] bg-white px-3 py-2"
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="self-end bg-[#1c1915] px-4 py-2 text-sm text-[#f4f1ea]">
            Open
          </button>
        </form>
        {error && <p role="alert" className="mt-4 text-sm">{error}</p>}
        {database !== null && (
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#5c564c]">
            {database ? "Postgres" : "In-memory — restart clears these orders"}
          </p>
        )}
        {orders && (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#d9d1c6] text-xs uppercase tracking-[0.14em] text-[#5c564c]">
                  <th className="py-2 pr-4">Order</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Items</th>
                  <th className="py-2 pr-4">Fulfillment</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={6} className="py-6">No orders yet.</td></tr>
                )}
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#ece6dc] align-top">
                    <td className="py-3 pr-4">
                      <div>{order.orderNumber}</div>
                      <div className="text-xs text-[#5c564c]">{order.paymentState}</div>
                    </td>
                    <td className="py-3 pr-4">{order.email}</td>
                    <td className="py-3 pr-4">
                      {order.items.map((item) => (
                        <div key={item.id}>{item.quantity} × {item.flavor} {item.packSize}</div>
                      ))}
                    </td>
                    <td className="py-3 pr-4">
                      {order.fulfillmentMethod}
                      {order.shippingCity ? ` · ${order.shippingCity}, ${order.shippingState}` : ""}
                    </td>
                    <td className="py-3 pr-4">${order.total}</td>
                    <td className="py-3">
                      <label className="sr-only" htmlFor={`status-${order.id}`}>Status for {order.orderNumber}</label>
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        onChange={(event) => void setStatus(order.id, event.target.value)}
                        className="border border-[#d9d1c6] bg-white px-2 py-1"
                      >
                        {["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"].map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
