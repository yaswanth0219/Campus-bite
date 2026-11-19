const menu = [
    {
        id: 1,
        name: "Paneer Tikka Wrap",
        desc: "Spiced paneer, fresh salad & mint sauce",
        price: 129,
        cat: "meals",
        vendor_id: 1,
        img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 2,
        name: "Masala Dosa",
        desc: "Crispy dosa with sambar & chutney",
        price: 99,
        cat: "meals",
        vendor_id: 2,
        img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 3,
        name: "Veg Hakka Noodles",
        desc: "Wok-tossed noodles with crunchy vegetables",
        price: 119,
        cat: "meals",
        vendor_id: 1,
        img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 4,
        name: "Samosa",
        desc: "Crispy potato & pea filling · 2 pcs",
        price: 40,
        cat: "snacks",
        vendor_id: 3,
        img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 5,
        name: "Veg Cheese Sandwich",
        desc: "Grilled sandwich with vegetables & cheese",
        price: 89,
        cat: "snacks",
        vendor_id: 3,
        img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 6,
        name: "Cold Coffee",
        desc: "Chilled creamy coffee · less sweet",
        price: 89,
        cat: "drinks",
        vendor_id: 4,
        img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80"
    }
];

const vendorNames = {
    1: "Punjabi Tadka",
    2: "South Indian Hub",
    3: "Sharma Snacks",
    4: "Pizza Corner"
};

let cart = JSON.parse(localStorage.getItem("campusbite-cart") || "[]");

const grid = document.getElementById("menuGrid");


// ===============================
// DISPLAY MENU
// ===============================

function render(cat = "all") {

    grid.innerHTML = menu
        .filter(item => cat === "all" || item.cat === cat)
        .map(item => `
            <article class="food-card">

                <div
                    class="food-img"
                    style="background-image: url('${item.img}')">
                </div>

                <div class="food-info">

                    <h3>${item.name}</h3>

                    <div class="vendor-name">
                        🏪 ${vendorNames[item.vendor_id]}
                    </div>

                    <p>${item.desc}</p>

                    <div class="food-bottom">

                        <span class="price">
                            ₹${item.price}
                        </span>

                        <button
                            class="add"
                            onclick="addItem(${item.id})">
                            + Add
                        </button>

                    </div>

                </div>

            </article>
        `)
        .join("");
}


// ===============================
// ADD ITEM
// ===============================

function addItem(id) {

    const item = menu.find(item => item.id === id);

    const found = cart.find(item => item.id === id);

    if (found) {
        found.qty++;
    } else {
        cart.push({
            ...item,
            qty: 1
        });
    }

    save();

    openCart();

    toast(item.name + " added to your order");
}


// ===============================
// SAVE CART
// ===============================

function save() {

    localStorage.setItem(
        "campusbite-cart",
        JSON.stringify(cart)
    );

    updateCart();
}


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    document.getElementById("cartCount").textContent =
        cart.reduce(
            (total, item) => total + item.qty,
            0
        );

    const el = document.getElementById("cartItems");

    if (cart.length === 0) {

        el.innerHTML = `
            <p style="
                color:#777;
                text-align:center;
                margin-top:60px
            ">
                Your cart is empty.<br>
                Add something delicious.
            </p>
        `;

    } else {

        el.innerHTML = cart
            .map(item => `
                <div class="cart-row">

                    <div>

                        <b>${item.name}</b>

                        <small>
                            ₹${item.price} × ${item.qty}
                        </small>

                    </div>

                    <div>

                        <b>
                            ₹${item.price * item.qty}
                        </b>

                        <br>

                        <button
                            class="remove"
                            onclick="removeItem(${item.id})">
                            Remove
                        </button>

                    </div>

                </div>
            `)
            .join("");
    }

    document.getElementById("cartTotal").textContent =
        "₹" +
        cart.reduce(
            (total, item) =>
                total + item.price * item.qty,
            0
        );
}


// ===============================
// REMOVE ITEM
// ===============================

