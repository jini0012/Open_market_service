if (localStorage.getItem("type") === "SELLER") {
  location.href = "error.html";
} else {
  loadCart();
}

const cartInfo = document.querySelector(".cart-info");
const cartForm = document.querySelector("main form");
const cartItems = cartForm.querySelector(".cart-item");
const cartCalc = document.querySelector(".cart-calc");

function deleteCart(id) {
  fetch(`https://estapi.openmarket.weniv.co.kr/cart/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  }).then((response) => {
    if (!response.ok) {
      console.error("Error:", response);
    }
    return loadCart();
  });
}

function loadCart() {
  fetch("https://estapi.openmarket.weniv.co.kr/cart/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Error:", response);
        location.href = "error.html";
      }
      return response.json();
    })
    .then((json) => {
      let totalShippingFee = 0;
      let totalPrice = 0;
      let paymentPrice = 0;
      const totalShippingFeeEl = cartCalc.querySelector(".total-shipping-fee");
      const totalPriceEl = cartCalc.querySelector(".total-price ");
      const paymentPriceEl = cartCalc.querySelector(".payment-amount");

      if (json.count >= 1) {
        const cartResults = json.results;

        cartItems.innerHTML = cartResults
          .map((result, idx) => {
            let quantity = result.quantity;
            totalShippingFee += result.product.shipping_fee;
            totalShippingFeeEl.textContent =
              totalShippingFee.toLocaleString("ko-KR");
            totalPrice += result.product.price * quantity;
            totalPriceEl.textContent = totalPrice.toLocaleString("ko-KR");
            paymentPrice = totalPrice + totalShippingFee;
            paymentPriceEl.textContent = paymentPrice.toLocaleString("ko-KR");

            return `<li>
            <article>
              <input type="checkbox" id="check${idx}" />
              <label for="check${idx}">
                <div class="goods-details">
                  <img src="${result.product.image}" alt="${
              result.product.info
            }" />
                  <p>${result.product.seller.store_name}</p>
                  <h3>${result.product.name}</h3>
                  <span>${result.product.price.toLocaleString("ko-KR")}</span>
                  <p>${
                    result.product.shipping_method === "DELIVERY"
                      ? "화물운송"
                      : "택배배송"
                  } / ${
              result.product.shipping_fee === 0
                ? "무료배송"
                : "배송비 : " +
                  result.product.shipping_fee.toLocaleString("ko-KR") +
                  "원"
            }</p>
                </div>
                <div class="goods-quantity">
                  <button class="minus" type="button" id="minus">
                    <img src="./assets/icon-minus-line.svg" alt="수량 빼기" />
                  </button>
                  <input type="number" min="1" value="${quantity}" id="num" disabled />
                  <button class="plus" type="button" id="plus">
                    <img src="./assets/icon-plus-line.svg" alt="수량 더하기" />
                  </button>
                </div>
                <div class="goods-price">
                  <p>${(
                    quantity * result.product.price +
                    result.product.shipping_fee
                  ).toLocaleString("ko-KR")}원</p>
                  <button type="submit" class="buy-btn">주문하기</button>
                </div>
                <button type="submit" class="delete-btn" id="delete-btn-${idx}" onClick="deleteCart(${
              result.id
            })">
                  <img src="./assets/icon-delete.svg" alt="상품 제거하기 버튼" />
                </button>
              </label>
            </article>
          </li>`;
          })
          .join("");
      } else {
        cartForm.innerHTML = `<p class = "empty-cart">장바구니에 담긴 상품이 없습니다.</p>
        <span>원하는 상품을 장바구니에 담아보세요!</span>`;
        allDeleteBtn.style.display = "none";
      }
    });
}

const allCheckBtn = cartInfo.querySelector(".all-check-btn");
allCheckBtn.addEventListener("click", () => {
  const allCheckbox = cartItems.querySelectorAll("input[type=checkbox]");
  allCheckbox.forEach((checkbox) => {
    checkbox.checked = "true";
  });
});

const allDeleteBtn = cartInfo.querySelector(".all-delete-btn");
allDeleteBtn.addEventListener("click", () => {
  fetch(`https://estapi.openmarket.weniv.co.kr/cart/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  }).then((response) => {
    if (!response.ok) {
      console.error("Error:", response);
    }
    return loadCart();
  });
});
