"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  phone: string;
  location: string | null;
  order_count: number;
  last_order_at: string | null;
  created_at: string;
};

type OrderItem = {
  id: string;
  item_name: string;
  item_type: string | null;
  price: number;
  quantity: number;
  item_count: number | null;
  details: string | null;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_method: string | null;
  area: string | null;
  delivery_location: string | null;
  order_date: string | null;
  payment_method: string | null;
  gift: boolean;
  notes: string | null;
  subtotal: number;
  gift_fee: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  order_items: OrderItem[];
};

export default function AdminPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openOrder, setOpenOrder] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [customersResponse, ordersResponse] = await Promise.all([
          fetch("/api/admin/customers"),
          fetch("/api/admin/order-history"),
        ]);

        if (!customersResponse.ok) {
          const errorText = await customersResponse.text();

          console.error(
            "Admin customers API error:",
            customersResponse.status,
            errorText
          );

          throw new Error("Could not load customers.");
        }

        if (!ordersResponse.ok) {
          const errorText = await ordersResponse.text();

          console.error(
            "Admin orders API error:",
            ordersResponse.status,
            errorText
          );

          throw new Error("Could not load orders.");
        }

        const customersData = await customersResponse.json();
        const ordersData = await ordersResponse.json();

        setCustomers(customersData.customers || []);
        setOrders(ordersData.orders || []);
      } catch (error) {
        console.error(error);
        setError("Could not load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const escapeHtml = (value: string) => {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const printOrder = (order: Order) => {
    const printWindow = window.open("", "_blank", "width=800,height=900");

    if (!printWindow) {
      alert("Please allow pop-ups to print the order.");
      return;
    }

    const orderDate = order.order_date
      ? new Date(order.order_date).toLocaleDateString()
      : new Date(order.created_at).toLocaleDateString();

    const itemsHtml = order.order_items
      .map(
        (item) => `
          <div class="item">
            <div>
              <div class="item-name">
                ${escapeHtml(item.item_name)} × ${item.quantity}
              </div>
              ${
                item.details
                  ? `<div class="details">${escapeHtml(item.details)}</div>`
                  : ""
              }
            </div>

            <div class="price">
              AED ${(Number(item.price) * item.quantity).toFixed(2)}
            </div>
          </div>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cookie Corner Order</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 30px;
              font-family: Arial, sans-serif;
              color: #332321;
              background: white;
            }

            .receipt {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
            }

            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #efd7dc;
            }

            .logo {
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 1px;
            }

            .subtitle {
              margin-top: 6px;
              color: #9d7770;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }

            .customer {
              padding: 20px 0;
              border-bottom: 1px solid #efd7dc;
            }

            .customer-name {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 6px;
            }

            .info {
              font-size: 14px;
              line-height: 1.7;
            }

            .section {
              padding: 20px 0;
              border-bottom: 1px solid #efd7dc;
            }

            .section-title {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              color: #9d7770;
              margin-bottom: 12px;
              font-weight: bold;
            }

            .item {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding: 7px 0;
              font-size: 14px;
            }

            .item-name {
              font-weight: 600;
            }

            .details {
              margin-top: 3px;
              font-size: 12px;
              color: #765b55;
            }

            .price {
              white-space: nowrap;
            }

            .totals {
              padding-top: 20px;
            }

            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              font-size: 14px;
            }

            .total {
              margin-top: 10px;
              padding-top: 12px;
              border-top: 2px solid #332321;
              font-size: 18px;
              font-weight: bold;
            }

            .notes {
              white-space: pre-wrap;
            }

            .footer {
              text-align: center;
              margin-top: 30px;
              color: #9d7770;
              font-size: 12px;
            }

            @media print {
              body {
                padding: 0;
              }

              .receipt {
                max-width: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="receipt">

            <div class="header">
              <div class="logo">COOKIE CORNER</div>
              <div class="subtitle">Order</div>
            </div>

            <div class="customer">
              <div class="customer-name">
                ${escapeHtml(order.customer_name)}
              </div>

              <div class="info">
                <strong>Phone:</strong>
                ${escapeHtml(order.customer_phone)}
                <br />

                <strong>Date:</strong>
                ${escapeHtml(orderDate)}
                <br />

                <strong>Method:</strong>
                ${escapeHtml(order.order_method || "—")}
              </div>
            </div>

            <div class="section">
              <div class="section-title">Order</div>

              ${itemsHtml}
            </div>

            <div class="section">
              <div class="section-title">Details</div>

              <div class="info">
                <strong>Payment:</strong>
                ${escapeHtml(order.payment_method || "—")}
                <br />

                ${
                  order.order_method === "Delivery"
                    ? `
                      <strong>Area:</strong>
                      ${escapeHtml(order.area || "—")}
                      <br />

                      <strong>Location:</strong>
                      ${escapeHtml(order.delivery_location || "—")}
                      <br />
                    `
                    : ""
                }

                <strong>Gift:</strong>
                ${order.gift ? "Yes (+ AED 5)" : "No"}
                <br />

                <strong>Notes:</strong>
                <span class="notes">${escapeHtml(order.notes || "None")}</span>
              </div>
            </div>

            <div class="totals">
              <div class="total-row">
                <span>Subtotal</span>
                <span>AED ${Number(order.subtotal).toFixed(2)}</span>
              </div>

              ${
                Number(order.gift_fee) > 0
                  ? `
                    <div class="total-row">
                      <span>Gift fee</span>
                      <span>AED ${Number(order.gift_fee).toFixed(2)}</span>
                    </div>
                  `
                  : ""
              }

              ${
                Number(order.delivery_fee) > 0
                  ? `
                    <div class="total-row">
                      <span>Delivery fee</span>
                      <span>AED ${Number(order.delivery_fee).toFixed(2)}</span>
                    </div>
                  `
                  : ""
              }

              <div class="total-row total">
                <span>Total</span>
                <span>AED ${Number(order.total).toFixed(2)}</span>
              </div>
            </div>

            <div class="footer">
              Cookie Corner ♡
            </div>

          </div>

          <script>
            window.onload = function () {
              window.print();
            };

            window.onafterprint = function () {
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <main className="min-h-screen bg-[#fff8f7] px-5 py-10 text-[#332321] md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9d7770]">
            Cookie Corner
          </p>

          <h1 className="mt-2 text-4xl font-semibold">
            Customer Dashboard
          </h1>

          <p className="mt-2 text-[#765b55]">
            Your customers and their order history.
          </p>
        </div>

        {/* STATS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#efd7dc] bg-white p-6">
            <p className="text-sm text-[#9d7770]">
              Total customers
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {customers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#efd7dc] bg-white p-6">
            <p className="text-sm text-[#9d7770]">
              Total orders
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {orders.length}
            </p>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-[#efd7dc] bg-white p-8 text-center">
            Loading dashboard...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* CUSTOMERS */}

            <div className="mb-10">
              <h2 className="mb-4 text-2xl font-semibold">
                Customers
              </h2>

              <div className="overflow-hidden rounded-2xl border border-[#efd7dc] bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left">
                    <thead className="border-b border-[#efd7dc] bg-[#fff5f6]">
                      <tr>
                        <th className="px-6 py-4 text-sm font-medium">
                          Customer
                        </th>

                        <th className="px-6 py-4 text-sm font-medium">
                          Phone
                        </th>

                        <th className="px-6 py-4 text-sm font-medium">
                          Location
                        </th>

                        <th className="px-6 py-4 text-sm font-medium">
                          Orders
                        </th>

                        <th className="px-6 py-4 text-sm font-medium">
                          Last order
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {customers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="border-b border-[#f3e5e7] last:border-b-0"
                        >
                          <td className="px-6 py-5 font-medium">
                            {customer.name}
                          </td>

                          <td className="px-6 py-5">
                            {customer.phone}
                          </td>

                          <td className="px-6 py-5">
                            {customer.location || "—"}
                          </td>

                          <td className="px-6 py-5">
                            {customer.order_count}
                          </td>

                          <td className="px-6 py-5">
                            {customer.last_order_at
                              ? new Date(
                                  customer.last_order_at
                                ).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}

                      {customers.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-[#9d7770]"
                          >
                            No customers yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ORDERS */}

            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                Orders
              </h2>

              {orders.length === 0 ? (
                <div className="rounded-2xl border border-[#efd7dc] bg-white p-8 text-center text-[#9d7770]">
                  No orders yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const isOpen = openOrder === order.id;

                    return (
                      <div
                        key={order.id}
                        className="overflow-hidden rounded-2xl border border-[#efd7dc] bg-white"
                      >

                        {/* ORDER SUMMARY */}

                        <button
                          type="button"
                          onClick={() =>
                            setOpenOrder(isOpen ? null : order.id)
                          }
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-[#fff8f7]"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold">
                              {order.customer_name}
                            </p>

                            <p className="mt-1 text-sm text-[#765b55]">
                              {order.customer_phone}
                            </p>
                          </div>

                          <div className="flex items-center gap-5">
                            <div className="hidden text-right sm:block">
                              <p className="text-xs text-[#9d7770]">
                                Date
                              </p>

                              <p className="text-sm font-medium">
                                {order.order_date
                                  ? new Date(
                                      order.order_date
                                    ).toLocaleDateString()
                                  : new Date(
                                      order.created_at
                                    ).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-[#9d7770]">
                                Total
                              </p>

                              <p className="font-semibold">
                                AED {Number(order.total).toFixed(2)}
                              </p>
                            </div>

                            <span
                              className={`text-lg transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            >
                              ↓
                            </span>
                          </div>
                        </button>

                        {/* ORDER DETAILS */}

                        {isOpen && (
                          <div className="border-t border-[#f3e5e7] px-6 py-6">

                            {/* PRINT BUTTON */}

                            <div className="mb-6 flex justify-end">
                              <button
                                type="button"
                                onClick={() => printOrder(order)}
                                className="rounded-xl border border-[#332321] bg-[#332321] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                              >
                                🖨️ Print Order
                              </button>
                            </div>

                            {/* ITEMS */}

                            <div className="mb-6">
                              <p className="mb-3 text-sm font-medium text-[#9d7770]">
                                Order
                              </p>

                              <div className="space-y-3">
                                {order.order_items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-start justify-between gap-4"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {item.item_name} ×{" "}
                                        {item.quantity}
                                      </p>

                                      {item.details && (
                                        <p className="mt-1 text-sm text-[#765b55]">
                                          {item.details}
                                        </p>
                                      )}
                                    </div>

                                    <p className="whitespace-nowrap">
                                      AED{" "}
                                      {(
                                        Number(item.price) *
                                        item.quantity
                                      ).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* DETAILS */}

                            <div className="grid gap-5 border-t border-[#f3e5e7] pt-5 sm:grid-cols-2">

                              <div>
                                <p className="text-sm text-[#9d7770]">
                                  Method
                                </p>

                                <p className="mt-1 font-medium">
                                  {order.order_method || "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-[#9d7770]">
                                  Payment
                                </p>

                                <p className="mt-1 font-medium">
                                  {order.payment_method || "—"}
                                </p>
                              </div>

                              {order.order_method === "Delivery" && (
                                <>
                                  <div>
                                    <p className="text-sm text-[#9d7770]">
                                      Area
                                    </p>

                                    <p className="mt-1 font-medium">
                                      {order.area || "—"}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-[#9d7770]">
                                      Location
                                    </p>

                                    <p className="mt-1 font-medium">
                                      {order.delivery_location || "—"}
                                    </p>
                                  </div>
                                </>
                              )}

                              <div>
                                <p className="text-sm text-[#9d7770]">
                                  Gift
                                </p>

                                <p className="mt-1 font-medium">
                                  {order.gift
                                    ? "Yes (+ AED 5)"
                                    : "No"}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-[#9d7770]">
                                  Notes
                                </p>

                                <p className="mt-1 font-medium">
                                  {order.notes || "None"}
                                </p>
                              </div>
                            </div>

                            {/* TOTAL */}

                            <div className="mt-6 flex items-center justify-between border-t border-[#f3e5e7] pt-5">
                              <p className="font-medium">
                                Total
                              </p>

                              <p className="text-xl font-semibold">
                                AED{" "}
                                {Number(order.total).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}