function removeItem(id) {

    cart = cart.filter(
        item => item.id !== id
    );

    save();
}


// ===============================
// OPEN / CLOSE CART
// ===============================

function openCart() {

    document
        .getElementById("cartPanel")
        .classList.add("open");

    document
        .getElementById("overlay")
        .classList.add("show");
}


function closeCart() {

    document
        .getElementById("cartPanel")
        .classList.remove("open");

    document
        .getElementById("overlay")
        .classList.remove("show");
}


// ===============================
// TOAST MESSAGE
// ===============================

function toast(message) {

    const t = document.getElementById("toast");

    t.textContent = message;

    t.classList.add("show");

    setTimeout(() => {
        t.classList.remove("show");
    }, 2200);
}


function showOrderConfirmation(code, total) {

    const modal = document.getElementById("confirmationModal");

    document.getElementById("confirmationCode").textContent = code;
    document.getElementById("confirmationTotal").textContent = "₹" + total;

    modal.classList.add("show");
}

// ===============================
// CATEGORY FILTERS
// ===============================

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.onclick = () => {

            document
                .querySelectorAll(".filter")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            render(button.dataset.cat);
        };

    });


// ===============================
// CART BUTTONS
// ===============================

document.getElementById("cartBtn").onclick =
    openCart;

document.getElementById("closeCart").onclick =
    closeCart;

document.getElementById("overlay").onclick =
    closeCart;


// ===============================
// PLACE PRE-ORDER
// ===============================

document.getElementById("checkout").onclick =
    async () => {

        // Make sure cart isn't empty
        if (cart.length === 0) {

            toast("Add an item first");

            return;
        }


        // Generate order code
        const code =
            "CB-" +
            Math.random()
                .toString(36)
                .substring(2, 6)
                .toUpperCase();


        // Calculate total
        const total =
            cart.reduce(
                (sum, item) =>
                    sum + item.price * item.qty,
                0
            );


const vendorIds = [
    ...new Set(cart.map(item => item.vendor_id))
];

if (vendorIds.length !== 1) {
    toast("Please order from one vendor at a time");
    return;
}

const vendorId = vendorIds[0];

const order = {

    order_code: code,

    student_name: "Demo Student",

    vendor_id: vendorId,

    items: cart.map(item => ({

        name: item.name,

        quantity: item.qty,

        price: item.price

    })),

    total_amount: total,

    status: "placed"
};


        console.log("Sending order:", order);


        // Send order to Supabase
        const { data, error } =
            await supabaseClient
                .from("orders")
                .insert([order])
                .select();


        // Check for errors
        if (error) {

            console.error("Order error:", error);
            alert(
                "Order failed!\n\n" +
                "Message: " + error.message + "\n" +
                "Details: " + error.details + "\n" +
                "Hint: " + error.hint
            );
            toast("Couldn't place order");
            return;
        }


        // Success
        console.log("Order saved successfully:", data);

        localStorage.setItem(
            "campusbite-current-order",
            code
        );

        // Empty cart
        cart = [];

        save();

        closeCart();


        // Show order confirmation
       setTimeout(() => {
            showOrderConfirmation(code, total);
        }, 100);

    };


// ===============================
// VENDOR DEMO
// ===============================

document.getElementById("vendorDemo").onclick =
    () => {

        alert(
            "Vendor Dashboard Demo\n\n" +

            "NEW ORDER\n" +

            "#CB-7K4P\n" +

            "2 items · ₹218\n\n" +

            "[ ACCEPT ORDER ]\n\n" +

            "The full vendor dashboard will receive real orders from Supabase."
        );

    };


// ===============================
// START WEBSITE
// ===============================
// ===============================
// STUDENT ORDER TRACKER
// ===============================

