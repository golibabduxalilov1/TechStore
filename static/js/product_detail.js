// Product Detail JavaScript Functions

// Quantity Controls
function increaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  let currentValue = parseInt(quantityInput.value);
  quantityInput.value = currentValue + 1;
}

function decreaseQuantity() {
  const quantityInput = document.getElementById("quantity");
  let currentValue = parseInt(quantityInput.value);
  if (currentValue > 1) {
    quantityInput.value = currentValue - 1;
  }
}

// Image Zoom
function zoomImage() {
  const image = document.querySelector(".product-main-image");
  if (image.style.transform === "scale(1.5)") {
    image.style.transform = "scale(1)";
    image.style.cursor = "zoom-in";
  } else {
    image.style.transform = "scale(1.5)";
    image.style.cursor = "zoom-out";
  }
}

// // Toggle Wishlist
// function toggleWishlist() {
//   const wishlistBtn = document.querySelector(".wishlist-btn i");
//   if (wishlistBtn.classList.contains("far")) {
//     wishlistBtn.classList.remove("far");
//     wishlistBtn.classList.add("fas");
//     wishlistBtn.parentElement.style.background = "#e74c3c";
//     wishlistBtn.parentElement.style.color = "white";
//   } else {
//     wishlistBtn.classList.remove("fas");
//     wishlistBtn.classList.add("far");
//     wishlistBtn.parentElement.style.background = "#f8f9fa";
//     wishlistBtn.parentElement.style.color = "#666";
//   }
// }

// Update Cart Count
function updateCartCount() {
  // This function can be used to update cart count in header
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

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners
  const quantityInput = document.getElementById("quantity");
  if (quantityInput) {
    quantityInput.addEventListener("change", function () {
      if (this.value < 1) {
        this.value = 1;
      }
    });
  }
});
