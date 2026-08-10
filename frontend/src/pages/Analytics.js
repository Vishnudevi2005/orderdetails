import Navbar from "../components/Navbar";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

function Analytics() {

    const barData = {

        labels: [
            "Orders",
            "Customers",
            "Delivered",
            "Pending"
        ],

        datasets: [

            {

                label: "ERP Statistics",

                data: [120, 54, 98, 22],

                backgroundColor: [
                    "#1976d2",
                    "#4caf50",
                    "#ff9800",
                    "#e53935"
                ]

            }

        ]

    };

    const pieData = {

        labels: [
            "Delivered",
            "Pending",
            "Ready"
        ],

        datasets: [

            {

                data: [98, 22, 15],

                backgroundColor: [
                    "#4caf50",
                    "#ff9800",
                    "#1976d2"
                ]

            }

        ]

    };

    return (

        <>

            <Navbar />

            <div
                style={{
                    padding: "30px",
                    background: "#f5f7fa",
                    minHeight: "100vh"
                }}
            >

                <h1>Analytics Dashboard</h1>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "40px",
                        marginTop: "30px"
                    }}
                >

                    <div
                        style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px gray"
                        }}
                    >

                        <h2>Orders Overview</h2>

                        <Bar data={barData} />

                    </div>

                    <div
                        style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px gray"
                        }}
                    >

                        <h2>Order Status</h2>

                        <Pie data={pieData} />

                    </div>

                </div>

            </div>

        </>

    );

}

export default Analytics;