async function loadCurrentOrder() {

    const code = localStorage.getItem(
        "campusbite-current-order"
    );

    if (!code) {
        document.getElementById("orderTracker").style.display = "none";
        return;
    }

    const { data, error } = await supabaseClient
        .from("orders")
        .select("*")
        .eq("order_code", code)
        .single();

    if (error || !data) {
        console.error("Could not load current order:", error);
        return;
    }

    // If current order has been collected,
    // don't show it as an active order.
    if (
        data.status === "collected" ||
        data.status === "rejected"
    ) {

        document.getElementById("orderTracker").style.display = "none";

    } else {

        showOrderTracker(data);

    }

    loadOrderHistory();
}
// ===============================
// ORDER HISTORY
// ===============================

async function loadOrderHistory() {

    const { data, error } = await supabaseClient
        .from("orders")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "Could not load order history:",
            error
        );

        return;
    }

    renderOrderHistory(data || []);
}


function renderOrderHistory(orderList) {

const list =
    document.getElementById("historyList");

if (!list) return;


    // Only show completed/rejected orders
    const completedOrders =
        orderList.filter(order =>
            order.status === "collected" ||
            order.status === "rejected"
        );


if (completedOrders.length === 0) {

    list.innerHTML = `
        <div class="history-empty">
            No past orders yet.
        </div>
    `;

    return;
}
    list.innerHTML = completedOrders.map(order => {

        const status =
            order.status === "collected"
                ? "✓ Collected"
                : "✕ Rejected";


        return `

            <div class="history-item">

                <div>

                    <div class="history-code">
                        #${order.order_code}
                    </div>

                    <div class="history-info">
                        ${order.student_name}
                        · ₹${order.total_amount}
                    </div>

                </div>

                <div class="history-status">
                    ${status}
                </div>

            </div>

        `;

    }).join("");
}


function showOrderTracker(order) {

    const tracker =
        document.getElementById("orderTracker");

    if (!tracker) return;

    tracker.style.display = "block";

    document.getElementById("trackerCode")
        .textContent = "#" + order.order_code;

    const statusNames = {
        placed: "Order Placed",
        accepted: "Order Accepted",
        preparing: "Preparing Your Food",
        ready: "Ready for Pickup",
        collected: "Order Collected",
        rejected: "Order Rejected"
    };

    document.getElementById("trackerStatus")
        .textContent =
        statusNames[order.status] || order.status;


    const steps = [
        "placed",
        "accepted",
        "preparing",
        "ready",
        "collected"
    ];

    const currentIndex =
        steps.indexOf(order.status);


    steps.forEach((status, index) => {

        const element =
            document.getElementById(
                "step-" + status
            );

        if (!element) return;

        element.classList.toggle(
            "active",
            index <= currentIndex
        );

    });
}


// Live status updates

supabaseClient
    .channel("student-order-status")
    .on(
        "postgres_changes",
        {
            event: "UPDATE",
            schema: "public",
            table: "orders"
        },
        payload => {

            const currentCode =
                localStorage.getItem(
                    "campusbite-current-order"
                );

            if (
    currentCode &&
    payload.new.order_code === currentCode
) {

    if (
        payload.new.status === "collected" ||
        payload.new.status === "rejected"
    ) {

        document.getElementById(
            "orderTracker"
        ).style.display = "none";

    } else {

        showOrderTracker(payload.new);

    }

    loadOrderHistory();
}


        }
    )
    .subscribe();

// ===============================
// ORDER HISTORY MODAL
// ===============================

const historyBtn =
    document.getElementById("historyBtn");

const historyOverlay =
    document.getElementById("historyOverlay");

const closeHistory =
    document.getElementById("closeHistory");


historyBtn.onclick = async () => {

    const { data: { session } } =
        await supabaseClient.auth.getSession();

    if (!session) {
        openAccountModal();
        return;
    }

    historyOverlay.classList.add("show");

    await loadOrderHistory();
};


closeHistory.onclick = () => {

    historyOverlay.classList.remove("show");

};


historyOverlay.onclick = (event) => {

    if (event.target === historyOverlay) {

        historyOverlay.classList.remove("show");

    }

};
// Load current order when page opens

loadCurrentOrder();


// Start website

render();
updateCart();
