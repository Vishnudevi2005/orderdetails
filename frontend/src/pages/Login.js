import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {

        try {

            const res = await API.post("/login", {
                username,
                password
            });

            if (res.data.success) {

                alert("Login Successful");

                navigate("/dashboard");

            }

            else {

                alert(res.data.message);

            }

        }

        catch {

            alert("Backend Connection Error");

        }

    };

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#f4f6f9"
            }}
        >

            <div
                style={{
                    width: "350px",
                    background: "white",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px gray"
                }}
            >

                <h2 align="center">
                    O2C Login
                </h2>

                <input
                    type="text"
                    placeholder="Username"
                    style={{ width: "100%", padding: 10, marginTop: 20 }}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    style={{ width: "100%", padding: 10, marginTop: 15 }}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={login}
                    style={{
                        width: "100%",
                        padding: 10,
                        marginTop: 20,
                        background: "#1976d2",
                        color: "white",
                        border: "none"
                    }}
                >
                    Login
                </button>

            </div>

        </div>

    );

}

export default Login;