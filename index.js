// console.log("hello from js")

let allTrees = [];
let activeCategory = "All Trees";

const loadTrees = () => {
  const cardContainer = document.getElementById("tree-cards");

  // show loader only for tree cards
  cardContainer.innerHTML = `<div class="col-span-full flex justify-center w-full py-20"><span class="loading loading-infinity loading-xl"></span></div>`;

  fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => {
      allTrees = data.plants;
      displayTrees(allTrees);
    })
    .catch(err => {
      console.error("Error loading trees:", err);
      cardContainer.innerHTML = `<p class="text-center text-red-500 py-10">Failed to load trees</p>`;
    });
};

//     card container
const displayTrees = (trees) => {
  const cardContainer = document.getElementById("tree-cards");
  cardContainer.innerHTML = "";
  trees.forEach(tree => {
    const card = document.createElement("div");
    card.className = "card bg-base-100 shadow-sm flex flex-col";

    card.innerHTML = `
      <figure class="h-48 overflow-hidden">
        <img src="${tree.image}" alt="${tree.name}" class="h-full w-full object-cover" />
      </figure>
      <div class="card-body flex flex-col justify-between flex-grow">
        <div>
          <h2 class="text-lg font-semibold cursor-pointer hover:underline" onclick="showTreeDetails(${tree.id})">
            ${tree.name}
          </h2>
          <p class="text-sm text-gray-600 mt-2 line-clamp-3">${tree.description}</p>
        </div>
        <div class="card-actions justify-between items-center mt-3">
          <div class="badge bg-[#DCFCE7] text-[#15803D]">${tree.category}</div>
          <div class="badge">৳${tree.price}</div>
        </div>
        <button onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})"
          class="btn w-full bg-[#15803D] text-white rounded-full mt-3">
          Add to Cart
        </button>
      </div>
    `;
    cardContainer.appendChild(card);
  });
};


const showTreeDetails = (id) => {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(res => res.json())
    .then(data => {
      const tree = data;
      alert(`${tree.name}\n\n${tree.description}`);
    });
};


const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(data => displayCategories(data.categories))
    .catch(err => console.error("Error loading categories:", err));
};

//     left aside Categories
const displayCategories = (categories) => {
  const categoryList = document.getElementById("category-list");
  categoryList.innerHTML = "";

  //    All Trees
  const allLi = document.createElement("li");
  allLi.className = "cursor-pointer p-2 rounded mb-2";
  allLi.textContent = "All Trees";

  allLi.onmouseover = () => allLi.style.backgroundColor = "#15803D";
  allLi.onmouseout = () => {
    if (activeCategory !== "All Trees") allLi.style.backgroundColor = "";
  };
  allLi.onclick = () => {
    activeCategory = "All Trees";
    updateActiveCategoryHighlight();
    displayTrees(allTrees);
  };
  categoryList.appendChild(allLi);

  // Add other categories dynamically
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.className = "cursor-pointer p-2 rounded mb-2";
    li.textContent = cat.category_name;

    li.onmouseover = () => li.style.backgroundColor = "#15803D";
    li.onmouseout = () => {
      if (activeCategory !== cat.category_name) li.style.backgroundColor = "";
    };
    li.onclick = () => {
      activeCategory = cat.category_name;
      updateActiveCategoryHighlight();
      filterByCategory(cat.category_name);
    };

    categoryList.appendChild(li);
  });

  // highlight the active category
  updateActiveCategoryHighlight();
};

const updateActiveCategoryHighlight = () => {
  const categoryList = document.getElementById("category-list").children;
  for (let li of categoryList) {
    if (li.textContent === activeCategory) {
      li.style.backgroundColor = "#15803D";
      li.style.color = "#fff";
    } else {
      li.style.backgroundColor = "";
      li.style.color = "";
    }
  }
};

//    filter by category
const filterByCategory = (categoryName) => {
  const filteredTrees = allTrees.filter(tree => tree.category === categoryName);
  displayTrees(filteredTrees);
};

//    right aside
let cart = [];
const addToCart = (id, name, price) => {
  cart.push({ id, name, price });
  displayCart();
};

const displayCart = () => {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.className = "bg-[#F0FDF4] p-3 rounded-md mb-2 flex justify-between items-center";

    div.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-[#1f293775]">৳${item.price}</p>
      </div>
      <button onclick="removeFromCart(${index})" class="text-lg text-[#1f293775] cursor-pointer">x</button>
    `;

    cartItems.appendChild(div);
  });

  cartTotal.textContent = `৳${total}`;
};

const removeFromCart = (index) => {
  cart.splice(index, 1);
  displayCart();
};


loadTrees();
loadCategories();