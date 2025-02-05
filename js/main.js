// 상품 목록창 실행 시 로컬스토리지 초기화
localStorage.removeItem("product_info");

function saveData(json) {
  const product = JSON.parse(json);
  localStorage.setItem(
    "product_info",
    JSON.stringify({
      id: product.id,
      name: product.name,
      seller: product.seller.store_name,
      price: product.price,
      shipping_fee: product.shipping_fee,
      image: product.image,
      info: product.info,
      stock: product.stock,
    })
  );
}

const moreBtn = document.querySelector(".more-btn");
moreBtn.addEventListener("click", () => {
  loadGoodsList(true);
  moreBtn.style.display = "none";
});

// 상품 전체 불러오기
function loadGoodsList(isMoreBtn = false) {
  const productList = document.querySelector(".goodsList");

  fetch(`${fetchUrl}/products/`)
    .then((response) => {
      if (!response.ok) {
        location.href = "error.html";
      }
      return response.json();
    })
    .then((json) => {
      const products = json.results;
      let productCount = 6;

      if (json.count < 6) {
        moreBtn.style.display = "none";
      }

      isMoreBtn
        ? (productCount = json.count)
        : json.count >= 6
        ? (productCount = 6)
        : (productCount = json.count);

      productList.innerHTML = products
        .slice(0, productCount)
        .map((product) => {
          return `  
         <article>
          <a href="goods.html?id=${
            product.id
          }" onclick="saveData('${JSON.stringify(product)
            .replace(/'/g, "\\'")
            .replace(/"/g, "&quot;")}')">
            <img src="${product.image}" alt="${product.info}" />
            <p>${product.seller.store_name}</p>
            <h3>${product.name}</h3>
            <p class="price">
              <span>${new Intl.NumberFormat("ko-KR").format(
                product.price
              )}</span>원
            </p>
          </a>
        </article>
`;
        })
        .join("");
    })
    .catch((error) => console.error(error));
}
loadGoodsList();

const banner = document.querySelector(".banner ul");
const slides = document.querySelectorAll(".banner ul li");
const leftBtn = document.querySelector(".leftBtn");
const rightBtn = document.querySelector(".rightBtn");
const slideWidth = slides[0].offsetWidth;
let currentIndex = 0;

function moveSlide(index) {
  banner.style.transform = `translateX(${-index * slideWidth}px)`;
}

leftBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  moveSlide(currentIndex);
});

rightBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length;
  moveSlide(currentIndex);
});
