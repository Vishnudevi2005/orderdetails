import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        total: 0,
        pending: 0,
        ready: 0,
        delivered: 0
    });

    useEffect(() => {

        axios
            .get("http://127.0.0.1:5000/dashboard")
            .then((response) => {
                setDashboard(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    return (

        <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>

            {/* ================= NAVBAR ================= */}

            <nav
                style={{
                    background: "#1e3a8a",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 40px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                }}
            >

                <h2 style={{ margin: 0 }}>
                    📦 O2C ERP SYSTEM
                </h2>

                <div
                    style={{
                        display: "flex",
                        gap: "30px",
                        alignItems: "center"
                    }}
                >

                    <span
                        style={navStyle}
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </span>

                    <span
                        style={navStyle}
                        onClick={() => navigate("/customers")}
                    >
                        Customers
                    </span>

                    <span
                        style={navStyle}
                        onClick={() => navigate("/orders")}
                    >
                        Orders
                    </span>

                    <span
                        style={navStyle}
                        onClick={() => navigate("/inventory")}
                    >
                        Inventory
                    </span>

                    <span
                        style={navStyle}
                        onClick={() => navigate("/analytics")}
                    >
                        Analytics
                    </span>

                    <span
                        style={navStyle}
                        onClick={() => navigate("/")}
                    >
                        Logout
                    </span>

                </div>

            </nav>

            {/* ================= PAGE ================= */}

            <div style={{ padding: "30px" }}>

                <h1>Order-to-Cash Dashboard</h1>

                <hr />

                {/* Dashboard Cards */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: "20px",
                        marginTop: "30px"
                    }}
                >

                    <div style={cardStyle("#1976d2")}>
                        <h3>Total Orders</h3>
                        <h1>{dashboard.total}</h1>
                    </div>

                    <div style={cardStyle("#ff9800")}>
                        <h3>Pending</h3>
                        <h1>{dashboard.pending}</h1>
                    </div>

                    <div style={cardStyle("#16a34a")}>
                        <h3>Ready</h3>
                        <h1>{dashboard.ready}</h1>
                    </div>

                    <div style={cardStyle("#8e24aa")}>
                        <h3>Delivered</h3>
                        <h1>{dashboard.delivered}</h1>
                    </div>

                </div>

                {/* Buttons */}

                <div
                    style={{
                        marginTop: "35px",
                        display: "flex",
                        gap: "20px"
                    }}
                >

                    <button
                        style={buttonStyle}
                        onClick={() => navigate("/orders")}
                    >
                        View Orders
                    </button>

                    <button
                        style={buttonStyle}
                        onClick={() => navigate("/customers")}
                    >
                        Customers
                    </button>

                </div>

                {/* Recent Orders */}

                <div
                    style={{
                        background: "white",
                        marginTop: "40px",
                        padding: "25px",
                        borderRadius: "10px",
                        boxShadow: "0px 3px 10px rgba(0,0,0,0.2)"
                    }}
                >

                    <h2>Recent Orders</h2>

                    <table
                        width="100%"
                        border="1"
                        cellPadding="12"
                        style={{
                            borderCollapse: "collapse",
                            textAlign: "center"
                        }}
                    >

                        <thead
                            style={{
                                background: "#1976d2",
                                color: "white"
                            }}
                        >

                            <tr>

                                <th>ID</th>
                                <th>Customer</th>
                                <th>Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td>1</td>
                                <td>John</td>
                                <td>Pending</td>

                            </tr>

                            <tr>

                                <td>2</td>
                                <td>David</td>
                                <td>Ready</td>

                            </tr>

                            <tr>

                                <td>3</td>
                                <td>Sara</td>
                                <td>Pending</td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

const navStyle = {

    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px"

};

const cardStyle = (color) => ({

    background: color,
    color: "white",
    padding: "25px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"

});

const buttonStyle = {

    background: "#1976d2",
    color: "white",
    border: "none",
    padding: "14px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"

};

export default Dashboard;