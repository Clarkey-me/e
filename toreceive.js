document.addEventListener("DOMContentLoaded", () => {
    const productDetailsTableBody = document.getElementById("productDetailsTable").querySelector("tbody");

    // Function to render the product details table
    function renderProductTable() {
        // Clear the existing table rows
        productDetailsTableBody.innerHTML = "";

        // Retrieve the approved product details from localStorage
        const approvedProduct = JSON.parse(localStorage.getItem("approvedData"));

        // Check if the retrieved data is valid
        if (!approvedProduct || !Array.isArray(approvedProduct.products) || approvedProduct.products.length === 0) {
            productDetailsTableBody.innerHTML = "<tr><td colspan='5'>No approved products available.</td></tr>";
            return;
        }

        // Loop through the products and render each row
        approvedProduct.products.forEach((product, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>₱${product.price}</td>
                <td>₱${(product.price * product.quantity).toFixed(2)}</td>
                <td>
                    <button class="action-btn received">Order Received</button>
                    <button class="action-btn returned">Returned</button>
                </td>
            `;
            productDetailsTableBody.appendChild(row);

            // Event listener for Order Received button
            row.querySelector(".received").addEventListener("click", () => {
                alert("Order marked as received.");

                // Retrieve current user from localStorage
                const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                if (!currentUser || !currentUser.email) {
                    alert("No current user found. Please log in.");
                    return;
                }

                const salesHistoryKey = `${currentUser.email}_salesHistory`;

                // Get existing sales history from localStorage or initialize as an empty array
                const salesHistory = JSON.parse(localStorage.getItem(salesHistoryKey)) || [];

                // Create a new sale entry
                const newSale = {
                    orderId: `ORD${Date.now()}`,
                    date: new Date().toLocaleString(),
                    products: [product],
                    totalAmount: (product.price * product.quantity).toFixed(2),
                };

                // Add the new sale to the sales history
                salesHistory.push(newSale);

                // Save the updated sales history back to localStorage
                localStorage.setItem(salesHistoryKey, JSON.stringify(salesHistory));
                

                // Save the updated approved products back to localStorage
                localStorage.setItem("approvedData", JSON.stringify(approvedProduct));

                // Re-render the table to reflect the changes
                renderProductTable();
            });

            // Event listener for Order Returned button
            row.querySelector(".returned").addEventListener("click", () => {
                alert("Order marked as returned.");
                // Additional logic for handling returned orders can be implemented here
            });
        });
    }

    // Initial render of the table
    renderProductTable();
});
