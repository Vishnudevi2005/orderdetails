import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function AddCustomer() {

    const navigate = useNavigate();

    const [customer, setCustomer] = useState({
        customer_name: "",
        email: "",
        phone: "",
        credit_limit: ""
    });

    const handleChange = (e) => {

        setCustomer({
            ...customer,
            [e.target.name]: e.target.value
        });

    };

    const addCustomer = () => {

        if (
            !customer.customer_name ||
            !customer.email ||
            !customer.phone ||
            !customer.credit_limit
        ) {
            alert("Please fill all fields");
            return;
        }

        axios
            .post("http://127.0.0.1:5000/customers", customer)
            .then((res) => {

                alert(res.data.message);

                navigate("/customers");

            })
            .catch((err) => {

                console.log(err);

                if (err.response) {
                    alert(
                        err.response.data.message ||
                        "Unable to add customer"
                    );
                } else {
                    alert("Backend connection error");
                }

            });

    };

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
                        maxWidth: "650px",
                        margin: "auto",
                        background: "white",
                        padding: "30px",
                        borderRadius: "12px",
                        boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
                    }}
                >

                    <h2
                        style={{
                            marginBottom: "25px",
                            color: "#1f2937"
                        }}
                    >
                        Add Customer
                    </h2>

                    {/* Customer Name */}

                    <label>Customer Name</label>

                    <input
                        type="text"
                        name="customer_name"
                        placeholder="Enter customer name"
                        value={customer.customer_name}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* Email */}

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={customer.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* Phone */}

                    <label>Phone</label>

                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter phone number"
                        value={customer.phone}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* Credit Limit */}

                    <label>Credit Limit</label>

                    <input
                        type="number"
                        name="credit_limit"
                        placeholder="Enter credit limit"
                        value={customer.credit_limit}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <div
                        style={{
                            marginTop: "25px",
                            display: "flex",
                            gap: "15px"
                        }}
                    >

                        <button
                            onClick={addCustomer}
                            style={saveButton}
                        >
                            Save Customer
                        </button>

                        <button
                            onClick={() => navigate("/customers")}
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

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "20px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "15px"
};

const saveButton = {
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

export default AddCustomer;