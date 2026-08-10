import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Inventory() {
    const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [search, setSearch] = useState("");

    // ==========================================
    // LOAD INVENTORY
    // ==========================================

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = () => {

        axios
            .get("http://127.0.0.1:5000/inventory")
            .then((response) => {

                setInventory(response.data);

            })
            .catch((error) => {

                console.log(error);

                alert("Unable to load inventory");

            });

    };

    // ==========================================
    // STOCK STATUS
    // ==========================================

    const getStockStatus = (stock) => {

        if (stock === 0) {

            return {
                text: "Out of Stock",
                color: "#dc2626"
            };

        }

        if (stock <= 5) {

            return {
                text: "Low Stock",
                color: "#f59e0b"
            };

        }

        return {
            text: "Available",
            color: "#16a34a"
        };

    };

    // ==========================================
    // SEARCH
    // ==========================================

    const filteredInventory = inventory.filter((item) => {

        const productName = item.product_name
            ? item.product_name.toLowerCase()
            : "";

        return productName.includes(
            search.toLowerCase()
        );

    });

    return (

        <>

            <Navbar />

            <div
                style={{
                    padding: "35px",
                    background: "#f4f6f9",
                    minHeight: "100vh"
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "25px"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0,
                                color: "#1f2937"
                            }}
                        >
                            Inventory Management
                        </h2>

                        <p
                            style={{
                                marginTop: "6px",
                                color: "#6b7280"
                            }}
                        >
                            Monitor products and stock availability
                        </p>

                    </div>

                    <button
    onClick={() => navigate("/add-product")}
    style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "12px 22px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    }}
>
    + Add Product
</button>

                </div>

                {/* SEARCH */}

                <input
                    type="text"
                    placeholder="Search product..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    style={{
                        width: "320px",
                        padding: "12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "7px",
                        marginBottom: "20px",
                        fontSize: "14px"
                    }}
                />

                {/* TABLE */}

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,0.08)",
                        overflowX: "auto"
                    }}
                >

                    <table
                        width="100%"
                        style={{
                            borderCollapse: "collapse",
                            textAlign: "left"
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    background: "#1e40af",
                                    color: "white"
                                }}
                            >

                                <th style={thStyle}>
                                    ID
                                </th>

                                <th style={thStyle}>
                                    Product
                                </th>

                                <th style={thStyle}>
                                    Stock
                                </th>

                                <th style={thStyle}>
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredInventory.length > 0 ? (

                                filteredInventory.map((item) => {

                                    const status =
                                        getStockStatus(
                                            Number(item.stock)
                                        );

                                    return (

                                        <tr
                                            key={item.id}
                                            style={{
                                                borderBottom:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >

                                            <td style={tdStyle}>
                                                {item.id}
                                            </td>

                                            <td style={tdStyle}>

                                                <strong>
                                                    {item.product_name}
                                                </strong>

                                            </td>

                                            <td style={tdStyle}>

                                                {item.stock}

                                            </td>

                                            <td style={tdStyle}>

                                                <span
                                                    style={{
                                                        background:
                                                            status.color,
                                                        color: "white",
                                                        padding:
                                                            "6px 14px",
                                                        borderRadius:
                                                            "20px",
                                                        fontSize:
                                                            "13px"
                                                    }}
                                                >
                                                    {status.text}
                                                </span>

                                            </td>

                                        </tr>

                                    );

                                })

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        style={{
                                            textAlign: "center",
                                            padding: "30px",
                                            color: "#6b7280"
                                        }}
                                    >
                                        No Products Found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </>

    );

}

// ==========================================
// TABLE STYLES
// ==========================================

const thStyle = {
    padding: "14px",
    fontWeight: "600"
};

const tdStyle = {
    padding: "14px",
    color: "#374151"
};

export default Inventory;