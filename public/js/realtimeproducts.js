const socket = io();

const productsList = document.getElementById("products-list");
socket.on("products", (data) => {
  productsList.innerHTML = "";

  for (const el of data) {
    const li = document.createElement("li");
    li.innerText = `ID: ${el.id} / Título: ${el.title}
      Descripción: ${el.description} / Precio: ${el.price}
      Miniaturas: ${el.thumbnail} / Código: ${el.code}
      Stock: ${el.stock} / Categoria: ${el.category}
      Estado: ${el.status}`;
    productsList.appendChild(li);
  }
});
