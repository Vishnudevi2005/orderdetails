from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)


# ==========================================
# HOME
# ==========================================
@app.route("/")
def home():
    return jsonify({
        "message": "O2C Backend Running Successfully"
    })


# ==========================================
# LOGIN
# ==========================================
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    conn = get_connection()

    if conn is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed"
        }), 500

    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE username=%s AND password=%s",
        (username, password)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return jsonify({
            "success": True,
            "message": "Login Successful"
        })

    return jsonify({
        "success": False,
        "message": "Invalid Username or Password"
    })


# ==========================================
# DASHBOARD
# ==========================================
@app.route("/dashboard", methods=["GET"])
def dashboard():

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS total FROM orders")
    total = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS pending FROM orders WHERE status='Pending'")
    pending = cursor.fetchone()["pending"]

    cursor.execute("SELECT COUNT(*) AS ready FROM orders WHERE status='Ready'")
    ready = cursor.fetchone()["ready"]

    cursor.execute("SELECT COUNT(*) AS delivered FROM orders WHERE status='Delivered'")
    delivered = cursor.fetchone()["delivered"]

    cursor.close()
    conn.close()

    return jsonify({
        "total": total,
        "pending": pending,
        "ready": ready,
        "delivered": delivered
    })


# ==========================================
# GET ORDERS
# ==========================================
@app.route("/orders", methods=["GET"])
def get_orders():

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM orders")

    orders = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(orders)


# ==========================================
# GET CUSTOMERS
# ==========================================
@app.route("/customers", methods=["GET"])
def get_customers():

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM customers")

    customers = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(customers)


