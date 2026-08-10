import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {

        navigate("/");

    };

    return (

        <nav
            style={{
                background: "#0d47a1",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 40px",
                boxShadow: "0px 2px 8px gray"
            }}
        >

            <h2>
                📦 O2C ERP SYSTEM
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: "30px",
                    fontSize: "18px"
                }}
            >

                <Link style={linkStyle} to="/dashboard">
                    Dashboard
                </Link>

                <Link style={linkStyle} to="/customers">
                    Customers
                </Link>

                <Link style={linkStyle} to="/orders">
                    Orders
                </Link>

                <Link style={linkStyle} to="/inventory">
                    Inventory
                </Link>

                <Link style={linkStyle} to="/analytics">
                    Analytics
                </Link>

                <button
                    onClick={logout}
                    style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>

            </div>

        </nav>

    );

}

const linkStyle = {

    color: "white",
    textDecoration: "none",
    fontWeight: "bold"

};

export default Navbar;