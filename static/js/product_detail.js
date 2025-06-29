// Product Detail JavaScript Functions

// Quantity Controls
function changeQuantity(delta) {
  const quantityInput = document.getElementById("quantity");
  let currentValue = parseInt(quantityInput.value);
  let newValue = currentValue + delta;

  // Get max stock from input attribute
  const maxStock = parseInt(quantityInput.getAttribute("max"));

  if (newValue >= 1 && newValue <= maxStock) {
    quantityInput.value = newValue;
  }
}

function increaseQuantity() {
  changeQuantity(1);
}

function decreaseQuantity() {
  changeQuantity(-1);
}

// Add to Cart Function - Main function that was missing
function addToCart(productId) {
  const quantityInput = document.getElementById("quantity");
  const quantity = parseInt(quantityInput.value);
  const addToCartBtn = document.querySelector(".add-to-cart-btn");

  // Disable button during request
  addToCartBtn.disabled = true;
  addToCartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ADDING...';

  // Get CSRF token
  const csrfToken =
    document.querySelector("[name=csrfmiddlewaretoken]")?.value ||
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

  // Prepare form data
  const formData = new FormData();
  formData.append("product_id", productId);
  formData.append("quantity", quantity);
  if (csrfToken) {
    formData.append("csrfmiddlewaretoken", csrfToken);
  }

  // Send AJAX request to add to cart
  fetch("/cart/add/", {
    method: "POST",
    body: formData,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Show success message
        showNotification("Product added to cart successfully!", "success");

        // Update cart count
        updateCartCount();

        // Reset button
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML =
          '<i class="fas fa-shopping-cart"></i> ADD TO CART';

        // Optional: Reset quantity to 1
        quantityInput.value = 1;
      } else {
        // Show error message
        showNotification(
          data.message || "Error adding product to cart",
          "error"
        );

        // Reset button
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML =
          '<i class="fas fa-shopping-cart"></i> ADD TO CART';
      }
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
      showNotification("Error adding product to cart", "error");

      // Reset button
      addToCartBtn.disabled = false;
      addToCartBtn.innerHTML =
        '<i class="fas fa-shopping-cart"></i> ADD TO CART';
    });
}

// Toggle Wishlist Function
function toggleWishlist(productId) {
  const wishlistBtn = document.querySelector(".wishlist-btn");
  const icon = wishlistBtn.querySelector("i");

  // Get CSRF token
  const csrfToken =
    document.querySelector("[name=csrfmiddlewaretoken]")?.value ||
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

  const formData = new FormData();
  formData.append("product_id", productId);
  if (csrfToken) {
    formData.append("csrfmiddlewaretoken", csrfToken);
  }

  fetch("/wishlist/toggle/", {
    method: "POST",
    body: formData,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        if (data.added) {
          icon.classList.remove("far");
          icon.classList.add("fas");
          wishlistBtn.style.background = "#e74c3c";
          wishlistBtn.style.color = "white";
          showNotification("Added to wishlist!", "success");
        } else {
          icon.classList.remove("fas");
          icon.classList.add("far");
          wishlistBtn.style.background = "#f8f9fa";
          wishlistBtn.style.color = "#666";
          showNotification("Removed from wishlist!", "info");
        }
      } else {
        showNotification(data.message || "Error updating wishlist", "error");
      }
    })
    .catch((error) => {
      console.error("Error toggling wishlist:", error);
      showNotification("Error updating wishlist", "error");
    });
}

// Social Share Functions
function shareProduct(platform) {
  const url = window.location.href;
  const title = document.querySelector(".product-title").textContent;

  let shareUrl = "";

  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`;
      break;
    case "google":
      shareUrl = `https://plus.google.com/share?url=${encodeURIComponent(url)}`;
      break;
  }

  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
}

// Image Zoom
function zoomImage() {
  const image = document.querySelector(".main-product-image");
  if (image) {
    if (image.style.transform === "scale(1.5)") {
      image.style.transform = "scale(1)";
      image.style.cursor = "zoom-in";
    } else {
      image.style.transform = "scale(1.5)";
      image.style.cursor = "zoom-out";
    }
  }
}

// Update Cart Count
function updateCartCount() {
  fetch("/cart/count/")
    .then((response) => response.json())
    .then((data) => {
      const cartCountElement = document.querySelector(".cart-count");
      if (cartCountElement) {
        cartCountElement.textContent = data.count;
      }
    })
    .catch((error) => {
      console.error("Error updating cart count:", error);
    });
}

// Show Notification Function
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `alert alert-${
    type === "success" ? "success" : type === "error" ? "danger" : "info"
  } alert-dismissible fade show position-fixed`;
  notification.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";

  notification.innerHTML = `
    <strong>${
      type === "success" ? "Success!" : type === "error" ? "Error!" : "Info!"
    }</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  // Add to page
  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// Image Modal Functions
function openImageModal() {
  const mainImage = document.getElementById("mainImage");
  const modalImage = document.getElementById("modalImage");

  if (mainImage && modalImage) {
    modalImage.src = mainImage.src;
    const imageModal = new bootstrap.Modal(
      document.getElementById("imageModal")
    );
    imageModal.show();
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners for quantity input
  const quantityInput = document.getElementById("quantity");
  if (quantityInput) {
    quantityInput.addEventListener("change", function () {
      const maxStock = parseInt(this.getAttribute("max"));
      if (this.value < 1) {
        this.value = 1;
      } else if (this.value > maxStock) {
        this.value = maxStock;
      }
    });

    // Prevent non-numeric input
    quantityInput.addEventListener("keypress", function (e) {
      if (
        !/[0-9]/.test(e.key) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }
    });
  }

  // Add click event to main image for zoom
  const mainImage = document.querySelector(".main-product-image");
  if (mainImage) {
    mainImage.addEventListener("click", openImageModal);
    mainImage.style.cursor = "pointer";
  }

  // Update cart count on page load
  updateCartCount();
});

console.log("product_detail.js loaded successfully");
