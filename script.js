// --- Hero Scroll Animation Setup ---
const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = index => (
  `/public/hero-sequence/ezgif-frame-${index.toString().padStart(3, '0')}.png`
);

const images = [];
let imagesLoaded = 0;

// Set canvas dimensions
canvas.width = 1920;
canvas.height = 1080;

// Preload Images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  img.onload = () => {
    imagesLoaded++;
    if (i === 1) renderFrame(1);
  };
  // Fallback if image not found to avoid blank screen
  img.onerror = () => {
    imagesLoaded++;
    if (i === 1) renderFallback();
  };
  images.push(img);
}

function renderFallback() {
  context.fillStyle = "#111";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#333";
  context.font = "40px Inter";
  context.textAlign = "center";
  context.fillText("[ Hero Sequence Frame Placeholder ]", canvas.width/2, canvas.height/2);
}

function renderFrame(index) {
  if(images[index - 1] && images[index - 1].complete && images[index - 1].naturalWidth !== 0) {
    const img = images[index - 1];
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  } else {
    renderFallback();
  }
}

const heroSection = document.getElementById("hero");
const heroText = document.getElementById("hero-text");

window.addEventListener('scroll', () => {  
  const scrollTop = Math.max(0, document.documentElement.scrollTop);
  
  // Ensure exactly 1 full loop completes precisely as the user scrolls down 200vh
  const loopPixels = window.innerHeight * 2; 
  const pixelsPerFrame = loopPixels / frameCount;
  
  // Mathematical modulo to loop the frames seamlessly as user scrolls through the menu
  const frameIndex = Math.floor(scrollTop / pixelsPerFrame) % frameCount;
  
  requestAnimationFrame(() => {
    // Render current frame (array is 0-indexed, but renderFrame takes 1-indexed)
    renderFrame(frameIndex + 1);
    
    // Fade out text over the first 50vh of scrolling
    const fadePointPixels = window.innerHeight * 0.5; 
    const opacity = 1 - (scrollTop / fadePointPixels);
    heroText.style.opacity = Math.max(0, opacity);
    
    // Slide text up gently
    heroText.style.transform = `translate(-50%, calc(-50% + ${scrollTop * 0.5}px))`;
    // Prevent pointer blocking when text is fully invisible
    heroText.style.pointerEvents = opacity <= 0 ? 'none' : 'auto';
  });
});

