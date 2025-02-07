const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

if (
  !localStorage.getItem("type") ||
  localStorage.getItem("type") !== "BUYER" ||
  !productId
) {
  alert("비정상적인 접속 경로 입니다. 메인페이지로 이동합니다.");
  location.href = "index.html";
}
const main = document.querySelector("main");
const orderList = main.querySelector(".order-list ul");
const totalPrice = main.querySelector(".total-price");
const paymentInfo = main.querySelectorAll(".total-payment-info li span");
const deliveryForm = main.querySelector(".delivery-info form");
const inputs = deliveryForm.querySelectorAll("input");
const cancelBtn = deliveryForm.querySelector(".cancelBtn");

function deliveryStatus(status) {
  switch (status) {
    case "payment_pending":
      return "결제 대기중";
    case "payment_complete":
      return "결제 완료";
    case "preparing":
      return "상품 준비 중";
    case "shipping":
      return "배송 중";
    case "delivered":
      return "배송 완료";
    case "cancelled":
      return "주문취소";
    default:
      return "에러";
  }
}

function paymentMethod(payment) {
  switch (payment) {
    case "card":
      return (inputs[8].checked = true);
    case "deposit":
      return (inputs[9].checked = true);
    case "phone":
      return (inputs[10].checked = true);
    case "naverpay":
      return (inputs[11].checked = true);
    case "kakaopay":
      return (inputs[12].checked = true);
    default:
      return "에러";
  }
}

function viewOrderDetail() {
  fetch(`${fetchUrl}/order/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Error : ", error);
      }
      return response.json();
    })
    .then((json) => {
      const orderData = json.order_items;
      // 판매자가 상품을 취소한경우 예외 처리 필요

      let totalFee = 0;
      let totalUnitPrice = 0;

      orderList.innerHTML = orderData
        .map((product) => {
          totalFee += product.ordered_shipping_fee;
          totalUnitPrice += product.ordered_unit_price;

          const productInfo = product.product;
          return `<li>
      <article>
        <img src="${productInfo.image}" alt="${productInfo.info}" />
        <div class="order-details">
          <p>${productInfo.seller.store_name}</p>
          <h3>${productInfo.name}</h3>
          <p>수량 : <span>${product.ordered_quantity}</span>개</p>
        </div>
        <p class="discount">-</p>
        <p class="fee">${
          product.ordered_shipping_fee > 0
            ? product.ordered_shipping_fee.toLocaleString("ko-KR") + "원"
            : "무료배송"
        }</p>
        <p class="price">${product.item_total_price.toLocaleString(
          "ko-KR"
        )}원</p>
      </article>
      </li>`;
        })
        .join("");

      totalPrice.querySelector(
        "span"
      ).textContent = `${json.total_price.toLocaleString("ko-KR")}원`;
      inputs[0].value = json.receiver;
      if (json.receiver_phone_number.length === 11) {
        inputs[1].value = json.receiver_phone_number.slice(0, 3);
        inputs[2].value = json.receiver_phone_number.slice(3, 7);
        inputs[3].value = json.receiver_phone_number.slice(7);
      } else {
        inputs[1].value = json.receiver_phone_number.slice(0, 3);
        inputs[2].value = json.receiver_phone_number.slice(3, 6);
        inputs[3].value = json.receiver_phone_number.slice(6);
      }
      inputs[6].value = json.address;
      inputs[7].value =
        json.delivery_message === null
          ? "배송 메세지가 없습니다"
          : json.delivery_message;

      deliveryStatus(json.order_status) === "주문취소"
        ? ((cancelBtn.disabled = true),
          (cancelBtn.textContent = "주문취소완료"))
        : (cancelBtn.disabled = false);
      paymentMethod(json.payment_method);
      paymentInfo[3].textContent = json.total_price.toLocaleString("ko-KR");
      paymentInfo[0].textContent = totalUnitPrice.toLocaleString("ko-KR");
      paymentInfo[2].textContent = totalFee.toLocaleString("ko-KR");
    });
}

if (!!productId) {
  viewOrderDetail();
}

function orderCancel() {
  fetch(`${fetchUrl}/order/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  }).then((response) => {
    if (!response.ok) {
      console.error("Error", error);
    }
    alert(`주문 취소가 완료되었습니다.`);
    viewOrderDetail();
  });
}

deliveryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  orderCancel();
});
