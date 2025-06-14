import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { CSVLink } from "react-csv";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../styles/Dashboard.css";
import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [algorithmMetrics, setAlgorithmMetrics] = useState([]);
  const [quickFilter, setQuickFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchAll();
    fetchAlgorithmMetrics();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [userRes, manuRes, negoRes] = await Promise.all([
        axios.get("http://localhost:4000/api/users/users"),
        axios.get("http://localhost:4000/api/manufacturer/products"),
        axios.get("http://localhost:4000/api/analytics/negotiations"),
      ]);
      setUsers(userRes.data);
      setManufacturers(manuRes.data.products);
      setNegotiations(negoRes.data);
    } catch (err) {
      console.error("❌ Dashboard fetch error:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Something went wrong while loading dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAlgorithmMetrics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/analytics/algorithms"
      );
      setAlgorithmMetrics(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch algorithm metrics:", err);
    }
  };

  const handleBlockToggle = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/users/toggle-block/${id}`);
      fetchAll();
    } catch (err) {
      alert("❌ Failed to toggle block status.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/users/delete/${id}`);
      fetchAll();
    } catch (err) {
      alert("❌ Failed to delete user.");
    }
  };

  const updateUser = async (id, field, value) => {
    try {
      await axios.put(
        `http://localhost:4000/api/users/admin/update-user/${id}`,
        {
          [field]: value,
        }
      );
      fetchAll();
    } catch (err) {
      alert("❌ Failed to update user.");
    }
  };

  const userCols = useMemo(
    () => [
      {
        headerName: "Avatar",
        field: "profilePhoto",
        width: 80,
        cellRenderer: ({ value }) => (
          <img
            src={value || "/default-avatar.png"}
            alt="avatar"
            width="40"
            height="40"
            style={{ borderRadius: "50%" }}
          />
        ),
      },
      { headerName: "Username", field: "username", editable: true },
      { headerName: "Email", field: "email", editable: true },
      {
        headerName: "Role",
        field: "role",
        editable: true,
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: { values: ["user", "admin", "manufacturer"] },
      },
      {
        headerName: "Blocked",
        field: "blocked",
        valueFormatter: (p) => (p.value ? "Yes" : "No"),
        cellStyle: (p) => ({
          color: p.value ? "red" : "green",
          fontWeight: "bold",
        }),
      },
      {
        headerName: "Last Login",
        field: "lastLogin",
        valueFormatter: ({ value }) =>
          value ? new Date(value).toLocaleString() : "--",
      },
      {
        headerName: "Actions",
        field: "_id",
        cellRenderer: (params) => (
          <>
            <button
              onClick={() => handleBlockToggle(params.value)}
              className="btn btn-sm btn-warning me-2"
            >
              {params.data.blocked ? "Unblock" : "Block"}
            </button>
            <button
              onClick={() => handleDeleteUser(params.value)}
              className="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </>
        ),
      },
    ],
    []
  );

  const onUserEdit = (params) => {
    const { data, colDef, newValue } = params;
    if (data[colDef.field] !== newValue) {
      updateUser(data._id, colDef.field, newValue);
    }
  };

  const filteredNegotiations = useMemo(() => {
    const from = dateFilter.from ? new Date(dateFilter.from) : null;
    const to = dateFilter.to ? new Date(dateFilter.to) : null;
    return negotiations.filter((n) => {
      const date = new Date(n.date);
      return (!from || date >= from) && (!to || date <= to);
    });
  }, [negotiations, dateFilter]);

  const negoCols = useMemo(
    () => [
      {
        headerName: "Date",
        field: "date",
        valueFormatter: (p) => new Date(p.value).toLocaleString(),
      },
      { headerName: "User", field: "username" },
      { headerName: "Price", field: "recommended.optimizedOffer.price" },
      { headerName: "Quality", field: "recommended.optimizedOffer.quality" },
      { headerName: "Delivery", field: "recommended.optimizedOffer.delivery" },
      {
        headerName: "Fitness",
        field: "recommended.fitness",
        cellStyle: (p) => ({
          color: p.value < 0.5 ? "#ff5252" : "#43a047",
          fontWeight: "bold",
        }),
      },
    ],
    []
  );

  const algoMetricsCols = useMemo(
    () => [
      { headerName: "Algorithm", field: "algorithm" },
      {
        headerName: "Avg Precision",
        field: "avgPrecision",
        valueFormatter: (p) => p.value.toFixed(4),
      },
      {
        headerName: "Avg Recall",
        field: "avgRecall",
        valueFormatter: (p) => p.value.toFixed(4),
      },
      {
        headerName: "Avg F1-Score",
        field: "avgF1",
        valueFormatter: (p) => p.value.toFixed(4),
      },
      {
        headerName: "Avg GD",
        field: "avgGD",
        valueFormatter: (p) => p.value.toFixed(4),
      },
      {
        headerName: "Avg HV",
        field: "avgHV",
        valueFormatter: (p) => p.value.toFixed(4),
      },
      {
        headerName: "Win Rate",
        field: "winRate",
        valueFormatter: (p) => `${(p.value * 100).toFixed(2)}%`,
      },
    ],
    []
  );

  const topManufacturers = useMemo(() => {
    const countMap = {};
    negotiations.forEach((n) => {
      const id = n.recommended?.manufacturerID;
      if (id) countMap[id] = (countMap[id] || 0) + 1;
    });
    return manufacturers
      .map((m, i) => ({ ...m, id: i + 1, count: countMap[i + 1] || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [negotiations, manufacturers]);

  const recentLogins = useMemo(
    () =>
      [...users]
        .filter((u) => u.lastLogin)
        .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
        .slice(0, 5),
    [users]
  );

  return (
    <div className="dashboard-container">
      <h1>📊 Admin Dashboard</h1>

      <div className="tabs">
        {[
          "users",
          "manufacturers",
          "negotiations",
          "top",
          "logins",
          "algorithms",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "active-tab" : ""}
          >
            {tab === "top"
              ? "🏅 Top Manufacturers"
              : tab === "logins"
              ? "🕓 Recent Logins"
              : tab === "algorithms"
              ? "📊 Algorithm Metrics"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <input
        placeholder="🔍 Quick Search..."
        className="form-control my-2"
        value={quickFilter}
        onChange={(e) => setQuickFilter(e.target.value)}
      />

      {errorMsg && <p className="text-danger">{errorMsg}</p>}
      {loading && <p>Loading dashboard data...</p>}

      {activeTab === "users" && (
        <>
          <CSVLink
            data={users}
            filename="users.csv"
            className="btn btn-sm btn-success mb-2"
          >
            Export Users
          </CSVLink>
          <div className="ag-theme-alpine" style={{ height: 500 }}>
            <AgGridReact
              rowData={users}
              columnDefs={userCols}
              pagination
              paginationPageSize={10}
              quickFilterText={quickFilter}
              onCellValueChanged={onUserEdit}
              domLayout="autoHeight"
            />
          </div>
        </>
      )}

      {activeTab === "manufacturers" && (
        <>
          <CSVLink
            data={manufacturers}
            filename="manufacturers.csv"
            className="btn btn-sm btn-success mb-2"
          >
            Export Manufacturers
          </CSVLink>
          <div className="ag-theme-alpine" style={{ height: 500 }}>
            <AgGridReact
              rowData={manufacturers}
              columnDefs={[
                { headerName: "Fabric Type", field: "fabricType" },
                {
                  headerName: "Qualities",
                  field: "qualities",
                  valueFormatter: (p) => p.value.join(", "),
                },
                { headerName: "Min Price", field: "minPrice" },
                {
                  headerName: "Initial Offer",
                  children: [
                    { headerName: "Price", field: "initialOffer.price" },
                    { headerName: "Quality", field: "initialOffer.quality" },
                    { headerName: "Delivery", field: "initialOffer.delivery" },
                  ],
                },
              ]}
              pagination
              paginationPageSize={10}
              quickFilterText={quickFilter}
              domLayout="autoHeight"
            />
          </div>
        </>
      )}

      {activeTab === "negotiations" && (
        <>
          <div className="date-filters mb-3">
            <label className="me-2">From:</label>
            <input
              type="date"
              value={dateFilter.from}
              onChange={(e) =>
                setDateFilter((prev) => ({ ...prev, from: e.target.value }))
              }
            />
            <label className="mx-2">To:</label>
            <input
              type="date"
              value={dateFilter.to}
              onChange={(e) =>
                setDateFilter((prev) => ({ ...prev, to: e.target.value }))
              }
            />
          </div>
          <CSVLink
            data={filteredNegotiations}
            filename="negotiations.csv"
            className="btn btn-sm btn-success mb-2"
          >
            Export Negotiations
          </CSVLink>
          <div className="ag-theme-alpine" style={{ height: 500 }}>
            <AgGridReact
              rowData={filteredNegotiations}
              columnDefs={negoCols}
              pagination
              paginationPageSize={10}
              quickFilterText={quickFilter}
              domLayout="autoHeight"
            />
          </div>
        </>
      )}

      {activeTab === "top" && (
        <div className="result-box">
          <h3>🏆 Top Manufacturers by Optimization Count</h3>
          <table className="product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Fabric Type</th>
                <th>Qualities</th>
                <th>Initial Offer</th>
                <th>Optimizations</th>
              </tr>
            </thead>
            <tbody>
              {topManufacturers.map((m, i) => (
                <tr key={i}>
                  <td>{m.id}</td>
                  <td>{m.fabricType}</td>
                  <td>{m.qualities.join(", ")}</td>
                  <td>
                    {m.initialOffer.price} / {m.initialOffer.quality} /{" "}
                    {m.initialOffer.delivery}d
                  </td>
                  <td>
                    <strong>{m.count}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "logins" && (
        <div className="result-box">
          <h3>🕓 Recent User Logins</h3>
          <table className="product-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {recentLogins.map((u, i) => (
                <tr key={i}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.lastLogin).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "algorithms" && (
        <>
          <CSVLink
            data={algorithmMetrics}
            filename="algorithm_metrics.csv"
            className="btn btn-sm btn-success mb-2"
          >
            Export Metrics
          </CSVLink>
          <div className="ag-theme-alpine" style={{ height: 500 }}>
            <AgGridReact
              rowData={algorithmMetrics}
              columnDefs={algoMetricsCols}
              pagination
              paginationPageSize={10}
              quickFilterText={quickFilter}
              domLayout="autoHeight"
            />
          </div>

          <div className="charts-section">
            <h4>Algorithm Performance Comparison</h4>
            <div className="performance-chart">[F1-Score Comparison Chart]</div>
            <div className="performance-chart">
              [Hypervolume (HV) Comparison Chart]
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
