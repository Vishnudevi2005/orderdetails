import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function EditOrder() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState({
        customer_name: "",
        product_name: "",
        quantity: "",
        stock: "",
        status: ""
    });

    useEffect(() => {

        axios
            .get(`http://127.0.0.1:5000/order/${id}`)
            .then((res) => {
                setOrder(res.data);
            })
            .catch(() => {
                alert("Unable to load order");
            });

    }, [id]);

    const handleChange = (e) => {

        setOrder({
            ...order,
            [e.target.name]: e.target.value
        });

    };

    const updateOrder = () => {

        axios
            .put(`http://127.0.0.1:5000/order/${id}`, order)
            .then(() => {

                alert("Order Updated Successfully");
                navigate("/orders");

            })
            .catch(() => {

                alert("Update Failed");

            });

    };

    return (

        <>
            <Navbar />

            <div style={{ padding: "30px" }}>

                <h2>Edit Order</h2>

                <br />

                <label>Customer Name</label>

                <br />

                <input
                    type="text"
                    name="customer_name"
                    value={order.customer_name}
                    onChange={handleChange}
                />

                <br /><br />

                <label>Product Name</label>

                <br />

                <input
                    type="text"
                    name="product_name"
                    value={order.product_name}
                    onChange={handleChange}
                />

                <br /><br />

                <label>Quantity</label>

                <br />

                <input
                    type="number"
                    name="quantity"
                    value={order.quantity}
                    onChange={handleChange}
                />

                <br /><br />

                <label>Stock</label>

                <br />

                <input
                    type="number"
                    name="stock"
                    value={order.stock}
                    onChange={handleChange}
                />

                <br /><br />

                <label>Status</label>

                <br />

                <select
                    name="status"
                    value={order.status}
                    onChange={handleChange}
                >
                    <option>Pending</option>
                    <option>Ready</option>
                    <option>Delivered</option>
                </select>

                <br /><br />

                <button onClick={updateOrder}>
                    Update Order
                </button>

            </div>
        </>

    );

}

export default EditOrder;