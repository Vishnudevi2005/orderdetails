import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";


function Orders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () => {
        axios
            .get("http://127.0.0.1:5000/orders")
            .then((res) => {
                setOrders(res.data);
            })
            .catch(() => {
                alert("Unable to load orders");
            });
    };

    const deliver = (id) => {

        axios
            .put(`http://127.0.0.1:5000/deliver/${id}`)
            .then((res) => {
                alert(res.data.message);
                loadOrders();
            })
            .catch((err) => {
                alert(err.response?.data?.message || "Error");
            });

    };

    const getRecommendation = (stock, qty) => {

        if (stock === 0)
            return {
                text: "Create Production Order",
                color: "#dc3545"
            };

        if (stock < qty)
            return {
                text: "Purchase Additional Stock",
                color: "#fd7e14"
            };

        return {
            text: "Ready For Delivery",
            color: "#198754"
        };

    };

    const getStatusColor = (status) => {

        if (status === "Delivered")
            return "#198754";

        if (status === "Ready")
            return "#0d6efd";

        return "#ffc107";

    };

    const filteredOrders = orders.filter((o) =>
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.product_name.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <>
            <Navbar />

            <div
                style={{
                    background: "#f4f6f9",
                    minHeight: "100vh",
                    padding: "35px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "25px"
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            color: "#1f2937"
                        }}
                    >
                        Orders Management
                    </h2>

                    <button
    onClick={() => navigate("/add-order")}
    style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    }}
>
    + Add Order
</button>
                </div>

                <input
                    type="text"
                    placeholder="Search Customer or Product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "320px",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        marginBottom: "25px"
                    }}
                />

                <div
                    style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "25px",
                        boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
                    }}
                >

                    <table
                        width="100%"
                        style={{
                            borderCollapse: "collapse"
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    background: "#1e40af",
                                    color: "white"
                                }}
                            >

                                <th style={th}>ID</th>
                                <th style={th}>Customer</th>
                                <th style={th}>Product</th>
                                <th style={th}>Qty</th>
                                <th style={th}>Stock</th>
                                <th style={th}>Status</th>
                                <th style={th}>AI Recommendation</th>
                                <th style={th}>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredOrders.map((order) => {

                                const ai = getRecommendation(order.stock, order.quantity);

                                return (

                                    <tr
                                        key={order.id}
                                        style={{
                                            borderBottom: "1px solid #e5e7eb"
                                        }}
                                    >

                                        <td style={td}>{order.id}</td>

                                        <td style={td}>{order.customer_name}</td>

                                        <td style={td}>{order.product_name}</td>

                                        <td style={td}>{order.quantity}</td>

                                        <td style={td}>{order.stock}</td>

                                        <td style={td}>
                                            <span
                                                style={{
                                                    background: getStatusColor(order.status),
                                                    color: "white",
                                                    padding: "6px 14px",
                                                    borderRadius: "20px",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                {order.status}
                                            </span>
                                        </td>

                                        <td style={td}>
                                            <span
                                                style={{
                                                    background: ai.color,
                                                    color: "white",
                                                    padding: "6px 14px",
                                                    borderRadius: "20px",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                {ai.text}
                                            </span>
                                        </td>

                                        <td style={td}>

                                            <button
                                                onClick={() => deliver(order.id)}
                                                style={greenBtn}
                                            >
                                                Deliver
                                            </button>

                                            <button
    style={blueBtn}
    onClick={() => navigate(`/edit-order/${order.id}`)}
>
    Edit
</button>

                                            <button style={redBtn}>
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>

            </div>

        </>

    );

}

const th = {
    padding: "14px",
    textAlign: "left"
};

const td = {
    padding: "14px"
};

const greenBtn = {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px"
};

const blueBtn = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px"
};

const redBtn = {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
};

export default Orders;