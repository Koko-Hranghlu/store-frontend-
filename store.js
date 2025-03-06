import { addToCart } from "./shoppingCart.js";
import formatCurrency from "./util/formatCurrency.js";
const item_template = document.querySelector("#item-template");
const items_container = document.querySelector(".items");
let items = []; // Declare an empty array
async function fetchData() {
  try {
    const response = await fetch("items.json");
    items = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default async function setupStore() {
  if (items_container == null) return;
  await fetchData();
  items.forEach(renderStoreItem);
  document.addEventListener("click", e => {
    if (!e.target.matches(".item__add-btn")) return;
    const item_id = e.target.parentElement.id;
    addToCart(item_id);
  });
}

function renderStoreItem(item) {
  const storeItemTemplate = item_template.content.cloneNode(true);
  const storeItem = storeItemTemplate.querySelector(".item");
  storeItem.id = item.id;
  const img = storeItem.querySelector(".item__img");
  const category = storeItem.querySelector(".item__category");
  const name = storeItem.querySelector(".item__name");
  const price = storeItem.querySelector(".item__price");
  img.src = item.imageSrc;
  category.innerText = item.category;
  name.innerText = item.name;
  price.innerText = formatCurrency(item.priceCents / 100);
  items_container.append(storeItem);
}
