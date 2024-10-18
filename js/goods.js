const buy = document.querySelector(".buy-wrap");
const goodsImg = buy.querySelector(" img");
const goodsInfo = document.querySelector(".goodsInfo");

// 페이지를 열었을 때 이미지, 상품명, 가격 등이 변경되어 보이도록 설정한다.
fetch(
  `https://estapi.openmarket.weniv.co.kr/products/${localStorage.productId}`
)
  .then((response) => response.json())
  .then((json) => {
    // 페이지가 열렸을 때
    // 이미지 -> fetch내 링크의 이미지, 상품명, 가격 적용
    goodsImg.src = `${json.image}`;
    goodsImg.alt = `${json.info}`;
    goodsInfo.querySelector("h3").textContent = `${json.name}`;
    goodsInfo.querySelector("p").textContent = `${json.seller.store_name}`;
    goodsInfo.querySelector("span").textContent = `${json.price}`;
    buy.querySelector(
      ".shippingFee"
    ).textContent = `택배배송/배송비 : ${localStorage.fee}원`;
  })
  .catch((error) => console.error(error));

// 상품 클릭 시 document.title HODU : 상품 이름으로 변경되게 적용
// 모달창 임시 스크립트
// 로그인이 되지 않은 상태일때만 버튼을 눌렀을 때 모달창이 떠야한다.
// 로그인 예 버튼을 누르면 로그인 창으로 이동, 아니오를 누르면 모달창이 닫힌다.

const loginModal = document.querySelector(".loginModal");
const closeloginModal = loginModal.querySelector(".closeModal");
const yesBtn = loginModal.querySelector(".yesBtn");
const noBtn = loginModal.querySelector(".noBtn");
const buyBtn = document.querySelector(".buy");
const cartBtn = document.querySelector(".cart");

// 로그인되어있지 않은 경우
if (!localStorage.accessToken) {
  // 바로 구매 버튼 모달창 open
  buyBtn.addEventListener("click", () => {
    loginModal.showModal();
  });

  // 장바구니 버튼 모달창 open
  cartBtn.addEventListener("click", () => {
    loginModal.showModal();
  });

  // 예 버튼을 눌렀을 떄 로그인창으로 이동
  yesBtn.addEventListener("click", () => {
    location.href = "login.html";
  });

  // 모달창 닫기 버튼 (1)
  closeloginModal.addEventListener("click", () => {
    loginModal.close();
  });

  // 모달창 닫기 버튼 (2) : 아니오 버튼
  noBtn.addEventListener("click", () => {
    loginModal.close();
  });
}

// 판매자 사이트의경우 바로구매와 장바구니를 disabled(클래스 부여 또는 속성 적용)

const form = document.querySelector(".countForm");
const Btns = form.querySelectorAll("button");
const num = form.num;
let total = form.querySelector(".count");
let totalPrice = form.querySelector(".totalPrice");
// const defaultPrice = totalPrice.textContent
//   .split("")
//   .filter((elem) => elem >= 0)
//   .join("");

// 로컬스토리지에 저장(문자열타입)된 가격 불러와서 사용
const defaultPrice = localStorage.price;
// .split("")
// .filter((elem) => elem >= 0)
// .join("");
// 가격 초기 값 설정
totalPrice.textContent = Number(defaultPrice) + Number(localStorage.fee);

// - 버튼 또는 + 버튼 클릭 시 input.value 변경
let count = 1;
Btns.forEach((button) => {
  button.addEventListener("click", () => {
    if (count >= 1) {
      if (button.id === "plus") {
        count++;
      } else if (button.id === "minus") {
        count--;
      }
    } else {
      count = 1;
    }
    num.value = count;
    // 총 수량 함께 변경 및 금액 변경
    total.textContent = num.value;
    totalPrice.textContent =
      Number(num.value) * Number(defaultPrice) + Number(localStorage.fee);

    // +버튼을 누르다가 상품 재고 수량과 값이 같으면 +버튼 비활성화
    if (Number(localStorage.stock) <= Number(num.value)) {
      plus.disabled = true;
      plus.classList.add("plusDisabled");
      plus.querySelector("img").src = "./assets/icon-plus-line-disabled.svg";
    }
  });
});

// 재고 1인경우 +버튼 비활성화
if (localStorage.stock === "1") {
  plus.disabled = true;
  plus.classList.add("plusDisabled");
  plus.querySelector("img").src = "./assets/icon-plus-line-disabled.svg";
}
