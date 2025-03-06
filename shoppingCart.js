import formatCurrency from "./util/formatCurrency.js";
const cart_items_wrapper = document.querySelector(".cart__items-wrapper");
const cart_items = document.querySelector(".cart__items");
const cart_btn = document.querySelector(".cart__btn");
const cart_quantity = document.querySelector(".cart__quantity");
const cart_total = document.querySelector(".cart__total");
const cart_item_template = document.querySelector("#cart-item-template");
let shoppingCart = JSON.parse(localStorage.getItem("cart-items")) || [];
let items = []; 

async function fetchData() {
  try {
    const response = await fetch("items.json");
    items = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default async function setupShoppingCart() {
  await fetchData(); // ✅ Ensures data is fetched first
  renderCartItems();
  cart_btn.addEventListener("click", () =>
    cart_items_wrapper.classList.toggle("cart__items-wrapper--active")
  );

  cart_items.addEventListener("click", e => {
    if (!e.target.matches(".cart-item__close-btn")) return;
    const cart_item_id = e.target.closest(".cart-item").id;
    removeFromCart(cart_item_id);
    renderCartItems();
    saveCart();
  });
  
}

export function addToCart(id) {
  const existing_item = shoppingCart.find(entry => entry.id == id);
  if (existing_item) existing_item.quantity++;
  else shoppingCart.push({ id: id, quantity: 1 });
  renderCartItems();
  saveCart();
}

function renderCartItems() {
  cart_items.innerText = "";
  shoppingCart.forEach(entry => {
    const item = items.find(item => item.id == entry.id);
    const cart_item_node = cart_item_template.content.cloneNode(true);
    const cart_item = cart_item_node.querySelector(".cart-item");
    const cart_item_img = cart_item.querySelector(".cart-item__img");
    const cart_item_name = cart_item.querySelector(".cart-item__name");
    const cart_item_quantity = cart_item.querySelector(".cart-item__quantity");
    const cart_item_price = cart_item.querySelector(".cart-item__price");
    cart_item.id = item.id;
    cart_item_img.src = item.imageSrc;
    cart_item_name.innerText = item.name;
    if (entry.quantity > 1) cart_item_quantity.innerText = `x${entry.quantity}`;
    cart_item_price.innerText = formatCurrency(item.priceCents / 100);
    cart_items.appendChild(cart_item);
  });
  const total_cents = shoppingCart.reduce((sum, entry) => {
    const item = items.find(item => item.id == entry.id);
    return (item.priceCents + sum) * entry.quantity;
  }, 0);
  cart_total.innerText = formatCurrency(total_cents / 100);
  cart_quantity.classList.add("cart__quantity--active");
  cart_quantity.innerText = shoppingCart.length;
  if (shoppingCart.length < 1) {
    hideCart();
    cart_quantity.classList.remove("cart__quantity--active");
  }
}

function saveCart() {
  localStorage.setItem("cart-items", JSON.stringify(shoppingCart));
}

function removeFromCart(id) {
  shoppingCart = shoppingCart.filter(entry => entry.id != id);
}

function hideCart() {
  cart_items_wrapper.classList.remove("cart__items-wrapper--active");
}

