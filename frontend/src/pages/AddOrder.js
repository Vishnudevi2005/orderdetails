import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function AddOrder() {

    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);

    const [order, setOrder] = useState({
        customer_id: "",
        product_name: "",
        quantity: "",
        stock: "",
        status: "Pending"
    });

    const [loading, setLoading] = useState(false);

    // ==========================================
    // LOAD CUSTOMERS
    // ==========================================

    useEffect(() => {

        axios
            .get("http://127.0.0.1:5000/customers")
            .then((response) => {

                setCustomers(response.data);

            })
            .catch((error) => {

                console.log(error);

                alert("Unable to load customers");

            });

    }, []);

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        setOrder({
            ...order,
            [e.target.name]: e.target.value
        });

    };

    // ==========================================
    // SAVE ORDER
    // ==========================================

    const saveOrder = () => {

        if (!order.customer_id) {

            alert("Please select a customer");

            return;
        }

        if (!order.product_name.trim()) {

            alert("Please enter product name");

            return;
        }

        if (!order.quantity) {

            alert("Please enter quantity");

            return;
        }

        if (!order.stock && order.stock !== 0) {

            alert("Please enter stock");

            return;
        }

        setLoading(true);

        axios
            .post(
                "http://127.0.0.1:5000/orders",
                {
                    customer_id: Number(order.customer_id),
                    product_name: order.product_name,
                    quantity: Number(order.quantity),
                    stock: Number(order.stock),
                    status: order.status
                }
            )
            .then((response) => {

                alert(
                    response.data.message ||
                    "Order Added Successfully"
                );

                navigate("/orders");

            })
            .catch((error) => {

                console.log("ADD ORDER ERROR:", error);

                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Unable to add order"
                    );

                } else {

                    alert(
                        "Unable to connect to Flask backend"
                    );

                }

            })
            .finally(() => {

                setLoading(false);

            });

    };

    return (

        <>

            <Navbar />

            <div
                style={{
                    background: "#f4f6f9",
                    minHeight: "100vh",
                    padding: "40px"
                }}
            >

                <div
                    style={{
                        maxWidth: "800px",
                        margin: "0 auto",
                        background: "white",
                        padding: "40px",
                        borderRadius: "12px",
                        boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
                    }}
                >

                    <h2
                        style={{
                            marginBottom: "30px",
                            color: "#1f2937"
                        }}
                    >
                        Add Order
                    </h2>

                    {/* CUSTOMER */}

                    <label style={labelStyle}>
                        Customer
                    </label>

                    <select
                        name="customer_id"
                        value={order.customer_id}
                        onChange={handleChange}
                        style={inputStyle}
                    >

                        <option value="">
                            -- Select Customer --
                        </option>

                        {customers.map((customer) => (

                            <option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.customer_name}
                            </option>

                        ))}

                    </select>

                    {/* PRODUCT */}

                    <label style={labelStyle}>
                        Product Name
                    </label>

                    <input
                        type="text"
                        name="product_name"
                        value={order.product_name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        style={inputStyle}
                    />

                    {/* QUANTITY */}

                    <label style={labelStyle}>
                        Quantity
                    </label>

                    <input
                        type="number"
                        name="quantity"
                        value={order.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        min="1"
                        style={inputStyle}
                    />

                    {/* STOCK */}

                    <label style={labelStyle}>
                        Available Stock
                    </label>

                    <input
                        type="number"
                        name="stock"
                        value={order.stock}
                        onChange={handleChange}
                        placeholder="Enter available stock"
                        min="0"
                        style={inputStyle}
                    />

                    {/* STATUS */}

                    <label style={labelStyle}>
                        Status
                    </label>

                    <select
                        name="status"
                        value={order.status}
                        onChange={handleChange}
                        style={inputStyle}
                    >

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Ready">
                            Ready
                        </option>

                        <option value="Delivered">
                            Delivered
                        </option>

                    </select>

                    {/* BUTTONS */}

                    <div
                        style={{
                            marginTop: "30px",
                            display: "flex",
                            gap: "12px"
                        }}
                    >

                        <button
                            onClick={saveOrder}
                            disabled={loading}
                            style={{
                                background: loading
                                    ? "#93c5fd"
                                    : "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "12px 25px",
                                borderRadius: "7px",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                fontWeight: "600"
                            }}
                        >

                            {loading
                                ? "Saving..."
                                : "Save Order"}

                        </button>

                        <button
                            onClick={() => navigate("/orders")}
                            style={{
                                background: "#6b7280",
                                color: "white",
                                border: "none",
                                padding: "12px 25px",
                                borderRadius: "7px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}


// ==========================================
// STYLES
// ==========================================

const labelStyle = {

    display: "block",

    marginTop: "20px",

    marginBottom: "8px",

    fontWeight: "600",

    color: "#374151"

};

const inputStyle = {

    width: "100%",

    boxSizing: "border-box",

    padding: "12px",

    border: "1px solid #d1d5db",

    borderRadius: "7px",

    fontSize: "15px",

    background: "white"

};

export default AddOrder;