/* RELICZ99 — product catalogue and WhatsApp ordering */
const CONFIG = {
  brandName: "Relicz99",
  whatsappNumber: "917057059903", // India country code +91 + 7057059903
  currency: "₹",
  price: 1199,
  instagramUrl: "https://www.instagram.com/" // Replace with the official Relicz99 profile URL
};

// Replace image paths with your own original product photographs.
// Set image to "" to show the designed placeholder.
const products = [
  {id:1,name:"Manchester United 26/27",team:"Manchester United",category:"Football",image:"jersey%20imags/manu.jpg"},
  {id:2,name:"FC Barcelona 26/27",team:"FC Barcelona",category:"Football",image:"jersey%20imags/barca.jpg"},
  {id:3,name:"Real Madrid 26/27",team:"Real Madrid",category:"Football",image:"jersey%20imags/realmadrid.jpg"},
  {id:4,name:"Manchester City 26/27",team:"Manchester City",category:"Football",image:"jersey%20imags/mancity.jpg"},
  {id:5,name:"Liverpool 26/27",team:"Liverpool",category:"Football",image:"jersey%20imags/liverpool.jpg"},
  {id:6,name:"Inter Milan 26/27",team:"Inter Milan",category:"Football",image:"jersey%20imags/inter.jpg"},
  {id:7,name:"Arsenal 26/27",team:"Arsenal",category:"Football",image:"jersey%20imags/arsenal.jpg"},
  {id:8,name:"Bayern Munich 26/27",team:"Bayern Munich",category:"Football",image:"jersey%20imags/bayern.jpg"},
  {id:9,name:"AC Milan 26/27",team:"AC Milan",category:"Football",image:"jersey%20imags/acmilan.jpg"},
  {id:10,name:"India Test",team:"India",category:"Cricket",image:"jersey%20imags/teaminidatest.jpg"},
  {id:11,name:"India T20",team:"India T20",category:"Cricket",image:"jersey%20imags/teaminidat20.jpg"},
  {id:12,name:"India ODI",team:"India ODI",category:"Cricket",image:"jersey%20imags/teamindiaodi.jpg"},
  {id:13,name:"Real Madrid Away 26/27",team:"Real Madrid",category:"Football",image:"jersey%20imags/realmadridaway.jpg"},
  {id:14,name:"FC Barcelona Away 26/27",team:"FC Barcelona",category:"Football",image:"jersey%20imags/barcaaway.jpg"},
  {id:15,name:"Bayern Munich Away 26/27",team:"Bayern Munich",category:"Football",image:"jersey%20imags/bayernaway.jpg"},
  {id:16,name:"AC Milan Away 26/27",team:"AC Milan",category:"Football",image:"jersey%20imags/acmilanaway.jpg"},
  {id:17,name:"Arsenal Away 26/27",team:"Arsenal",category:"Football",image:"jersey%20imags/arsenalaway.jpg"},
  {id:18,name:"Atletico Madrid 26/27",team:"Atletico Madrid",category:"Football",image:"jersey%20imags/atleticomadrid.jpg"},
  {id:19,name:"Chelsea Home 26/27",team:"Chelsea",category:"Football",image:"jersey%20imags/chelseahome.jpg"},
  {id:20,name:"Chelsea Away 26/27",team:"Chelsea",category:"Football",image:"jersey%20imags/chelseaaway.jpg"},
  {id:21,name:"Adidas Mercedes AMG Petronas - Black",team:"Mercedes AMG Petronas",category:"Formula 1",image:"jersey%20imags/mercedesamg.jpg", price:1999},
  {id:22,name:"Adidas Mercedes AMG Petronas - White",team:"Mercedes AMG Petronas",category:"Formula 1",image:"jersey%20imags/mercedespetronaswhite.jpg", price:1999}
];

const productGrid = document.getElementById("product-grid");
const noResults = document.getElementById("no-results");
const searchInput = document.getElementById("site-search");
const modal = document.getElementById("product-modal");
const sizeError = document.getElementById("size-error");
let activeFilter = "All";
let activeProduct = null;
let selectedSize = "";

function placeholderMarkup(product) {
  const initials = product.name.split(/\s+/).slice(0,2).map(word => word[0]).join("").toUpperCase();
  return `<div class="product-placeholder" aria-label="${product.name} placeholder"><strong>${initials}</strong></div>`;
}

function productImageMarkup(product, extraClass = "") {
  if (!product.image) return placeholderMarkup(product);
  return `<img class="${extraClass}" src="${product.image}" alt="${product.name} authentic player version jersey" loading="lazy" data-fallback-product-id="${product.id}">`;
}

function attachImageFallbacks() {
  document.querySelectorAll("img[data-fallback-product-id]").forEach(img => {
    if (img.dataset.fallbackBound === "true") return;
    img.dataset.fallbackBound = "true";
    img.addEventListener("error", () => {
      const product = products.find(item => item.id === Number(img.dataset.fallbackProductId));
      if (!product) return;
      const parent = img.parentElement;
      if (!parent) return;
      parent.innerHTML = placeholderMarkup(product);
    });
  });
}

