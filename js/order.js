localStorage.removeItem("product_info");
if (!localStorage.getItem("type") || localStorage.getItem("type") !== "BUYER") {
  alert("비정상적인 접속 경로 입니다. 메인페이지로 이동합니다.");
  location.href = "index.html";
}

const orderData = JSON.parse(localStorage.getItem("orderItem"));
const orderList = document.querySelector(".order-list");
const totalPrice = document.querySelector(".total-price");
const paymentInfo = document.querySelectorAll(".total-payment-info li span");

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

  paymentInfo[0].textContent = (
    orderData.quantity * orderData.price
  ).toLocaleString("ko-KR");
  paymentInfo[2].textContent = orderData.shipping_fee.toLocaleString("ko-KR");
  paymentInfo[3].textContent = (
    orderData.quantity * orderData.price +
    orderData.shipping_fee
  ).toLocaleString("ko-KR");
}

const deliveryForm = document.querySelector(".delivery-info form");

deliveryForm.addEventListener("input", () => {
  const requiredInputs = deliveryForm.querySelectorAll(
    "input:not(input[type='radio'])"
  );
  const requiredCheckbox = deliveryForm.querySelector('input[type="checkbox"]');
  const payButton = deliveryForm.querySelector('button[type="submit"]');

  let inputValid = 0;
  requiredInputs.forEach((input) => {
    if (input.value !== "") {
      inputValid += 1;
    }
  });

  if (inputValid >= 13 && requiredCheckbox.checked === true) {
    payButton.disabled = false;
  } else {
    payButton.disabled = true;
  }
});

deliveryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const receiverData = deliveryForm.querySelector(".address-info");
  const receiver = receiverData.querySelector("#addressee");
  const receiverPhoneNum = receiverData.querySelectorAll("#phone2");
  const receiverAddress = receiverData.querySelectorAll(".address input");
  const receiverMsg = receiverData.querySelector("#msg");
  const selectedPayment = deliveryForm.querySelector(
    `input[type="radio"]:checked`
  );

  function directOrder() {
    fetch(`${fetchUrl}/order/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
      body: JSON.stringify({
        order_type: orderData.order_kind,
        product: orderData.product,
        quantity: orderData.quantity,
        total_price:
          orderData.quantity * orderData.price + orderData.shipping_fee,
        receiver: receiver.value,
        receiver_phone_number:
          receiverPhoneNum[0].value +
          receiverPhoneNum[1].value +
          receiverPhoneNum[2].value,
        address: receiverAddress[1].value + receiverAddress[2].value,
        address_message:
          receiverMsg.value.trim() === "" ? null : receiverMsg.value.trim(),
        payment_method: selectedPayment.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Error : ", error);
        }
        return response.json();
      })
      .then((json) => {
        alert("주문이 완료되었습니다. 메인페이지로 이동합니다.");
        location.href = "index.html";
        localStorage.removeItem("orderItem");
      });
  }

  directOrder();
});
