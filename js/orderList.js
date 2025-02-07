if (
  !localStorage.getItem("type") ||
  localStorage.getItem("type") === "SELLER"
) {
  alert("비정상적인 접속 경로 입니다. 메인페이지로 이동합니다.");
  location.href = "index.html";
} else {
  loadOrderList();
}

const user = JSON.parse(decodeURIComponent(localStorage.user)).name;

const main = document.querySelector("main");
main.querySelector("h2 span").textContent = user;

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

function orderCancel(orderNum) {
  fetch(`${fetchUrl}/order/${orderNum}`, {
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
    loadOrderList();
  });
}
function orderDetail(id) {
  location.href = `orderDetail.html?id=${id}`;
}

function loadOrderList() {
  fetch(`${fetchUrl}/order/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error("error :", error);
        location.href = "error.html";
      }
      return response.json();
    })
    .then((json) => {
      const orderLists = json.results;
      main.querySelector(".order-quantity span").textContent = json.count;
      main.querySelector(".goods").innerHTML = orderLists
        .map((result) => {
          console.log(result);

          if (result.order_items.length === 0) {
            return `<li>
            <article>
              <div class="goods-details">
                <h3>판매자가 상품 판매를 취소한 상품입니다.</h3>
                <p>주문을 취소해주세요</span></p>
              </div>
              <p class="price">${result.total_price.toLocaleString(
                "ko-KR"
              )}원</p>
                <button onClick ="orderDetail(
                 ${result.id}
                )">상세보기</button>
                <button class="deleteBtn" onClick ="orderCancel(
                 ${result.id}
                )">주문취소</button>
            </article>
          </li>`;
          }
          return `<li>
            <article>
              <div class="goods-details">
                <h3>${
                  result.order_items.length > 1
                    ? result.order_items[0].product.name +
                      " 외 " +
                      result.order_items.length +
                      "건"
                    : result.order_items[0].product.name
                }</h3>
                <p>주문번호 : <span>${result.order_number}</span></p>
                <p>주문상태 : <span>${deliveryStatus(
                  result.order_status
                )}</span></p>
              </div>
              <p class="price">${result.total_price.toLocaleString(
                "ko-KR"
              )}원</p>
                <button onClick ="orderDetail(
                 ${result.id}
                )">상세보기</button>
                <button class="deleteBtn" onClick ="orderCancel(
                 ${result.id}
                )">주문취소</button>
            </article>
          </li>`;
        })
        .join("");
    });
}
