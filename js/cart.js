if (localStorage.getItem("type") === "BUYER") {
  loadCart();
} else if (!localStorage.getItem("type")) {
  alert("구매회원 전용 페이지 입니다. 로그인 페이지로 이동합니다.");
  location.href = "login.html";
} else {
  alert("비정상적인 접속 경로 입니다. 메인페이지로 이동합니다.");
  location.href = "index.html";
}

const cartInfo = document.querySelector(".cart-info");
const cartForm = document.querySelector("main form");
const cartItems = cartForm.querySelector(".cart-item");
const cartCalc = document.querySelector(".cart-calc");

const allCheckBtn = cartInfo.querySelector(".all-check-btn");
allCheckBtn.classList.add("active");
allCheckBtn.addEventListener("click", () => {
  const allCheckbox = cartItems.querySelectorAll("input[type=checkbox]");
  allCheckBtn.classList.toggle("active");
  if (!allCheckBtn.classList.contains("active")) {
    allCheckbox.forEach((checkbox) => {
      checkbox.checked = false;
    });
    changeTotalPrice();
  } else {
    allCheckbox.forEach((checkbox) => {
      checkbox.checked = true;
    });
    changeTotalPrice();
  }
});

const allDeleteBtn = cartInfo.querySelector(".all-delete-btn");
allDeleteBtn.addEventListener("click", () => {
  fetch(`${fetchUrl}/cart/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  }).then((response) => {
    if (!response.ok) {
      console.error("Error:", response);
    }
    allCheckBtn.classList.remove("active");
    return loadCart();
  });
});

function deleteCart(id) {
  fetch(`${fetchUrl}/cart/${id}/`, {
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

function changeQuantity(e, id, quantity, stock) {
  const isPlusBtn =
    e.target.classList.contains("plus") ||
    e.target.parentElement.classList.contains("plus");

  function fetchChangeQuantity(id, quantity) {
    fetch(`${fetchUrl}/cart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        quantity: quantity,
      }),
    }).then((response) => {
      if (!response.ok) {
        console.error("Error:", response);
        location.href = "error.html";
      }
      return loadCart();
    });
  }
  if (isPlusBtn && quantity >= stock) {
    quantity = stock;
    return alert("재고 수량을 초과 하여 상품 수량을 추가할 수 없습니다.");
  }
  if (!isPlusBtn && quantity <= 1) {
    quantity = 1;
    return;
  }

  if (isPlusBtn) {
    quantity += 1;
    fetchChangeQuantity(id, quantity);
  } else {
    quantity -= 1;
    fetchChangeQuantity(id, quantity);
  }
}
function directOrder(e, orderInfo) {
  e.preventDefault();

  const product = JSON.parse(decodeURIComponent(orderInfo));
  const productInfo = product.product;

  localStorage.setItem(
    "orderItem",
    JSON.stringify({
      order_kind: "direct_order",
      product: productInfo.id,
      quantity: product.quantity,
      name: productInfo.name,
      seller: productInfo.seller.store_name,
      price: productInfo.price,
      shipping_fee: productInfo.shipping_fee,
      image: productInfo.image,
      info: productInfo.info,
    })
  );
  location.href = "order.html";
}
const totalShippingFeeEl = cartCalc.querySelector(".total-shipping-fee");
const totalPriceEl = cartCalc.querySelector(".total-price ");
const paymentPriceEl = cartCalc.querySelector(".payment-amount");

function changeTotalPrice() {
  let totalShippingFee = 0;
  let totalPrice = 0;
  let totalPaymentPrice = 0;

  cartItems.querySelectorAll("li article").forEach((article) => {
    const isCheckboxChecked = article.querySelector("input").checked === true;
    const goodsPrice = parseInt(
      article
        .querySelector(".goods-details span")
        .textContent.replaceAll(",", "")
    );
    const shippingFeeText = article.querySelector(
      ".goods-details p:last-of-type"
    ).textContent;
    const shippingFee =
      shippingFeeText.split(":")[1] !== undefined
        ? parseInt(shippingFeeText.split(":")[1].replaceAll(",", ""))
        : 0;
    const paymentPrice = parseInt(
      article.querySelector(".goods-price p").textContent.replaceAll(",", "")
    );
    const totalQuantity = parseInt(
      article.querySelector(".goods-quantity input").value
    );

    if (isCheckboxChecked) {
      totalPrice += goodsPrice * totalQuantity;
      totalShippingFee += shippingFee;
      totalPaymentPrice += paymentPrice;
    }

    totalShippingFeeEl.textContent = totalShippingFee.toLocaleString("ko-KR");
    totalPriceEl.textContent = totalPrice.toLocaleString("ko-KR");
    paymentPriceEl.textContent = totalPaymentPrice.toLocaleString("ko-KR");
  });
}

function cartOrder(e, orderList) {
  e.preventDefault();

  const products = JSON.parse(decodeURIComponent(orderList)).results;

  localStorage.setItem(
    "orderItem",
    JSON.stringify({
      order_kind: "cart_order",
      productList: products,
      totalPrice: parseInt(totalPriceEl.textContent.replaceAll(",", "")),
      totalFee: parseInt(totalShippingFeeEl.textContent.replaceAll(",", "")),
      totalPaymentPrice: parseInt(
        paymentPriceEl.textContent.replaceAll(",", "")
      ),
    })
  );
  location.href = "order.html";
}

function loadCart() {
  fetch(`${fetchUrl}/cart/`, {
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
      const cartOrderBtn = cartForm.querySelector(".buy-btn");
      cartOrderBtn.addEventListener("click", (e) =>
        cartOrder(e, encodeURIComponent(JSON.stringify(json)))
      );

      if (json.count >= 1) {
        const cartResults = json.results;

        cartItems.innerHTML = cartResults
          .map((result, idx) => {
            let quantity = result.quantity;
            if (quantity >= result.product.stock) {
              quantity = result.product.stock;
            }

            return `<li>
            <article>
              <input type="checkbox" id="check${idx}" checked onClick = "changeTotalPrice()"/>
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
                  <button class="minus" type="button" id="minus" onClick="changeQuantity(event, ${
                    result.id
                  },${quantity},${result.product.stock})">
                    <img src="./assets/icon-minus-line.svg" alt="수량 빼기" />
                  </button>
                  <input type="number" min="1" value="${quantity}" id="num" disabled />
                  <button class="plus" type="button" id="plus" onClick="changeQuantity(event, ${
                    result.id
                  },${quantity},${result.product.stock})">
                    
                    <img src="./assets/icon-plus-line.svg" alt="수량 더하기" />
                  </button>
                </div>
                <div class="goods-price">
                  <p>${(
                    quantity * result.product.price +
                    result.product.shipping_fee
                  ).toLocaleString("ko-KR")}원</p>
                  <button type="submit" class="buy-btn" onClick="directOrder(event, '${encodeURIComponent(
                    JSON.stringify(result)
                  )}')">주문하기</button>
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
        changeTotalPrice();
      } else {
        cartForm.innerHTML = `<p class = "empty-cart">장바구니에 담긴 상품이 없습니다.</p>
        <span>원하는 상품을 장바구니에 담아보세요!</span>`;
        allDeleteBtn.style.display = "none";
      }
    });
}