# ==========================================
# AI RECOMMENDATION
# ==========================================
@app.route("/recommendation/<int:order_id>", methods=["GET"])
def recommendation(order_id):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT o.*, c.credit_limit
        FROM orders o
        LEFT JOIN customers c
        ON o.customer_id = c.id
        WHERE o.id=%s
        """,
        (order_id,)
    )

    order = cursor.fetchone()

    cursor.close()
    conn.close()

    if order is None:
        return jsonify({
            "recommendation": "Order Not Found"
        })

    if order["stock"] == 0:

        rec = "Create Production Order"

    elif order["stock"] < order["quantity"]:

        rec = "Purchase Additional Stock"

    elif order["quantity"] > order["credit_limit"]:

        rec = "Hold Order - Credit Limit Exceeded"

    else:

        rec = "Ready For Delivery"

    return jsonify({
        "recommendation": rec
    })


# ==========================================
# DELIVER ORDER
# ==========================================
@app.route("/deliver/<int:order_id>", methods=["PUT"])
def deliver(order_id):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT stock, quantity FROM orders WHERE id=%s",
        (order_id,)
    )

    order = cursor.fetchone()

    if order is None:

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Order Not Found"
        }), 404

    if order["stock"] < order["quantity"]:

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Insufficient Stock"
        }), 400

    cursor.close()

    cursor = conn.cursor()

    cursor.execute(
        "UPDATE orders SET status='Delivered' WHERE id=%s",
        (order_id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Order Delivered Successfully"
    })
# ==========================================
# GET SINGLE ORDER
# ==========================================

@app.route("/order/<int:order_id>", methods=["GET"])
def get_order(order_id):

    conn = get_connection()

    if conn is None:
        return jsonify({"message": "Database Connection Failed"}), 500

    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM orders WHERE id=%s",
        (order_id,)
    )

    order = cursor.fetchone()

    cursor.close()
    conn.close()

    if order:
        return jsonify(order)

    return jsonify({
        "message": "Order Not Found"
    }),404    
    
# ==========================================
# UPDATE ORDER
# ==========================================

@app.route("/order/<int:order_id>", methods=["PUT"])
def update_order(order_id):

    data = request.get_json()

    customer_name = data["customer_name"]
    product_name = data["product_name"]
    quantity = data["quantity"]
    stock = data["stock"]
    status = data["status"]

    conn = get_connection()

    if conn is None:
        return jsonify({
            "message":"Database Connection Failed"
        }),500

    cursor = conn.cursor()

    cursor.execute("""
        UPDATE orders
        SET
            customer_name=%s,
            product_name=%s,
            quantity=%s,
            stock=%s,
            status=%s
        WHERE id=%s
    """,(
        customer_name,
        product_name,
        quantity,
        stock,
        status,
        order_id
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message":"Order Updated Successfully"
    })
 
# ==========================================
# ADD CUSTOMER
# ==========================================

@app.route("/customers", methods=["POST"])
def add_customer():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data received"
        }), 400

    customer_name = data.get("customer_name")
    email = data.get("email")
    phone = data.get("phone")
    credit_limit = data.get("credit_limit")

    # Validate required fields
    if not customer_name:
        return jsonify({
            "message": "Customer name is required"
        }), 400

    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400

    if not phone:
        return jsonify({
            "message": "Phone is required"
        }), 400

    if credit_limit is None or credit_limit == "":
        return jsonify({
            "message": "Credit limit is required"
        }), 400

    conn = get_connection()

    if conn is None:
        return jsonify({
            "message": "Database Connection Failed"
        }), 500

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO customers
            (customer_name, email, phone, credit_limit)
            VALUES (%s, %s, %s, %s)
            """,
            (
                customer_name,
                email,
                phone,
                credit_limit
            )
        )

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Customer Added Successfully"
        }), 201

    except Exception as e:

        conn.rollback()

        print("ADD CUSTOMER ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        cursor.close()
        conn.close()
        
# ==========================================
# ADD ORDER
# ==========================================

@app.route("/orders", methods=["POST"])
def add_order():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No data received"
        }), 400

    customer_id = data.get("customer_id")
    product_name = data.get("product_name")
    quantity = data.get("quantity")
    stock = data.get("stock")
    status = data.get("status", "Pending")

    # Validate fields
    if not customer_id:
        return jsonify({
            "message": "Please select a customer"
        }), 400

    if not product_name:
        return jsonify({
            "message": "Product name is required"
        }), 400

    if quantity is None or quantity == "":
        return jsonify({
            "message": "Quantity is required"
        }), 400

    if stock is None or stock == "":
        return jsonify({
            "message": "Stock is required"
        }), 400

    conn = get_connection()

    if conn is None:
        return jsonify({
            "message": "Database Connection Failed"
        }), 500

    cursor = conn.cursor(dictionary=True)

    try:

        # Get customer name from customers table
        cursor.execute(
            """
            SELECT customer_name
            FROM customers
            WHERE id=%s
            """,
            (customer_id,)
        )

        customer = cursor.fetchone()

        if customer is None:

            return jsonify({
                "message": "Customer Not Found"
            }), 404

        customer_name = customer["customer_name"]

        # Insert order
        cursor.execute(
            """
            INSERT INTO orders
            (
                customer_id,
                customer_name,
                product_name,
                quantity,
                stock,
                status
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                customer_id,
                customer_name,
                product_name,
                quantity,
                stock,
                status
            )
        )

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Order Added Successfully"
        }), 201

    except Exception as e:

        conn.rollback()

        print("ADD ORDER ERROR:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        cursor.close()
        conn.close()
        
# ==========================================
# GET SINGLE CUSTOMER
# ==========================================

@app.route("/customers/<int:customer_id>", methods=["GET"])
def get_customer(customer_id):

    conn = get_connection()

    if conn is None:
        return jsonify({
            "message": "Database Connection Failed"
        }), 500

    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM customers WHERE id=%s",
        (customer_id,)
    )

    customer = cursor.fetchone()

    cursor.close()
    conn.close()

    if customer is None:

        return jsonify({
            "message": "Customer Not Found"
        }), 404

    return jsonify(customer)


# ==========================================
# UPDATE CUSTOMER
# ==========================================

@app.route("/customers/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):

    data = request.get_json()

    customer_name = data.get("customer_name")
    email = data.get("email")
    phone = data.get("phone")
    credit_limit = data.get("credit_limit")

    if not customer_name:
        return jsonify({
            "message": "Customer name is required"
        }), 400

    conn = get_connection()

    if conn is None:
        return jsonify({
            "message": "Database Connection Failed"
        }), 500

    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE customers
        SET customer_name=%s,
            email=%s,
            phone=%s,
            credit_limit=%s
        WHERE id=%s
        """,
        (
            customer_name,
            email,
            phone,
            credit_limit,
            customer_id
        )
    )

    conn.commit()

    affected_rows = cursor.rowcount

    cursor.close()
    conn.close()

    if affected_rows == 0:

        return jsonify({
            "message": "Customer Not Found"
        }), 404

    return jsonify({
        "message": "Customer Updated Successfully"
    })


# ==========================================
# DELETE CUSTOMER
# ==========================================

@app.route("/customers/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):

    conn = get_connection()

    if conn is None:
        return jsonify({
            "message": "Database Connection Failed"
        }), 500

    cursor = conn.cursor()

    try:

        cursor.execute(
            "DELETE FROM customers WHERE id=%s",
            (customer_id,)
        )

        conn.commit()

        affected_rows = cursor.rowcount

        if affected_rows == 0:

            return jsonify({
                "message": "Customer Not Found"
            }), 404

        return jsonify({
            "message": "Customer Deleted Successfully"
        })

    except Exception as e:

        conn.rollback()

        return jsonify({
            "message": "Cannot delete customer. Customer may have existing orders.",
            "error": str(e)
        }), 400

    finally:

        cursor.close()
        conn.close() 
        
        
# ==========================================
# GET INVENTORY
# ==========================================

@app.route("/inventory", methods=["GET"])
def get_inventory():

    conn = get_connection()

    if conn is None:
        return jsonify({
            "message": "Database Connection Failed"
        }), 500

    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            product_name,
            stock
        FROM inventory
        ORDER BY id
    """)

    inventory = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(inventory)           

# ==========================================
# RUN
# ==========================================
if __name__ == "__main__":
    app.run(debug=True)