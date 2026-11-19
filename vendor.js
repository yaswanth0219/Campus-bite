// ===============================
// CURRENT VENDOR
// ===============================

const vendors = {
    1: "Punjabi Tadka",
    2: "South Indian Hub",
    3: "Sharma Snacks",
    4: "Pizza Corner"
};

const vendorFromUrl = Number(
    new URLSearchParams(window.location.search).get("vendor")
);

// Defaults to Punjabi Tadka if the URL has no valid vendor ID.
const currentVendorId = vendors[vendorFromUrl]
    ? vendorFromUrl
    : 1;

const currentVendorName = vendors[currentVendorId];

document.title = `${currentVendorName} | CampusBite Vendor Dashboard`;

const vendorNameElement = document.getElementById("vendorName");
if (vendorNameElement) {
    vendorNameElement.textContent = currentVendorName;
}

let allOrders = [];
let currentFilter = "all";


// ===============================
// LOAD ORDERS
// ===============================

async function loadOrders() {

        const { data, error } = await supabaseClient
            .from("orders")
            .select("*")
            .eq("vendor_id", currentVendorId)
            .order("created_at", { ascending: false });

    if (error) {

        console.error("Load orders error:", error);

        document.getElementById("ordersList").innerHTML = `
            <div class="empty-orders">
                Couldn't load orders.<br>
                ${error.message}
            </div>
        `;

        return;
    }

    allOrders = data || [];

    updateStats();

    renderOrders();

}


// ===============================
// UPDATE STATS
// ===============================

function updateStats() {

    const total = allOrders.length;

    const newOrders =
        allOrders.filter(order => order.status === "placed").length;

    const preparing =
        allOrders.filter(order =>
            order.status === "preparing"
        ).length;

    const ready =
        allOrders.filter(order =>
            order.status === "ready"
        ).length;


    document.getElementById("totalOrders").textContent = total;

    document.getElementById("newOrders").textContent = newOrders;

    document.getElementById("preparingOrders").textContent = preparing;

    document.getElementById("readyOrders").textContent = ready;

}


// ===============================
// RENDER ORDERS
// ===============================

function renderOrders() {

    const container =
        document.getElementById("ordersList");


    let orders = allOrders;


    // FILTER

    if (currentFilter !== "all") {

        orders = allOrders.filter(
            order => order.status === currentFilter
        );

    }


    if (!orders.length) {

        container.innerHTML = `
            <div class="empty-orders">
                No ${currentFilter === "all"
                    ? ""
                    : currentFilter + " "
                }orders found.
            </div>
        `;

        return;
    }


    container.innerHTML = orders.map(order => {

        let items = [];

        try {

            items = Array.isArray(order.items)
                ? order.items
                : JSON.parse(order.items || "[]");

        } catch {

            items = [];

        }


        const itemsHTML = items.map(item => `
            
            <div class="order-item">

                <span class="item-name">
                    ${item.name} × ${item.quantity}
                </span>

                <span class="item-qty">
                    ₹${item.price * item.quantity}
                </span>

            </div>

        `).join("");


        const statusClass =
            "status-" + String(order.status).toLowerCase();


        return `

            <article class="order-card">

                <div class="order-top">

                    <div>

                        <div class="order-code">
                            #${order.order_code}
                        </div>

                        <div class="order-time">
                            ${formatTime(order.created_at)}
                        </div>

                    </div>


                    <span class="status-badge ${statusClass}">
                        ${order.status}
                    </span>

                </div>


                <div class="order-student">

                    <strong>Student:</strong>

                    ${order.student_name || "Student"}

                </div>


                <div class="order-items">

                    ${itemsHTML}

                </div>


                <div class="order-bottom">

                    <div class="order-total">

                        ₹${order.total_amount}

                    </div>


                    <div class="order-actions">

                        ${getActionButton(order)}

                    </div>

                </div>

            </article>

        `;

    }).join("");

}


// ===============================
// ACTION BUTTON
// ===============================

function getActionButton(order) {

    if (order.status === "placed") {

        return `
            <button
                class="accept-btn"
                onclick="updateOrder(${order.id}, 'accepted')"
            >
                ✓ Accept Order
            </button>
        `;

    }


    if (order.status === "accepted") {

        return `
            <button
                class="prepare-btn"
                onclick="updateOrder(${order.id}, 'preparing')"
            >
                👨‍🍳 Start Preparing
            </button>
        `;

    }


    if (order.status === "preparing") {

        return `
            <button
                class="ready-btn"
                onclick="updateOrder(${order.id}, 'ready')"
            >
                📦 Mark Ready
            </button>
        `;

    }


    if (order.status === "ready") {

        return `
            <button
                class="collect-btn"
                onclick="updateOrder(${order.id}, 'collected')"
            >
                ✓ Mark Collected
            </button>
        `;

    }


    return `
        <button disabled>
            ✓ Completed
        </button>
    `;

}


// ===============================
// UPDATE ORDER STATUS
// ===============================

async function updateOrder(id, newStatus) {

    console.log(
        "Updating order:",
        id,
        "→",
        newStatus
    );


    const { error } = await supabaseClient
        .from("orders")
        .update({
            status: newStatus
        })
        .eq("id", id);


    if (error) {

        console.error(
            "Update order error:",
            error
        );

        alert(
            "Couldn't update order:\n\n" +
            error.message
        );

        return;
    }


    // Reload orders after update

    await loadOrders();

}


// ===============================
// FILTER BUTTONS
// ===============================

document.querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            // Remove active from every button

            document
                .querySelectorAll(".filter-btn")
                .forEach(btn =>
                    btn.classList.remove("active")
                );


            // Activate clicked button

            button.classList.add("active");


            // Get filter

            currentFilter =
                button.dataset.filter;


            // Render filtered orders

            renderOrders();

        });

    });


// ===============================
// TIME
// ===============================

function formatTime(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleString([], {

        day: "2-digit",

        month: "short",

        hour: "2-digit",

        minute: "2-digit"

    });

}


// ===============================
// AUTO REFRESH
// ===============================

loadOrders();

setInterval(loadOrders, 5000);