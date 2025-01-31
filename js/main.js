// 상품 목록창 실행 시 로컬스토리지 초기화
localStorage.removeItem("stock");
localStorage.removeItem("price");
localStorage.removeItem("fee");

// 상품 전체 불러오기
function loadGoodsList() {
  const products = document.querySelectorAll("article");
  fetch(`${fetchUrl}/products/`)
    .then((response) => {
      if (!response.ok) {
        location.href = "error.html";
      }
      return response.json();
    })
    .then((json) => {
      products.forEach((product, index) => {
        product.querySelector("img").src = `${json.results[index].image}`;
        product.querySelector("img").alt = `${json.results[index].info}`;
        product.querySelector(
          "p"
        ).textContent = `${json.results[index].seller.store_name}`;
        product.querySelector("h3").textContent = `${json.results[index].name}`;
        product.querySelector("span").textContent = new Intl.NumberFormat(
          "ko-KR"
        ).format(json.results[index].price);

        // 상세페이지로 이동
        product.addEventListener("click", (e) => {
          localStorage.setItem("price", `${json.results[index].price}`); // product 가격
          localStorage.setItem("fee", `${json.results[index].shipping_fee}`); // product 배송비
          localStorage.setItem("stock", `${json.results[index].stock}`); // product 재고수량
          location.href = `goods.html?id=${json.results[index].id}`;
        });
      });
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
