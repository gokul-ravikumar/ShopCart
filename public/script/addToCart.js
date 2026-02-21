const addToCartButton = document.querySelector("#addToCart");
const input = document.querySelector("#productId");

addToCartButton.onclick = async () => {
  console.log("Adding to cart:", input.value);
  const response = await fetch("/user/addToCart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: input.value,
    }),
  });

  try {
    const data = await response.json();
    if (data.success === true) {
      Swal.fire({
        title: "Success!",
        text: "Item added to cart!",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    // Swal for tell to login for add to cart
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
};