// --- Menu Rendering ---
const menuData = [
  // STARTERS [cite: 14]
  { category: "Starters", name: "French Fries", price: 100, desc: "Classic golden fries." }, // [cite: 33]
  { category: "Starters", name: "Peri Peri Fries", price: 120, desc: "Fries with a spicy kick." }, // [cite: 33]
  { category: "Starters", name: "Chicken Nuggets", price: 129, desc: "Crispy chicken bites." }, // [cite: 33]
  { category: "Starters", name: "Chicken Strips", price: 189, desc: "Tender fried chicken strips." }, // [cite: 33]
  { category: "Starters", name: "Ultimate Creamy Fries", price: 219, desc: "Golden crispy fries drenched in rich, creamy cheese sauce, topped with herbs and a light spice kick." }, // [cite: 35, 36, 37]
  { category: "Starters", name: "Western Beef Cheesy Fries", price: 230, desc: "Crispy fries loaded with spicy seasoned beef and melted cheese, finished with a bold, fiery kick." }, // [cite: 38, 39, 40]
  { category: "Starters", name: "Grilled Chicken Salad", price: 219, desc: "Fresh leafy greens topped with tender, smoky grilled chicken - crisp, light and full of flavor." }, // [cite: 42, 43, 44, 45]

  // BURGERS [cite: 17]
  { category: "Burgers", name: "Wild West Classic (Chicken)", price: 180, desc: "Classic chicken burger." }, // [cite: 48, 55]
  { category: "Burgers", name: "Wild West Classic (Beef)", price: 200, desc: "Classic beef burger." }, // [cite: 48, 55]
  { category: "Burgers", name: "Crispy Chicken Burger", price: 190, desc: "Crispy fried chicken patty with a juicy center, layered with fresh greens and house sauce." }, // [cite: 49, 56, 57]
  { category: "Burgers", name: "OG Smash", price: 220, desc: "Double smashed beef patty seared for maximum flavor, topped with onions, melted cheese, crisp lettuce and our signature OG sauce." }, // [cite: 58, 59, 60]
  { category: "Burgers", name: "Bacon Barrel", price: 239, desc: "Juicy grilled beef patty stacked with crispy bacon, melted cheese, fresh lettuce, tomatoes and creamy house sauce." }, // [cite: 61, 62, 63]
  { category: "Burgers", name: "Ultimate Burger", price: 252, desc: "Double meat, double cheese and bold smoky flavor, built for a heavy, satisfying bite." }, // [cite: 64, 65, 66]
  { category: "Burgers", name: "Bite Crusher", price: 279, desc: "Crispy fried patty coated in sweet honey and smoky BBQ sauce, layered with melted cheese and crunchy greens." }, // [cite: 67, 68, 69]

  // WRAPS [cite: 18]
  { category: "Wraps", name: "Kuboos Roll", price: 129, desc: "Soft kuboos filled with juicy shawai chicken, packed with rich, smoky flavor." }, // [cite: 77, 78, 79]
  { category: "Wraps", name: "Romali Shawai", price: 189, desc: "Tender shawai chicken wrapped in warm romali with fresh toppings." }, // [cite: 80, 81, 82]
  { category: "Wraps", name: "Cowboy Beast Wrap", price: 239, desc: "Loaded romali wrap stacked with crispy chicken, egg, fries and spicy jalapenos." }, // [cite: 83, 84, 85, 86]

  // FRIED CHICKEN [cite: 19]
  { category: "Fried Chicken", name: "2 PCS Meal", price: 229, desc: "Includes 1 bun, side fries, ketchup & mayo." }, // [cite: 98, 101, 104, 107, 109, 110]
  { category: "Fried Chicken", name: "4 PCS Meal", price: 419, desc: "Includes 2 buns, side fries, 2 ketchup & mayo." }, // [cite: 99, 102, 105, 108, 112, 113]
  { category: "Fried Chicken", name: "8 PCS Meal", price: 699, desc: "Includes 4 buns, side fries, 4 ketchup & mayo." }, // [cite: 100, 103, 106, 111, 114]

  // SHAWAI CHICKEN [cite: 20]
  { category: "Shawai Chicken", name: "Normal Shawai (Half)", price: 300, desc: "2 Pcs Chicken, 2 Kuboos, Dip, Salad." }, // [cite: 120, 123, 124, 125]
  { category: "Shawai Chicken", name: "Normal Shawai (Full)", price: 599, desc: "4 Pcs Chicken, 4 Kuboos, Dip, Salad, Soft Drink." }, // [cite: 120, 126, 127, 128, 129, 130]
  { category: "Shawai Chicken", name: "Masala Shawai (Half)", price: 315, desc: "2 Pcs Chicken, 2 Kuboos, Dip, Salad." }, // [cite: 134, 137, 138]
  { category: "Shawai Chicken", name: "Masala Shawai (Full)", price: 619, desc: "4 Pcs Chicken, 4 Kuboos, Dip, Salad, Soft Drink." }, // [cite: 134, 139, 140, 141]

  // REFRESHING & MOJITOS [cite: 21, 22]
  { category: "Refreshing", name: "Fresh Lime", price: 25, desc: "Classic fresh lime." }, // [cite: 150]
  { category: "Refreshing", name: "Pinemelon Splash", price: 160, desc: "Fresh watermelon and juicy pineapple blended together." }, // [cite: 151, 152, 153]
  { category: "Refreshing", name: "Virgin Mojito", price: 100, desc: "Classic blend of fresh mint, lemon and soda." }, // [cite: 156, 162, 163]
  { category: "Refreshing", name: "Passion Fizz", price: 120, desc: "Tropical passion fruit mixed with mint and soda." }, // [cite: 165, 166, 167]
  { category: "Refreshing", name: "Watermelon Fizz", price: 139, desc: "Fresh watermelon mixed with mint and soda." }, // [cite: 177, 178, 179]

  // BLENDS & COFFEE [cite: 23, 24]
  { category: "Blends", name: "Snicky Shake", price: 159, desc: "Peanut flavoured shake blended with rich caramel and chocolate." }, // [cite: 191, 192, 193]
  { category: "Blends", name: "Dirty Avocado", price: 189, desc: "Fresh avocado pulp blended with creamy milk ice cream and pure honey." }, // [cite: 200, 201, 202]
  { category: "Blends", name: "Cold Coffee", price: 159, desc: "Classic chilled coffee blended with smooth creaminess." } // [cite: 211, 212, 213]
];

