import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function AddProduct() {

    const navigate = useNavigate();

    const [product, setProduct] = useState({
        product_name: "",
        stock: ""
    });

    const [loading, setLoading] = useState(false);

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });

    };

    // ==========================================
    // ADD PRODUCT
    // ==========================================

    const addProduct = () => {

        if (!product.product_name.trim()) {
            alert("Product name is required");
            return;
        }

        if (product.stock === "") {
            alert("Stock is required");
            return;
        }

        if (Number(product.stock) < 0) {
            alert("Stock cannot be negative");
            return;
        }

        setLoading(true);

        axios
            .post(
                "http://127.0.0.1:5000/inventory",
                {
                    product_name: product.product_name,
                    stock: Number(product.stock)
                }
            )
            .then((response) => {

                alert(
                    response.data.message ||
                    "Product Added Successfully"
                );

                navigate("/inventory");

            })
            .catch((error) => {

                console.log(error);

                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Unable to add product"
                    );

                } else {

                    alert("Backend connection error");

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
                        maxWidth: "600px",
                        margin: "0 auto",
                        background: "white",
                        padding: "30px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 3px 12px rgba(0,0,0,0.08)"
                    }}
                >

                    <h2
                        style={{
                            marginTop: 0,
                            color: "#1f2937"
                        }}
                    >
                        Add Product
                    </h2>

                    <p
                        style={{
                            color: "#6b7280"
                        }}
                    >
                        Add a new product to inventory
                    </p>

                    {/* PRODUCT NAME */}

                    <label style={labelStyle}>
                        Product Name
                    </label>

                    <input
                        type="text"
                        name="product_name"
                        placeholder="Enter product name"
                        value={product.product_name}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* STOCK */}

                    <label style={labelStyle}>
                        Stock Quantity
                    </label>

                    <input
                        type="number"
                        name="stock"
                        placeholder="Enter stock quantity"
                        min="0"
                        value={product.stock}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* BUTTONS */}

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "25px"
                        }}
                    >

                        <button
                            onClick={addProduct}
                            disabled={loading}
                            style={addButton}
                        >
                            {loading
                                ? "Adding..."
                                : "Add Product"}
                        </button>

                        <button
                            onClick={() =>
                                navigate("/inventory")
                            }
                            style={cancelButton}
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
    marginBottom: "7px",
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
    outline: "none"

};

const addButton = {

    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600"

};

const cancelButton = {

    background: "#6b7280",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600"

};

export default AddProduct;