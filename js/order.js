if (!localStorage.getItem("type") || localStorage.getItem("type") !== "BUYER") {
  alert("비정상적인 접속 경로 입니다. 메인페이지로 이동합니다.");
  location.href = "index.html";
}

const orderItem = JSON.parse(localStorage.getItem("orderItem"));
const orderList = document.querySelector(".order-list");
const totalPrice = document.querySelector(".total-price");

if (orderItem.order_kind === "direct_order") {
  orderList.querySelector("ul").innerHTML = `<li>
            <article>
              <img src="${orderItem.image}" alt="${orderItem.info}" />
              <div class="order-details">
                <p>${orderItem.seller}</p>
                <h3>${orderItem.name}</h3>
                <p>수량 : <span>${orderItem.quantity}</span>개</p>
              </div>
              <p class="discount">-</p>
              <p class="fee">${
                orderItem.shipping_fee > 0
                  ? orderItem.shipping_fee + "원"
                  : "무료배송"
              }</p>
              <p class="price">${(
                orderItem.quantity * orderItem.price
              ).toLocaleString("ko-KR")}원</p>
            </article>
          </li>`;

  totalPrice.querySelector("span").textContent = `${(
    orderItem.quantity * orderItem.price +
    orderItem.shipping_fee
  ).toLocaleString("ko-KR")}원`;
}

