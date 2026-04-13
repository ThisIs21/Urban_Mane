import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import orderService from "../../services/orderService";
import { ownerTableCss } from "./OwnerStyles";

// Registrasi Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler,
);

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    monthly_revenue: 0,
    total_transactions: 0,
    active_products: 0,
    weekly_data: [],
    sales_distribution: [],
    recent_orders: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOwnerDashboard();
        setData(res);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRp = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num || 0);
  };

  // --- CHART CONFIGURATION ---

  const weeklyChartData = {
    labels: data.weekly_data?.map((d) => d._id) || [],
    datasets: [
      {
        label: "Pendapatan",
        data: data.weekly_data?.map((d) => d.total) || [],
        borderColor: "#C9A84C",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(201, 168, 76, 0.3)");
          gradient.addColorStop(1, "rgba(201, 168, 76, 0)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#C9A84C",
        pointBorderColor: "#1E1D1B",
        pointHoverRadius: 6,
      },
    ],
  };

  const pieChartData = {
    labels: data.sales_distribution?.map((d) => d._id?.toUpperCase()) || [
      "Produk",
      "Service",
    ],
    datasets: [
      {
        data: data.sales_distribution?.map((d) => d.total) || [0, 0],
        backgroundColor: [
          "rgba(201, 168, 76, 0.85)", // Gold
          "rgba(240, 237, 230, 0.15)", // White Dim
          "rgba(91, 155, 220, 0.85)", // Blue
        ],
        borderColor: "#1E1D1B",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#9A9690",
          font: { size: 11, family: "DM Sans" },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#272624",
        titleColor: "#C9A84C",
        bodyColor: "#F0EDE6",
        borderColor: "rgba(201, 168, 76, 0.2)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#56534E",
          font: { size: 10 },
          callback: (v) => "Rp " + v.toLocaleString(),
        },
        grid: { color: "rgba(255,255,255,0.03)" },
      },
      x: {
        ticks: { color: "#9A9690", font: { size: 10 } },
        grid: { display: false },
      },
    },
  };

  return (
    <>
      <style>{ownerTableCss}</style>
      <div className="owner-page">
        {/* Header Section */}
        <div
          className="own-pg-header own-a1"
          style={{
            marginBottom: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p className="own-pg-eyebrow">Executive Summary</p>
            <h1 className="own-pg-title">Urban Mane Analytics</h1>
            <p className="own-pg-sub">
              Pantau performa bisnis dan pertumbuhan pendapatan Anda.
            </p>
          </div>
          <div
            style={{
              textAlign: "right",
              background: "var(--s2)",
              padding: "10px 16px",
              borderRadius: "12px",
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                color: "var(--gold)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Periode Hari Ini
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--t1)",
                marginTop: "4px",
              }}
            >
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
          className="own-a2"
        >
          <div className="stat-card gold">
            <div className="stat-icon-wrapper">💰</div>
            <span className="stat-label">Pendapatan Bulan Ini</span>
            <p className="stat-value">
              {loading ? (
                <span className="own-skeleton" style={{ width: "120px" }} />
              ) : (
                formatRp(data.monthly_revenue)
              )}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">🧾</div>
            <span className="stat-label">Total Transaksi</span>
            <p className="stat-value">
              {loading ? (
                <span className="own-skeleton" style={{ width: "60px" }} />
              ) : (
                data.total_transactions
              )}
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">📦</div>
            <span className="stat-label">Inventaris Produk</span>
            <p className="stat-value">
              {loading ? (
                <span className="own-skeleton" style={{ width: "50px" }} />
              ) : (
                data.active_products
              )}
            </p>
          </div>
        </div>

        {/* Main Analytics Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginBottom: "32px",
          }}
          className="own-a3"
        >
          <div className="own-chart-container" style={{ minHeight: "350px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--t1)",
                }}
              >
                Tren Pendapatan Mingguan
              </h4>
              <p style={{ fontSize: "11px", color: "var(--t3)" }}>
                Visualisasi pemasukan dalam 7 hari terakhir
              </p>
            </div>
            <div style={{ height: "250px" }}>
              {loading ? (
                <div className="own-skeleton-chart" />
              ) : (
                <Line data={weeklyChartData} options={chartOptions} />
              )}
            </div>
          </div>

          <div className="own-chart-container" style={{ minHeight: "350px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--t1)",
                }}
              >
                Sumber Penjualan
              </h4>
              <p style={{ fontSize: "11px", color: "var(--t3)" }}>
                Proporsi Produk vs Service
              </p>
            </div>
            <div style={{ height: "220px", position: "relative" }}>
              {loading ? (
                <div className="own-skeleton-circle" />
              ) : (
                <Pie data={pieChartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Activity */}
        <div className="own-table-panel own-a4">
          <div className="own-table-head">
            <div>
              <span className="own-table-head-title">Transaksi Terkini</span>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--t3)",
                  marginTop: "2px",
                }}
              >
                5 aktivitas penjualan terbaru
              </p>
            </div>
            <Link to="/owner/reports" className="own-view-all-btn">
              Buka Laporan Lengkap →
            </Link>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="own-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th className="right">Waktu</th>
                  <th className="right">Total Nilai</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5">
                        <div className="own-skeleton-row" />
                      </td>
                    </tr>
                  ))
                ) : data.recent_orders?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="own-empty">
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  data.recent_orders?.slice(0, 5).map((order) => {
                    // Normalisasi field agar aman jika ada perbedaan nama dari backend
                    const inv =
                      order.invoiceNumber ||
                      order.invoice_number ||
                      order.id ||
                      "-";
                    const total = order.grandTotal || order.grand_total || 0;
                    const customer =
                      order.customerName || order.customer_name || "Walk-in";

                    return (
                      <tr key={order.id || inv}>
                        <td>
                          <span className="own-inv-pill">{inv}</span>
                        </td>
                        <td>
                          <div style={{ color: "var(--t1)", fontWeight: 600 }}>
                            {customer}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{ color: "var(--t3)", fontSize: "12px" }}
                          >
                            {order.items?.length || 0} items
                          </span>
                        </td>
                        <td className="right" style={{ fontSize: "12px" }}>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleTimeString(
                                "id-ID",
                                { hour: "2-digit", minute: "2-digit" },
                              )
                            : "-"}
                        </td>
                        <td
                          className="right"
                          style={{ color: "var(--gold)", fontWeight: 700 }}
                        >
                          {formatRp(total)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;
