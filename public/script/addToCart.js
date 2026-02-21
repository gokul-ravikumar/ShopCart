const addToCartButton = document.querySelector("#addToCart");
const input = document.querySelector("#productId");

addToCartButton.onclick = () => {
  console.log("Adding to cart:", input.value);
  fetch("/user/addToCart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: input.value,
    }),
  })
    .then(res => {
      res.json();
    })
    .then((data) => {
      console.log("DAAAATAAA:",data);
      alert("Product added to cart!");
    });
};
