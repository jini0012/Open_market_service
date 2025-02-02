localStorage.removeItem("product_info");
if (!localStorage.getItem("type") || localStorage.getItem("type") !== "BUYER") {
  alert("비정상적인 접속 경로 입니다. 메인페이지로 이동합니다.");
  location.href = "index.html";
}

const orderData = JSON.parse(localStorage.getItem("orderItem"));
const orderList = document.querySelector(".order-list");
const totalPrice = document.querySelector(".total-price");
if (orderData.order_kind === "direct_order") {
  orderList.querySelector("ul").innerHTML = `<li>
            <article>
              <img src="${orderData.image}" alt="${orderData.info}" />
              <div class="order-details">
                <p>${orderData.seller}</p>
                <h3>${orderData.name}</h3>
                <p>수량 : <span>${orderData.quantity}</span>개</p>
              </div>
              <p class="discount">-</p>
              <p class="fee">${
                orderData.shipping_fee > 0
                  ? orderData.shipping_fee.toLocaleString("ko-KR") + "원"
                  : "무료배송"
              }</p>
              <p class="price">${(
                orderData.quantity * orderData.price
              ).toLocaleString("ko-KR")}원</p>
            </article>
          </li>`;

  totalPrice.querySelector("span").textContent = `${(
    orderData.quantity * orderData.price +
    orderData.shipping_fee
  ).toLocaleString("ko-KR")}원`;
}

