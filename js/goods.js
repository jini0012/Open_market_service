const buy = document.querySelector(".buy-wrap");
const goodsImg = buy.querySelector("img");
const goodsInfo = document.querySelector(".goodsInfo");

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
if (!!productId) {
  // 페이지를 열었을 때 이미지, 상품명, 가격 등이 변경되어 보이도록 설정한다.
  fetch(`${fetchUrl}/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        location.href = "error.html";
      }
      return response.json();
    })
    .then((json) => {
      // 페이지가 열렸을 때
      // 이미지 -> fetch내 링크의 이미지, 상품명, 가격 적용
      goodsImg.src = `${json.image}`;
      goodsImg.alt = `${json.info}`;
      goodsInfo.querySelector("h3").textContent = `${json.name}`;
      goodsInfo.querySelector("p").textContent = `${json.seller.store_name}`;
      goodsInfo.querySelector("span").textContent = new Intl.NumberFormat(
        "ko-KR"
      ).format(json.price); // 천 단위 쉼표 포함

      // 택배배송, 직접배송인지 정하는 함수
      function shipping() {
        if (json.shipping_method === "PARCEL") {
          return "택배배송";
        } else if (json.shipping_method === "DELIVERY") {
          return "화물운송";
        }
      }

      // 배송비가 0이 아닐 때 배송비
      if (json.shipping_fee !== 0) {
        buy.querySelector(
          ".shippingFee"
        ).textContent = `${shipping()}/배송비 : ${json.shipping_fee}원`;
      }
    })
    .catch((error) => console.error(error));
}

// 상품 클릭 시 document.title HODU : 상품 이름으로 변경되게 적용
// 모달창 임시 스크립트
// 로그인이 되지 않은 상태일때만 버튼을 눌렀을 때 모달창이 떠야한다.
// 로그인 예 버튼을 누르면 로그인 창으로 이동, 아니오를 누르면 모달창이 닫힌다.

const form = document.querySelector(".countForm");
const Btns = form.querySelectorAll("button");

const loginModal = document.querySelector(".loginModal");
const closeLoginModal = loginModal.querySelector(".closeModal");
const yesBtn = loginModal.querySelector(".yesBtn");
const noBtn = loginModal.querySelector(".noBtn");

const buyBtn = form.querySelector(".buy");
const cartBtn = form.querySelector(".cart");

// 로그인되어있지 않은 경우
if (!localStorage.accessToken) {
  // 바로 구매 버튼 모달창 open
  buyBtn.addEventListener("click", (e) => {
    // reload 방지용 추가
    e.preventDefault();
    loginModal.showModal();
  });

  // 장바구니 버튼 모달창 open
  cartBtn.addEventListener("click", (e) => {
    // reload 방지용 추가
    e.preventDefault();
    loginModal.showModal();
  });

  // 예 버튼을 눌렀을 떄 로그인창으로 이동
  yesBtn.addEventListener("click", () => {
    location.href = "login.html";
  });

  // 모달창 닫기 버튼 (1)
  closeLoginModal.addEventListener("click", () => {
    loginModal.close();
  });

  // 모달창 닫기 버튼 (2) : 아니오 버튼
  noBtn.addEventListener("click", () => {
    loginModal.close();
  });
}
const num = form.num;
let total = form.querySelector(".count");
let totalPrice = form.querySelector(".totalPrice");

// 판매자 사이트의 경우 바로구매와 장바구니 버튼을 disabled 적용
if (localStorage.type === "SELLER") {
  buyBtn.disabled = true;
  cartBtn.disabled = true;
}

// 로컬스토리지에 저장(문자열타입)된 가격 불러와서 사용
const defaultPrice = localStorage.price;

// 가격 초기 값 설정 (천 단위로 쉼표 추가)
totalPrice.textContent = new Intl.NumberFormat("ko-KR").format(
  Number(defaultPrice) + Number(localStorage.fee)
);

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

    // 계산된 가격을 쉼표 포함한 형식으로 변경하여 표시
    totalPrice.textContent = new Intl.NumberFormat("ko-KR").format(
      Number(num.value) * Number(defaultPrice) + Number(localStorage.fee)
    );

    // 만약 총 수량이 0개라면 총 가격도 0으로 표시
    if (total.textContent === "0") {
      totalPrice.textContent = "0";
    }

    // 만약 상품 수량이 0이면 +버튼 활성화, 마이너스 버튼 비활성화
    if (num.value === "0") {
      plus.disabled = false;
      plus.classList.remove("plusDisabled");
      plus.querySelector("img").src = "./assets/icon-plus-line.svg";
      buyBtn.disabled = true;
      cartBtn.disabled = true;

      minus.disabled = true;
      minus.classList.add("plusDisabled");
    } else if (num.value !== "0") {
      minus.disabled = false;
      minus.classList.remove("plusDisabled");
      buyBtn.disabled = false;
      cartBtn.disabled = false;

      // +버튼을 누르다가 상품 재고 수량과 값이 같으면 +버튼 비활성화
      if (Number(localStorage.stock) <= Number(num.value)) {
        plus.disabled = true;
        plus.classList.add("plusDisabled");
        plus.querySelector("img").src = "./assets/icon-plus-line-disabled.svg";
      } else {
        // 상품 재고 수량과 선택한 값이 같지 않으면 + 버튼 활성화
        plus.disabled = false;
        plus.classList.remove("plusDisabled");
        plus.querySelector("img").src = "./assets/icon-plus-line.svg";
      }
    }
  });
});

// 재고 1인경우 버튼을 누르지 않아도 +버튼 비활성화
if (localStorage.stock === "1") {
  plus.disabled = true;
  plus.classList.add("plusDisabled");
  plus.querySelector("img").src = "./assets/icon-plus-line-disabled.svg";
}

if (!!localStorage.accessToken && !!productId) {
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fetch(`${fetchUrl}/cart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
      body: JSON.stringify({
        product_id: parseInt(productId),
        quantity: parseInt(total.textContent),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          location.href = "error.html";
        }
        return response.json();
      })
      .then((json) => {
        const goCartPage = confirm(
          `${json.detail}\n장바구니로 이동하시겠습니까?`
        );
        if (goCartPage) {
          location.href = "cart.html";
        }
      })
      .catch((error) => console.error("error : ", error));
  });
}
