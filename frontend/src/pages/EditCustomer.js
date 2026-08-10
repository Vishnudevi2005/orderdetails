import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function EditCustomer() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState({
        customer_name: "",
        email: "",
        phone: "",
        credit_limit: ""
    });

    const [loading, setLoading] = useState(true);

    // ==========================================
    // LOAD CUSTOMER
    // ==========================================

    useEffect(() => {

        axios
            .get(`http://127.0.0.1:5000/customers/${id}`)
            .then((response) => {

                setCustomer(response.data);
                setLoading(false);

            })
            .catch((error) => {

                console.log(error);

                alert("Unable to load customer");

                setLoading(false);

            });

    }, [id]);

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        setCustomer({
            ...customer,
            [e.target.name]: e.target.value
        });

    };

    // ==========================================
    // UPDATE CUSTOMER
    // ==========================================

    const updateCustomer = () => {

        if (!customer.customer_name.trim()) {

            alert("Customer name is required");
            return;

        }

        if (!customer.email.trim()) {

            alert("Email is required");
            return;

        }

        if (!customer.phone.trim()) {

            alert("Phone is required");
            return;

        }

        axios
            .put(
                `http://127.0.0.1:5000/customers/${id}`,
                customer
            )
            .then((response) => {

                alert(
                    response.data.message ||
                    "Customer Updated Successfully"
                );

                navigate("/customers");

            })
            .catch((error) => {

                console.log(error);

                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Unable to update customer"
                    );

                } else {

                    alert("Backend connection error");

                }

            });

    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div style={pageStyle}>
                    <h2>Loading customer...</h2>
                </div>
            </>
        );

    }

    // ==========================================
    // PAGE
    // ==========================================

    return (

        <>

            <Navbar />

            <div style={pageStyle}>

                <div style={cardStyle}>

                    <h2
                        style={{
                            marginTop: 0,
                            color: "#1f2937"
                        }}
                    >
                        Edit Customer
                    </h2>

                    <p
                        style={{
                            color: "#6b7280",
                            marginBottom: "25px"
                        }}
                    >
                        Editing Customer ID: {id}
                    </p>

                    {/* CUSTOMER NAME */}

                    <label style={labelStyle}>
                        Customer Name
                    </label>

                    <input
                        type="text"
                        name="customer_name"
                        value={customer.customer_name || ""}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* EMAIL */}

                    <label style={labelStyle}>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={customer.email || ""}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* PHONE */}

                    <label style={labelStyle}>
                        Phone
                    </label>

                    <input
                        type="text"
                        name="phone"
                        value={customer.phone || ""}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* CREDIT LIMIT */}

                    <label style={labelStyle}>
                        Credit Limit
                    </label>

                    <input
                        type="number"
                        name="credit_limit"
                        value={customer.credit_limit || ""}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* BUTTONS */}

                    <div
                        style={{
                            marginTop: "25px",
                            display: "flex",
                            gap: "10px"
                        }}
                    >

                        <button
                            onClick={updateCustomer}
                            style={updateButton}
                        >
                            Update Customer
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

// ==========================================
// STYLES
// ==========================================

const pageStyle = {

    minHeight: "100vh",
    background: "#f4f6f9",
    padding: "40px"

};

const cardStyle = {

    background: "white",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)"

};

const labelStyle = {

    display: "block",
    marginBottom: "7px",
    marginTop: "18px",
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

const updateButton = {

    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600"

};

const cancelButton = {

    background: "#6b7280",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600"

};

export default EditCustomer;