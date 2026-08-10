import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Customers() {

    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadCustomers();
    }, []);

    // ==========================================
    // LOAD CUSTOMERS
    // ==========================================

    const loadCustomers = () => {

        axios
            .get("http://127.0.0.1:5000/customers")
            .then((response) => {

                setCustomers(response.data);

            })
            .catch((error) => {

                console.log(error);
                alert("Unable to load customers");

            });

    };

    // ==========================================
    // DELETE CUSTOMER
    // ==========================================

    const deleteCustomer = (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmDelete) {
            return;
        }

        axios
            .delete(`http://127.0.0.1:5000/customers/${id}`)
            .then((response) => {

                alert(response.data.message);

                loadCustomers();

            })
            .catch((error) => {

                console.log(error);

                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Unable to delete customer"
                    );

                } else {

                    alert("Backend connection error");

                }

            });

    };

    // ==========================================
    // SEARCH
    // ==========================================

    const filteredCustomers = customers.filter((customer) => {

        const name = customer.customer_name
            ? customer.customer_name.toLowerCase()
            : "";

        const email = customer.email
            ? customer.email.toLowerCase()
            : "";

        const phone = customer.phone
            ? customer.phone.toString().toLowerCase()
            : "";

        const searchText = search.toLowerCase();

        return (
            name.includes(searchText) ||
            email.includes(searchText) ||
            phone.includes(searchText)
        );

    });

    return (

        <>

            {/* NAVBAR */}

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
                        marginBottom: "20px"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0,
                                color: "#1f2937"
                            }}
                        >
                            Customer Management
                        </h2>

                        <p
                            style={{
                                color: "#6b7280",
                                marginTop: "6px"
                            }}
                        >
                            Manage customers and credit information
                        </p>

                    </div>

                    {/* ADD CUSTOMER */}

                    <button
                        onClick={() => navigate("/add-customer")}
                        style={{
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            padding: "12px 22px",
                            borderRadius: "7px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "15px"
                        }}
                    >
                        + Add Customer
                    </button>

                </div>

                {/* SEARCH */}

                <input
                    type="text"
                    placeholder="Search customer, email or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "350px",
                        padding: "12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "7px",
                        marginBottom: "20px",
                        fontSize: "14px",
                        outline: "none"
                    }}
                />

                {/* CUSTOMER TABLE */}

                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
                        overflowX: "auto"
                    }}
                >

                    <table
                        width="100%"
                        cellPadding="12"
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
                                    Customer Name
                                </th>

                                <th style={thStyle}>
                                    Email
                                </th>

                                <th style={thStyle}>
                                    Phone
                                </th>

                                <th style={thStyle}>
                                    Credit Limit
                                </th>

                                <th style={thStyle}>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredCustomers.length > 0 ? (

                                filteredCustomers.map((customer) => (

                                    <tr
                                        key={customer.id}
                                        style={{
                                            borderBottom:
                                                "1px solid #e5e7eb"
                                        }}
                                    >

                                        <td style={tdStyle}>
                                            {customer.id}
                                        </td>

                                        <td style={tdStyle}>

                                            <strong>
                                                {customer.customer_name}
                                            </strong>

                                        </td>

                                        <td style={tdStyle}>
                                            {customer.email}
                                        </td>

                                        <td style={tdStyle}>
                                            {customer.phone}
                                        </td>

                                        <td style={tdStyle}>

                                            ₹{" "}
                                            {Number(
                                                customer.credit_limit || 0
                                            ).toLocaleString("en-IN")}

                                        </td>

                                        <td style={tdStyle}>

                                            {/* EDIT */}

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/edit-customer/${customer.id}`
                                                    )
                                                }
                                                style={editButton}
                                            >
                                                Edit
                                            </button>

                                            {/* DELETE */}

                                            <button
                                                onClick={() =>
                                                    deleteCustomer(
                                                        customer.id
                                                    )
                                                }
                                                style={deleteButton}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="6"
                                        style={{
                                            textAlign: "center",
                                            padding: "30px",
                                            color: "#6b7280"
                                        }}
                                    >
                                        No Customers Found
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


// ==========================================
// BUTTON STYLES
// ==========================================

const editButton = {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px",
    fontWeight: "500"
};

const deleteButton = {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500"
};

export default Customers;