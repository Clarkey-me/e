document.addEventListener("DOMContentLoaded", () => {
    const pendingData = JSON.parse(localStorage.getItem("pendingData"));
    const buyerAndProductDetailsTableBody = document.getElementById("buyerAndProductDetails").querySelector("tbody");
    const wewe = JSON.parse(localStorage.getItem("products"));

    // Check if there is pending data and products exist
    const { buyer, products } = pendingData || {};

    if (products && products.length > 0) {
        // Render the buyer and product details in the same row
        products.forEach((product, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${buyer.name}</td>
                <td>${buyer.contact}</td>
                <td>${buyer.address}</td>
                <td>${buyer.landmark || "N/A"}</td>
                <td>${buyer.postalCode}</td>
                <td>${buyer.paymentMethod}</td>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>₱${product.price}</td>
                <td>₱${(product.price * product.quantity).toFixed(2)}</td>
                <td>
                    <button class="action-btn approve" data-index="${index}" ${product.status2 === "Approved" ? "disabled" : ""}>Approve</button>
                    <button class="action-btn reject" data-index="${index}" ${product.status2 === "Rejected" ? "disabled" : ""}>Reject</button>
                </td>
                <td class="status">${product.status2 || "Pending"}</td> <!-- Default to "Pending" -->
            `;

            buyerAndProductDetailsTableBody.appendChild(row);

            // Disable the buttons if the product is already approved or rejected
            if (product.status2 === "Approved") {
                row.querySelector(".approve").disabled = true;
                row.querySelector(".reject").disabled = true;
            } else if (product.status2 === "Rejected") {
                row.querySelector(".approve").disabled = true;
                row.querySelector(".reject").disabled = true;
            }
        });
    } else {
        buyerAndProductDetailsTableBody.innerHTML = "<tr><td colspan='12'>No products found.</td></tr>";
    }

    // Event delegation for Approve and Reject buttons
    buyerAndProductDetailsTableBody.addEventListener("click", (event) => {
        const target = event.target;
        const index = target.getAttribute("data-index");

        if (target.classList.contains("approve")) {
            const statusCell = target.closest("tr").querySelector(".status");
            statusCell.textContent = "Approved";

            // Disable the buttons after the action is taken
            target.disabled = true;
            target.closest("tr").querySelector(".reject").disabled = true;

            alert(`Product ${products[index].name} approved.`);

      
            wewe[index].status = "sold";  // This is the status in the "product" key

            // Save the updated pendingData back to localStorage
            localStorage.setItem("pendingData", JSON.stringify(pendingData));

            // Optionally: You can add the product to another list (approvedData) or perform other actions here
            // For example, adding to approvedData in localStorage
            const approvedData = JSON.parse(localStorage.getItem("approvedData")) || { products: [] };

            approvedData.products.push({
                ...products[index],  // Copy the entire product object
                approvedDate: new Date().toLocaleString() // Include the approval date
            });

            // Save the updated approvedData back to localStorage
            localStorage.setItem("approvedData", JSON.stringify(approvedData));

        } else if (target.classList.contains("reject")) {
            const statusCell = target.closest("tr").querySelector(".status");
            statusCell.textContent = "Rejected";

            // Disable the buttons after the action is taken
            target.disabled = true;
            target.closest("tr").querySelector(".approve").disabled = true;

            alert(`Product ${products[index].name} rejected.`);

            // Update the product status2 in the pendingData (for rejection)
            products[index].status2 = "Rejected";

            // Save the updated pendingData back to localStorage
            localStorage.setItem("pendingData", JSON.stringify(pendingData));
        }
    });
});

// Logout function
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
    // Clear user data from localStorage or session
    localStorage.removeItem("currentUser");  // Assuming you store current user data in 'currentUser'
    
    // Optionally, redirect to login page or home page
    alert("You have logged out successfully.");
    window.location.href = "guestindex.html";  // Replace with your actual login page URL
});
