const buy = document.querySelector(".buy-wrap");
const goodsImg = buy.querySelector("img");
const goodsInfo = document.querySelector(".goodsInfo");

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const product = JSON.parse(localStorage.product_info);

if (!!productId) {
  fetch(`${fetchUrl}/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        location.href = "error.html";
      }
      return response.json();
    })
    .then((json) => {
      document.title = "HODU : " + json.name;
      goodsImg.src = `${json.image}`;
      goodsImg.alt = `${json.info}`;
      goodsInfo.querySelector("h3").textContent = `${json.name}`;
      goodsInfo.querySelector("p").textContent = `${json.seller.store_name}`;
      goodsInfo.querySelector("span").textContent = new Intl.NumberFormat(
        "ko-KR"
      ).format(json.price); // 천 단위 쉼표 포함

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

const form = document.querySelector(".countForm");
const Btns = form.querySelectorAll("button");

const loginModal = document.querySelector(".loginModal");
const closeLoginModal = loginModal.querySelector(".closeModal");
const yesBtn = loginModal.querySelector(".yesBtn");
const noBtn = loginModal.querySelector(".noBtn");

const buyBtn = form.querySelector(".buy");
const cartBtn = form.querySelector(".cart");

if (!localStorage.accessToken) {
  buyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.showModal();
  });

  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.showModal();
  });

  // 예 버튼을 눌렀을 떄 로그인창으로 이동
  yesBtn.addEventListener("click", () => {
    location.href = "login.html";
  });

  closeLoginModal.addEventListener("click", () => {
    loginModal.close();
  });

  noBtn.addEventListener("click", () => {
    loginModal.close();
  });
}
const num = form.num;
let total = form.querySelector(".count");
let totalPrice = form.querySelector(".totalPrice");

// 판매자회원 버튼 예외처리
if (localStorage.type === "SELLER") {
  buyBtn.disabled = true;
  cartBtn.disabled = true;
}

const defaultPrice = product.price;
// 가격 초기 값 설정
totalPrice.textContent = new Intl.NumberFormat("ko-KR").format(
  product.price + product.shipping_fee
);

const minusBtn = form.querySelector(".minus");
const plusBtn = form.querySelector(".plus");
function plusBtnEnabled() {
  plusBtn.disabled = false;
  plus.classList.remove("countBtnDisabled");
  plus.querySelector("img").src = "./assets/icon-plus-line.svg";
}
function plusBtnDisabled() {
  plusBtn.disabled = true;
  plus.classList.add("countBtnDisabled");
  plus.querySelector("img").src = "./assets/icon-plus-line-disabled.svg";
}
function minusBtnEnabled() {
  minusBtn.disabled = false;
  minusBtn.classList.remove("countBtnDisabled");
  minusBtn.querySelector("img").src = "./assets/icon-minus-line.svg";
}
function minusBtnDisabled() {
  minusBtn.disabled = true;
  minusBtn.classList.add("countBtnDisabled");
  minusBtn.querySelector("img").src = "./assets/icon-minus-line-disabled.svg";
}

if (product.stock === 0) {
  num.value = 0;
  minusBtnDisabled();
  plusBtnDisabled();
  buyBtn.disabled = true;
  cartBtn.disabled = true;
  total.textContent = 0;
  totalPrice.textContent = 0;
} else if (product.stock === 1) {
  plusBtnDisabled();
}

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
    total.textContent = num.value;

    totalPrice.textContent = new Intl.NumberFormat("ko-KR").format(
      Number(num.value) * product.price + product.shipping_fee
    );

    if (total.textContent === "0") {
      totalPrice.textContent = "0";
    }

    if (num.value === "0") {
      plusBtnEnabled();
      minusBtnDisabled();
      buyBtn.disabled = true;
      cartBtn.disabled = true;
    } else if (num.value !== "0") {
      minusBtnEnabled();
      buyBtn.disabled = false;
      cartBtn.disabled = false;

      if (product.stock <= num.value) {
        plusBtnDisabled();
      } else {
        plusBtnEnabled();
      }
    }
  });
});

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

  buyBtn.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.setItem(
      "orderItem",
      JSON.stringify({
        order_kind: "direct_order",
        product: product.id,
        quantity: parseInt(num.value),
        name: product.name,
        seller: product.seller,
        price: product.price,
        shipping_fee: product.shipping_fee,
        image: product.image,
        info: product.info,
      })
    );
    location.href = "order.html";
  });
}