function renderProducts() {
  const query = (searchInput?.value || "").trim().toLowerCase();
  let visible = products.filter(product => {
    const matchesFilter = activeFilter === "All" || product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.team} ${product.category}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const sort = document.getElementById("sort-select")?.value;
  if (sort === "az") visible.sort((a,b) => a.name.localeCompare(b.name));

  productGrid.innerHTML = visible.map(product => {
    const productPrice = product.price ?? CONFIG.price;
    return `
      <article class="product-card">
        <div class="product-image" data-product="${product.id}" tabindex="0" role="button" aria-label="View ${product.name} jersey">
          <span class="product-tag">PLAYER VERSION</span>
          ${productImageMarkup(product)}
        </div>
        <div class="product-info">
          <div class="product-title-row"><h3 class="product-title">${product.name}</h3></div>
          <p class="product-category">${product.category.toUpperCase()} / AUTHENTIC PLAYER VERSION</p>
          <div class="product-price">${CONFIG.currency}${productPrice.toLocaleString("en-IN")}</div>
          <button class="product-order" type="button" data-product="${product.id}">VIEW & ORDER <span>↗</span></button>
        </div>
      </article>
    `;
  }).join("");

  noResults.hidden = visible.length !== 0;
  attachImageFallbacks();
}

function openProduct(productId) {
  activeProduct = products.find(product => product.id === Number(productId));
  if (!activeProduct) return;
  selectedSize = "";
  sizeError.textContent = "";
  document.getElementById("modal-title").textContent = activeProduct.name;
  document.getElementById("modal-image").innerHTML = productImageMarkup(activeProduct);
  attachImageFallbacks();
  document.querySelectorAll("#size-options button").forEach(button => button.classList.remove("selected"));
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
  document.getElementById("modal-close").focus();
}

function closeProduct() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
  activeProduct = null;
}

function whatsappOrder(product, size) {
  const productPrice = product.price ?? CONFIG.price;
  const message = [
    `Hello ${CONFIG.brandName}!`,
    "",
    "I'm interested in ordering the following jersey:",
    "",
    `Product: ${product.name}`,
    "Version: Authentic Player Version",
    `Size: ${size}`,
    `Price: ${CONFIG.currency}${productPrice.toLocaleString("en-IN")}`,
    "",
    "Please share the ordering details.",
    "",
    "Thank you!"
  ].join("\n");

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Product interactions
productGrid.addEventListener("click", event => {
  const trigger = event.target.closest("[data-product]");
  if (trigger) openProduct(trigger.dataset.product);
});
productGrid.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".product-image[data-product]")) {
    event.preventDefault();
    openProduct(event.target.dataset.product);
  }
});

document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach(item => item.classList.toggle("active", item === button));
    renderProducts();
  });
});

document.getElementById("sort-select").addEventListener("change", renderProducts);
searchInput.addEventListener("input", renderProducts);
document.querySelectorAll("[data-category-link]").forEach(link => {
  link.addEventListener("click", () => {
    activeFilter = link.dataset.categoryLink;
    document.querySelectorAll(".filter-button").forEach(button => button.classList.toggle("active", button.dataset.filter === activeFilter));
    renderProducts();
  });
});

document.getElementById("size-options").addEventListener("click", event => {
  const button = event.target.closest("[data-size]");
  if (!button) return;
  selectedSize = button.dataset.size;
  sizeError.textContent = "";
  document.querySelectorAll("#size-options button").forEach(item => item.classList.toggle("selected", item === button));
});

document.getElementById("modal-order").addEventListener("click", () => {
  if (!activeProduct) return;
  if (!selectedSize) {
    sizeError.textContent = "Please select a size to continue.";
    return;
  }
  whatsappOrder(activeProduct, selectedSize);
});

document.getElementById("modal-close").addEventListener("click", closeProduct);
modal.addEventListener("click", event => {
  if (event.target.matches("[data-close-modal]")) closeProduct();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeProduct();
});

// Mobile menu
const menuToggle = document.getElementById("menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileNav.classList.toggle("open", !isOpen);
});
mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mobileNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded","false");
}));

// Search panel
const searchPanel = document.getElementById("search-panel");
document.getElementById("search-toggle").addEventListener("click", () => {
  searchPanel.classList.toggle("open");
  if (searchPanel.classList.contains("open")) searchInput.focus();
});
document.getElementById("search-close").addEventListener("click", () => searchPanel.classList.remove("open"));

// Sticky header and reveal animations
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20), {passive:true});

const tiltElements = document.querySelectorAll(".hero-image-wrap, .category-card, .product-card, .detail-visual");
tiltElements.forEach(element => {
  element.addEventListener("pointermove", event => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = x * 10;
    const rotateX = y * -10;
    element.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
}

// Initial render
renderProducts();