const menuImagesFiles = [
  "From Main Klickpin CF- tastytabledcom - 6Xi16k5jH.jpg",
  "ananthan-chithiraikani-7-PQGUrIGOc-unsplash.jpg",
  "d3d5351b-c455-4308-bf43-c2bd4239d5b0.png",
  "pexels-abdul-malik-1081175877-33101857.jpg",
  "pexels-ali-dashti-506667798-27758760.jpg",
  "pexels-alleksana-6107787.jpg",
  "pexels-alleksana-6463653.jpg",
  "pexels-chaitaastic-7353380.jpg",
  "pexels-eiliv-aceron-29416110-6896381.jpg",
  "pexels-farhad-5713744.jpg",
  "pexels-guvo59-30431322.jpg",
  "pexels-hafize-balci-193019428-36499255.jpg",
  "pexels-horizon-content-2100060-3738730.jpg",
  "pexels-horizon-content-2100060-3915915.jpg",
  "pexels-iamaddy-5690808.jpg",
  "pexels-jdgromov-5668213.jpg",
  "pexels-kr8t-6451032.jpg",
  "pexels-ksphotography-6577230.jpg",
  "pexels-marceloverfe-6059770.jpg",
  "pexels-murtada-mustafa-40699748-9211149.jpg",
  "pexels-nadezhda-moryak-4409498.jpg",
  "pexels-rdne-5779364.jpg",
  "pexels-roman-odintsov-4955265.jpg",
  "pexels-roman-odintsov-5338140.jpg",
  "pexels-rsquare-4728009.jpg",
  "pexels-shameel-mukkath-3421394-5112586.jpg",
  "pexels-shameel-mukkath-3421394-5175625.jpg",
  "pexels-shameel-mukkath-3421394-5817604.jpg",
  "pexels-shameel-mukkath-3421394-5817610.jpg",
  "pexels-shameel-mukkath-3421394-5817632.jpg",
  "pexels-shameel-mukkath-3421394-5817633.jpg",
  "pexels-soc-nang-d-ng-2150345854-36402326.jpg",
  "pexels-vancocs-6088519.jpg"
];

const menuContainer = document.getElementById("menu-container");

function renderMenu() {
  let imageIndex = 0;
  const categories = {};
  menuData.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  menuContainer.innerHTML = '';
  
  for (const [category, items] of Object.entries(categories)) {
    const section = document.createElement("div");
    section.className = "category-section";
    
    const title = document.createElement("h3");
    title.className = "category-title";
    title.textContent = category;
    section.appendChild(title);
    
    const grid = document.createElement("div");
    grid.className = "menu-grid";
    
    items.forEach((item, idx) => {
      // Use an available image from the folder sequentially
      const assignedFileName = menuImagesFiles[imageIndex % menuImagesFiles.length];
      imageIndex++;
      const imagePath = `/public/menu-items/${assignedFileName}`;
      
      const card = document.createElement("div");
      card.className = "menu-card";
      card.innerHTML = `
        <div class="menu-image-container">
          <img src="${imagePath}" alt="${item.name}" class="menu-image" onerror="this.src='https://via.placeholder.com/400x300/2a2a2a/d35400?text=${encodeURIComponent(item.name)}'">
        </div>
        <div class="menu-details">
          <h4 class="menu-title">${item.name}</h4>
          <p class="menu-desc">${item.desc}</p>
          <div class="menu-footer">
            <div class="menu-price">₹${item.price}</div>
            <button class="add-btn" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
    
    section.appendChild(grid);
    menuContainer.appendChild(section);
  }
}

// --- Cart Logic ---
let cart = [];
const cartBadge = document.getElementById("cart-badge");
const cartIcon = document.getElementById("cart-icon");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");

function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartBadge.textContent = totalItems;
  
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
    cartTotalPrice.textContent = '₹0';
    return;
  }
  
  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name} (x${item.quantity})</h4>
        <button class="cart-item-remove" data-index="${index}">Remove</button>
      </div>
      <div style="text-align: right;">
        <div class="cart-item-price" style="font-weight: bold; color: var(--text-light); font-size: 1.1rem;">₹${itemTotal}</div>
        <div class="cart-item-price" style="font-size: 0.8rem; margin-top: 5px;">(₹${item.price} each)</div>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });
  
  cartTotalPrice.textContent = '₹' + total;
}

function addToCart(name, price) {
  const existingItem = cart.find(i => i.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price: parseInt(price, 10), quantity: 1 });
  }
  
  cartIcon.classList.remove("bounce");
  void cartIcon.offsetWidth; // trigger reflow
  cartIcon.classList.add("bounce");
  
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function toggleCart() {
  cartSidebar.classList.toggle('cart-hidden');
  cartSidebar.classList.toggle('cart-open');
  cartOverlay.classList.toggle('show');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  updateCartUI();
  
  menuContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (btn) {
      addToCart(btn.dataset.name, btn.dataset.price);
    }
  });
  
  cartIcon.addEventListener('click', toggleCart);
  closeCartBtn.addEventListener('click', toggleCart);
  cartOverlay.addEventListener('click', toggleCart);
  
  cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-item-remove')) {
      removeFromCart(parseInt(e.target.dataset.index, 10));
    }
  });

  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
      alert('Proceeding to checkout with total amount: ' + cartTotalPrice.textContent);
      cart = [];
      updateCartUI();
      toggleCart();
    } else {
      alert('Your cart is empty!');
    }
  });
});
