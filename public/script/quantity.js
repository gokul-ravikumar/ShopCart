const subTotal = document.querySelector("#subTotal");
const shipping = document.querySelector("#shipping");
const tax = document.querySelector("#tax");
const total = document.querySelector("#total");
const cartBadge = document.querySelector("#cartCount");
const orderSummary = document.querySelector("#orderSummary")

async function changeCartQnty(productId, operation) {

  if (operation === "INC") {
    const response = await fetch("/user/addToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });

    try {
      const data = await response.json();
      if (data.success === true) {
        const quantity = document.querySelector(`#qntyButton_${productId}`);
        quantity.innerText = data.newQuantity;
        cartBadge.innerText = data.newCartItemCount;

        subTotal.innerText = data.subtotal?.toFixed(2);
        shipping.innerText = data.shipping?.toFixed(2);
        tax.innerText = data.tax?.toFixed(2);
        total.innerText = data.total?.toFixed(2);
      }
    } catch (error) {
      // Swal for tell to login for add to cart
      console.error(error);
      Swal.fire({
        title: "Login Required",
        text: "Please login to continue",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/user/login";
        }
      });
    }
  } else if (operation === "DEC") {
    const response = await fetch("/user/decrementCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });

    try {
      const data = await response.json();
      if (data.success === true) {
        const quantity = document.querySelector(`#qntyButton_${productId}`);
        quantity.innerText = data.newQuantity;
        cartBadge.innerText = data.newCartItemCount;

        subTotal.innerText = data.subtotal?.toFixed(2);
        shipping.innerText = data.shipping?.toFixed(2);
        tax.innerText = data.tax?.toFixed(2);
        total.innerText = data.total?.toFixed(2);

        // If quantity hit 0, optionally remove the item from UI
        if (data.newQuantity === 0) {
          document.querySelector(`#cartItem_${productId}`).remove();
          cartBadge.style.display = "none"
          orderSummary.remove()
          document.querySelector("#cartEmptyText").style.display = "block";

        }
      }
    } catch (error) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to continue",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/user/login";
        }
      });
    }
  }
}
